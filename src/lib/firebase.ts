import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

let app: FirebaseApp | null = null;
let database: Database | null = null;

function isFirebaseConfigured(): boolean {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.databaseURL &&
    firebaseConfig.projectId
  );
}

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;

  try {
    if (!app && getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else if (!app) {
      app = getApps()[0];
    }
    return app;
  } catch {
    console.warn('Firebase initialization failed');
    return null;
  }
}

export function getFirebaseDatabase(): Database | null {
  if (database) return database;

  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;

  try {
    database = getDatabase(firebaseApp);
    return database;
  } catch {
    console.warn('Firebase Database initialization failed');
    return null;
  }
}
