// lib/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB0uW-JiIylNkpNS9fGCKj6g8iu1A2Pvwg",
  authDomain: "my-diagnose-app.firebaseapp.com",
  projectId: "my-diagnose-app",
  storageBucket: "my-diagnose-app.firebasestorage.app",
  messagingSenderId: "919354656456",
  appId: "1:919354656456:web:7a8fc70a28956ec47ec7fd",
  measurementId: "G-KZL8V25YXE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
