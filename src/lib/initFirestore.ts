import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import {
  CATEGORIES,
  PLATFORMS,
  SHORTCUTS_DATA,
} from './shortcuts-data';

export async function initializeFirestore() {
  console.log('Initializing Firestore with data...');

  try {
    await initializePlatforms();
    await initializeCategories();
    await initializeShortcuts();

    console.log('Firestore initialization completed successfully!');
    return true;
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    return false;
  }
}

async function initializePlatforms() {
  console.log('Initializing platforms...');
  const platformsCollection = collection(db, 'platforms');

  const snapshot = await getDocs(platformsCollection);
  if (!snapshot.empty) {
    console.log(
      `Found ${snapshot.size} existing platforms. Skipping initialization.`,
    );
    return;
  }

  for (const platform of PLATFORMS) {
    await addDoc(platformsCollection, {
      name: platform.name,
      icon: platform.icon || null,
      description: platform.description,
      originalId: platform.id, // Keep the original ID for reference
    });
    console.log(`Added platform: ${platform.name}`);
  }

  console.log(`Added ${PLATFORMS.length} platforms to Firestore.`);
}

async function initializeCategories() {
  console.log('Initializing categories...');
  const categoriesCollection = collection(db, 'categories');

  const snapshot = await getDocs(categoriesCollection);
  if (!snapshot.empty) {
    console.log(
      `Found ${snapshot.size} existing categories. Skipping initialization.`,
    );
    return;
  }

  for (const category of CATEGORIES) {
    await addDoc(categoriesCollection, {
      name: category.name,
      color: category.color,
      originalId: category.id, // Keep the original ID for reference
    });
    console.log(`Added category: ${category.name}`);
  }

  console.log(`Added ${CATEGORIES.length} categories to Firestore.`);
}

async function initializeShortcuts() {
  console.log('Initializing shortcuts...');
  const shortcutsCollection = collection(db, 'shortcuts');

  const snapshot = await getDocs(shortcutsCollection);
  if (!snapshot.empty) {
    console.log(
      `Found ${snapshot.size} existing shortcuts. Skipping initialization.`,
    );
    return;
  }

  for (const shortcut of SHORTCUTS_DATA) {
    await addDoc(shortcutsCollection, {
      title: shortcut.title,
      shortcut: shortcut.shortcut,
      description: shortcut.description,
      category: shortcut.category,
      platform: shortcut.platform,
      originalId: shortcut.id, // Keep the original ID for reference
    });
    console.log(`Added shortcut: ${shortcut.title}`);
  }

  console.log(`Added ${SHORTCUTS_DATA.length} shortcuts to Firestore.`);
}

export async function isFirestoreInitialized() {
  try {
    const platformsCollection = collection(db, 'platforms');
    const snapshot = await getDocs(platformsCollection);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking if Firestore is initialized:', error);
    return false;
  }
}
