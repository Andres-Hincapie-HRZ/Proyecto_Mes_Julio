// Variables globales - manteniendo la misma estructura que el juego original
let canvas, ctx, imagenNivel = null, juegoEnPausa = false;
let jugador = {
    x: 50, y: 50, ancho: 20, alto: 20,
    velocidadX: 0, velocidadY: 0,
    tieneEscudo: false, enSuelo: false,
    animacion: 0, direccion: 1,
    invencible: false, tiempoInvencibilidad: 0
};
let metaX = 0;

const GRAVEDAD = 0.9, VELOCIDAD_SALTO = -9, VELOCIDAD_MOVIMIENTO = 4;

// Elementos del DOM
const elementos = {
    menuPrincipal: document.getElementById('menuPantalla'),
    btnCargarNiveles: document.getElementById('btnCargarNiveles')
};

// Inicialización
window.onload = () => {
    inicializarEventos();
    cargarNivelesAutomaticamente();
};

// Configuración de eventos
function inicializarEventos() {
    elementos.btnCargarNiveles.onclick = cargarNivelesGuardados;
}

// Cargar niveles automáticamente al iniciar
async function cargarNivelesAutomaticamente() {
    try {
        const niveles = await db.collection('niveles').orderBy('fecha', 'desc').get();
        if (!niveles.empty) {
            mostrarListaNiveles(niveles, false);
        }
    } catch (error) {
        console.log('No se pudieron cargar niveles automáticamente:', error);
    }
}

// Cargar niveles cuando se presiona el botón
async function cargarNivelesGuardados() {
    try {
        const indicador = mostrarIndicadorCarga();
        const niveles = await db.collection('niveles').orderBy('fecha', 'desc').get();
        indicador.remove();
        mostrarListaNiveles(niveles, true);
    } catch (error) {
        document.querySelector('.indicador-carga')?.remove();
        alert('Error al cargar niveles: ' + error.message);
    }
}

// Mostrar indicador de carga
function mostrarIndicadorCarga() {
    document.querySelector('.lista-niveles')?.remove();
    const indicador = document.createElement('div');
    indicador.className = 'indicador-carga';
    indicador.innerHTML = '<p>Cargando niveles...</p>';
    elementos.menuPrincipal.appendChild(indicador);
    return indicador;
}

// Mostrar lista de niveles
function mostrarListaNiveles(niveles, limpiarAnterior) {
    if (limpiarAnterior) document.querySelector('.lista-niveles')?.remove();
    
    const contenedor = document.createElement('div');
    contenedor.className = 'lista-niveles';
    
    if (niveles.empty) {
        contenedor.innerHTML = '<p>No hay niveles guardados aún</p>';
    } else {
        contenedor.innerHTML = '<h3><i class="fas fa-gamepad"></i> Niveles Disponibles:</h3>';
        
        niveles.forEach(doc => {
            const nivel = doc.data();
            const btnNivel = document.createElement('button');
            btnNivel.className = 'btn-nivel';
            btnNivel.innerHTML = `
                <i class="fas fa-play-circle"></i>
                <div>
                    <span class="nombre-nivel">${nivel.nombre}</span>
                    <span class="fecha-nivel">${nivel.fecha.toDate().toLocaleDateString()}</span>
                </div>
            `;
            btnNivel.onclick = () => mostrarDetallesNivel(nivel);
            contenedor.appendChild(btnNivel);
        });
    }
    
    elementos.menuPrincipal.appendChild(contenedor);
}

// Función para mostrar detalles del nivel (por ahora solo muestra info)
function mostrarDetallesNivel(nivel) {
    alert(`Nivel seleccionado: ${nivel.nombre}\nFecha: ${nivel.fecha.toDate().toLocaleDateString()}\nImagen: ${nivel.nombreImagen}`);
    console.log('Datos del nivel:', nivel);
}
