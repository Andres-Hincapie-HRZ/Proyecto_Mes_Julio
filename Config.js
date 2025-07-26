// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDT4a9WumVBIGHsiBLcLSTn8kZPpV_hijY", // Clave de API para autenticar con Firebase
    authDomain: "proyecto-mes-julio.firebaseapp.com", // Dominio de autenticación de Firebase
    projectId: "proyecto-mes-julio", // ID del proyecto en Firebase
    storageBucket: "proyecto-mes-julio.firebasestorage.app", // Bucket de almacenamiento en Firebase
    messagingSenderId: "285166641330", // ID del remitente para mensajes (notificaciones)
    appId: "1:285166641330:web:e5c5cd3c4da4bef05b69ab", // ID de la aplicación
    measurementId: "G-ZV24LDPJ8G" // ID para medición (Google Analytics)
};

// Inicialización de la app de Firebase con la configuración anterior
firebase.initializeApp(firebaseConfig);

// Se obtiene la referencia a la base de datos Firestore de Firebase
const db = firebase.firestore();

// Función asíncrona para subir una imagen a imgBB
async function subirImagenAImgBB(archivo) {
    // Se crea un nuevo objeto FormData para enviar la imagen
    const formData = new FormData();
    // Se agrega el archivo de imagen al FormData bajo la clave 'image'
    formData.append('image', archivo);

    try {
        // Se realiza una petición POST a la API de imgBB con la imagen adjunta
        const response = await fetch('https://api.imgbb.com/1/upload?key=fb090f1e8752c6cbd2b205df0f0e2605', {
            method: 'POST', // Método HTTP POST
            body: formData, // El cuerpo de la petición es el FormData con la imagen
            headers: { 'Accept': 'application/json' } // Se espera una respuesta en formato JSON
        });
        
        // Si la respuesta no es exitosa, se lanza un error con el código de estado HTTP
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        // Se convierte la respuesta a JSON
        const data = await response.json();
        // Si la subida fue exitosa, se retorna la URL de la imagen subida
        if (data.success) return data.data.url;
        // Si la respuesta de imgBB indica fallo, se lanza un error
        throw new Error('Error en la respuesta de imgBB');
    } catch (error) {
        // Si ocurre cualquier error, se muestra en consola y se vuelve a lanzar el error
        console.error('Error al subir imagen:', error);
        throw error;
    }
} 