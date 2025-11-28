// Firebase Configuration
// IMPORTANTE: Reemplaza estos valores con tu configuración real de Firebase Console
// https://console.firebase.google.com/ > Project Settings > General > Your apps

const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  databaseURL: "https://tu-proyecto-default-rtdb.firebaseio.com" // Si usas Realtime Database
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Exportar referencias para usar en otros archivos
const auth = firebase.auth();
const db = firebase.firestore(); // Firestore (recomendado)
const rtdb = firebase.database(); // Realtime Database (alternativa)
const storage = firebase.storage();

// Configurar persistencia de autenticación
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .catch((error) => {
    console.error('Error al configurar persistencia:', error);
  });

console.log('Firebase inicializado correctamente');
