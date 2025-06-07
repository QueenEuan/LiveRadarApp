import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC6yScIlNdXy64gkaHoAydEHYOsZUJZPC8",
  authDomain: "liveradar-c3cde.firebaseapp.com",
  projectId: "liveradar-c3cde",
  storageBucket: "liveradar-c3cde.firebasestorage.app",
  messagingSenderId: "423550952840",
  appId: "1:423550952840:web:d4dfc639a697e3b84e863d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);