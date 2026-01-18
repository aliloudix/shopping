import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Remplacez les valeurs ci-dessous par celles de votre console Firebase
// Allez dans Project Settings > General > Your apps > Web app
const firebaseConfig = {
  apiKey: "AIzaSyAVe9JjH1l0R4jWMYV5P_hHjcjfzvKJiig",
  authDomain: "devmob-shop.firebaseapp.com",
  projectId: "devmob-shop",
  storageBucket: "devmob-shop.firebasestorage.app",
  messagingSenderId: "860685016804",
  appId: "1:860685016804:web:66cc7233a323c4827e56f1",
  measurementId: "G-S4GE8QMY6B"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Initialisation de l'Auth avec persistance AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default app;
