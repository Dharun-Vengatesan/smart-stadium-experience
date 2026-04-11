import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// ==========================================================
// FIREBASE CONFIGURATION SETUP
// ==========================================================
// 1. Go to https://console.firebase.google.com/
// 2. Create a project and add a Web App
// 3. Copy your project's config below (or use .env for production)

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "placeholder-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface QueueData {
  id: string;
  name: string;
  wait: number;
  level: 'low' | 'medium' | 'high';
  insight: string;
}

/**
 * Fetches live stadium queue data from Firestore.
 * If data or keys are missing, it throws an error to trigger the fallback UI.
 */
export const fetchLiveQueues = async (): Promise<QueueData[]> => {
  if (firebaseConfig.apiKey === "placeholder-key" || !firebaseConfig.projectId) {
    throw new Error('Sensor unavailable: No Firebase Config');
  }

  try {
    const querySnapshot = await getDocs(collection(db, 'queues'));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as QueueData));
    
    if (data.length === 0) throw new Error('Sensor unavailable: Empty database');
    return data;
  } catch (error) {
    console.error('Firebase read error:', error);
    throw new Error('Sensor unavailable');
  }
};

export { db };
