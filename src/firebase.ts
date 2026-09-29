import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import config from '../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Use custom firestoreDatabaseId if configured, else default
const customDbId = (config as Record<string, any>).firestoreDatabaseId;
export const db = customDbId && customDbId !== '(default)'
  ? getFirestore(app, customDbId)
  : getFirestore(app);

export const auth = getAuth(app);
export default app;
