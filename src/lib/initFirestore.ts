import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import { PLATFORMS, CATEGORIES, SHORTCUTS_DATA } from '../../toMigrateFirebase/shortcuts-data';

/**
 * Initialize Firestore with data from the toMigrateFirebase folder
 */
export async function initializeFirestore() {
  console.log('Initializing Firestore with data...');
  
  try {
    // Initialize platforms
    await initializePlatforms();
    
    // Initialize categories
    await initializeCategories();
    
    // Initialize shortcuts
    await initializeShortcuts();
    
    console.log('Firestore initialization completed successfully!');
    return true;
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    return false;
  }
}

/**
 * Initialize platforms collection
 */
async function initializePlatforms() {
  console.log('Initializing platforms...');
  const platformsCollection = collection(db, 'platforms');
  
  // Check if platforms already exist
  const snapshot = await getDocs(platformsCollection);
  if (!snapshot.empty) {
    console.log(`Found ${snapshot.size} existing platforms. Skipping initialization.`);
    return;
  }
  
  // Add platforms
  for (const platform of PLATFORMS) {
    await addDoc(platformsCollection, {
      name: platform.name,
      icon: platform.icon || null,
      description: platform.description,
      originalId: platform.id // Keep the original ID for reference
    });
    console.log(`Added platform: ${platform.name}`);
  }
  
  console.log(`Added ${PLATFORMS.length} platforms to Firestore.`);
}

/**
 * Initialize categories collection
 */
async function initializeCategories() {
  console.log('Initializing categories...');
  const categoriesCollection = collection(db, 'categories');
  
  // Check if categories already exist
  const snapshot = await getDocs(categoriesCollection);
  if (!snapshot.empty) {
    console.log(`Found ${snapshot.size} existing categories. Skipping initialization.`);
    return;
  }
  
  // Add categories
  for (const category of CATEGORIES) {
    await addDoc(categoriesCollection, {
      name: category.name,
      color: category.color,
      originalId: category.id // Keep the original ID for reference
    });
    console.log(`Added category: ${category.name}`);
  }
  
  console.log(`Added ${CATEGORIES.length} categories to Firestore.`);
}

/**
 * Initialize shortcuts collection
 */
async function initializeShortcuts() {
  console.log('Initializing shortcuts...');
  const shortcutsCollection = collection(db, 'shortcuts');
  
  // Check if shortcuts already exist
  const snapshot = await getDocs(shortcutsCollection);
  if (!snapshot.empty) {
    console.log(`Found ${snapshot.size} existing shortcuts. Skipping initialization.`);
    return;
  }
  
  // Add shortcuts
  for (const shortcut of SHORTCUTS_DATA) {
    await addDoc(shortcutsCollection, {
      title: shortcut.title,
      shortcut: shortcut.shortcut,
      description: shortcut.description,
      category: shortcut.category,
      platform: shortcut.platform,
      originalId: shortcut.id // Keep the original ID for reference
    });
    console.log(`Added shortcut: ${shortcut.title}`);
  }
  
  console.log(`Added ${SHORTCUTS_DATA.length} shortcuts to Firestore.`);
}

/**
 * Check if Firestore has been initialized
 */
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