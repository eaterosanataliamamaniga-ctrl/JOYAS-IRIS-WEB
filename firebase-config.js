// Configuración de Firebase - JOYAS Y ACCESORIOS IRIS
// Credenciales del proyecto: iris-joyeria
const firebaseConfig = {
  apiKey: 'AIzaSyBV5B7NLbvocw8ea2BEaCBxXVyoFU_u6hY',
  authDomain: 'iris-joyeria.firebaseapp.com',
  projectId: 'iris-joyeria',
  storageBucket: 'iris-joyeria.firebasestorage.app',
  messagingSenderId: '277019120496',
  appId: '1:277019120496:web:26ee0d61b3a6a921ba35b5',
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Referencias a servicios de Firebase
const db = firebase.firestore();
// Storage desactivado - Usamos Cloudinary para imágenes
// const storage = firebase.storage();

// Exportar referencias
window.db = db;
// window.storage = storage; // No necesario con Cloudinary

console.log('✅ Firebase inicializado correctamente');
console.log('📸 Imágenes: Cloudinary (sin Storage)');
