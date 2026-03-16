import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";

// Configuração do Firebase - Usando valores públicos (seguros para frontend)
// IMPORTANTE: Substitua com suas credenciais reais do Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKey123456789",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "storyweaver-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "storyweaver-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "storyweaver-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth
export const auth = getAuth(app);

// Configurar persistência local
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Erro ao configurar persistência do Firebase:", error);
});

// Criar provider do Google
export const googleProvider = new GoogleAuthProvider();

// Configurar escopos do Google
googleProvider.addScope("profile");
googleProvider.addScope("email");

export default app;
