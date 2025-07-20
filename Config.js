// condiguracion firebase
const firebaseConfig = {
    apiKey: "AIzaSyAxvHQ52DeFk1g765EFyMsyqEtx95xMibQ",
    authDomain: "proyecto-mes-julio-66023.firebaseapp.com",
    projectId: "proyecto-mes-julio-66023",
    storageBucket: "proyecto-mes-julio-66023.firebasestorage.app",
    messagingSenderId: "963435444575",
    appId: "1:963435444575:web:98dbafd4ea5941bb585eea",
    measurementId: "G-DBW7CRV7S6"
};

// inicializar firebase
const app = firebase.initializeApp(firebaseConfig);

// obtener bd
const db = firebase.firestore(app);

// funcion asincrona para subir imagen a img bb
async function subirImagenImgBB(archivo) {
    // obtner objeto para subir imagen 
    const formData = new FormData();
    // agregar el img al formdata
    formData.append("image", archivo);


    // Subir imagen a img bb
    try {
        const respuesta = await fetch(`https://api.imgbb.com/1/upload?key=1:963435444575:web:98dbafd4ea5941bb585eea`, {
            method: "POST", // tipo de  metodo http post
            body: formData, // datos a enviar
            headers: { 'Accept': 'application/json' } // tipo de respuesta
        });

        // verificar si la respuesta fue correcta
        if (respuesta.ok) throw new Error('Error al subir imagen: ${respuesta.status}');

        // recibir la respuesta y convertirla 
        const data = await respuesta.json();

        // verificar la subida de la Imagen 
        if (data.success) return data.data.url;

        // verificar errores 
        throw new Error('Error al subir imagen');

    // manejar errores  subida de la imagen 
    } catch (error) {
        console.error('Error al subir imagen:', error);
        throw error;
    }
}








