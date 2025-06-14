import { InitializeFirestore } from '@/components/initialize-firestore';

export default function FirebaseAdminPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Firebase Administration
      </h1>

      <div className="grid gap-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Initialize Firestore Data
          </h2>
          <InitializeFirestore />
        </section>
      </div>
    </div>
  );
}
