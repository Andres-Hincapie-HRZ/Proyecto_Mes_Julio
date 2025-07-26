/*
 * ========================================
 * SECCIÓN DESARROLLADA POR: ANDRÉS HINCAPIÉ RUIZ
 * Responsable de: Variables globales, inicialización, 
 * eventos, controles táctiles y navegación entre pantallas
 * ========================================
 */

// Variables globales
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
    menuPrincipal: document.getElementById('menuPrincipal'),
    creadorNivel: document.getElementById('creadorNivel'),
    pantallaJuego: document.getElementById('juego'),
    btnNuevoNivel: document.getElementById('btnNuevoNivel'),
    btnCargarNiveles: document.getElementById('btnCargarNiveles'),
    btnVolverMenu: document.getElementById('btnVolverMenu'),
    btnSubirNivel: document.getElementById('btnSubirNivel'),
    btnVolverMenuJuego: document.getElementById('btnVolverMenuJuego'),
    btnPausarJuego: document.getElementById('btnPausarJuego'),
    inputFoto: document.getElementById('subirFoto'),
    inputNombreNivel: document.getElementById('nombreNivel')
};

// Inicialización
window.onload = () => {
    canvas = document.getElementById('canvasJuego');
    ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    inicializarEventos();
    cargarNivelesAutomaticamente();
};

// Configuración de eventos
function inicializarEventos() {
    elementos.btnNuevoNivel.onclick = () => mostrarPantalla(elementos.creadorNivel);
    elementos.btnVolverMenu.onclick = () => mostrarPantalla(elementos.menuPrincipal);
    elementos.btnCargarNiveles.onclick = cargarNivelesGuardados;
    elementos.btnSubirNivel.onclick = procesarYSubirNivel;
    elementos.btnVolverMenuJuego.onclick = () => mostrarPantalla(elementos.menuPrincipal);
    elementos.btnPausarJuego.onclick = () => {
        juegoEnPausa = !juegoEnPausa;
        elementos.btnPausarJuego.innerHTML = juegoEnPausa ? 
            '<i class="fas fa-play"></i> Continuar' : 
            '<i class="fas fa-pause"></i> Pausa';
    };
    
    document.addEventListener('keydown', manejarTeclas);
    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') jugador.velocidadX = 0;
    });
    
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', manejarOrientacion);
    }
    
    configurarControlesTactiles();
}

// Controles táctiles optimizados
function configurarControlesTactiles() {
    const controles = [
        { id: 'btnIzquierda', accion: () => { jugador.velocidadX = -VELOCIDAD_MOVIMIENTO; jugador.direccion = -1; }, parar: () => jugador.velocidadX = 0 },
        { id: 'btnDerecha', accion: () => { jugador.velocidadX = VELOCIDAD_MOVIMIENTO; jugador.direccion = 1; }, parar: () => jugador.velocidadX = 0 },
        { id: 'btnSaltar', accion: () => { if (jugador.enSuelo) jugador.velocidadY = VELOCIDAD_SALTO; } },
        { id: 'btnDebug', accion: () => toggleDebug() },
        { id: 'btnReiniciar', accion: () => reiniciarNivel() }
    ];
    
    controles.forEach(({ id, accion, parar }) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('touchstart', accion);
            btn.addEventListener('click', accion);
            if (parar) {
                btn.addEventListener('touchend', parar);
            }
        }
    });
}

function toggleDebug() {
    window.debug = !window.debug;
    const btn = document.getElementById('btnDebug');
    btn.innerHTML = window.debug ? '<i class="fas fa-bug"></i> ON' : '<i class="fas fa-bug"></i>';
    btn.style.background = window.debug ? 
        'linear-gradient(45deg, #ff4444, #cc0000)' : 
        'linear-gradient(45deg, #636e72, #2d3436)';
}

function mostrarPantalla(pantalla) {
    Object.values(elementos).slice(0, 3).forEach(p => p.classList.add('oculto'));
    pantalla.classList.remove('oculto');
}

// Procesamiento y subida de nivel
async function procesarYSubirNivel() {
    const archivo = elementos.inputFoto.files[0];
    const nombreNivel = elementos.inputNombreNivel.value.trim();
    
    if (!archivo || !nombreNivel) {
        alert(archivo ? 'Por favor ingresa un nombre para el nivel' : 'Por favor selecciona una imagen');
        return;
    }

    try {
        const urlImagen = await subirImagenAImgBB(archivo);
        const nuevoNivel = {
            imagen: urlImagen,
            fecha: new Date().toISOString(),
            nombre: nombreNivel
        };

        await db.collection('niveles').add(nuevoNivel);
        alert('¡Nivel subido con éxito!');
        elementos.inputNombreNivel.value = '';
        elementos.inputFoto.value = '';
        mostrarPantalla(elementos.menuPrincipal);
    } catch (error) {
        alert('Error al subir el nivel: ' + error.message);
    }
}

// Cargar niveles
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

function mostrarIndicadorCarga() {
    document.querySelector('.lista-niveles')?.remove();
    const indicador = document.createElement('div');
    indicador.className = 'indicador-carga';
    indicador.innerHTML = '<p>⏳ Cargando niveles...</p>';
    elementos.menuPrincipal.appendChild(indicador);
    return indicador;
}

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
                <span class="nombre-nivel">${nivel.nombre}</span>
                <span class="fecha-nivel">${new Date(nivel.fecha).toLocaleDateString()}</span>
            `;
            btnNivel.onclick = () => iniciarNivel(nivel);
            contenedor.appendChild(btnNivel);
        });
    }
    
    elementos.menuPrincipal.appendChild(contenedor);
}

/*
 * ========================================
 * SECCIÓN DESARROLLADA POR: DAIRO
 * Responsable de: Análisis de imágenes, creación de niveles,
 * procesamiento de colores y generación de elementos del juego
 * ========================================
 */

// Iniciar nivel
function iniciarNivel(nivel) {
    const imagen = new Image();
    imagen.crossOrigin = "anonymous";
    imagen.src = nivel.imagen;
    imagen.onload = () => {
        imagenNivel = imagen;
        mostrarPantalla(elementos.pantallaJuego);
        canvas.width = Math.min(imagen.width, 800);
        canvas.height = Math.min(imagen.height, 600);
        metaX = canvas.width - 50;
        
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        
        try {
            tempCtx.drawImage(imagen, 0, 0, canvas.width, canvas.height);
            analizarImagenYCrearNivel(tempCtx);
        } catch (error) {
            crearNivelBasico();
        }
        
        iniciarBucleJuego();
    };
    
    imagen.onerror = () => {
        crearNivelBasico();
        mostrarPantalla(elementos.pantallaJuego);
        iniciarBucleJuego();
    };
}

// Análisis de imagen
function analizarImagenYCrearNivel(tempCtx) {
    try {
        const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        window.plataformas = [];
        window.peligros = [];
        window.trampolines = [];
        window.escudos = [];

        for (let y = 0; y < canvas.height; y += 3) {
            for (let x = 0; x < canvas.width; x += 3) {
                const idx = (y * canvas.width + x) * 4;
                const [r, g, b] = [data[idx], data[idx + 1], data[idx + 2]];

                if (r < 80 && g < 80 && b < 80) {
                    plataformas.push({x, y, ancho: 4, alto: 4});
                } else if (r > 150 && g < 100 && b < 100) {
                    peligros.push({x, y, ancho: 4, alto: 4});
                } else if (b > r + 50 && b > g + 50 && b > 100) {
                    trampolines.push({x, y, ancho: 4, alto: 4});
                } else if (r < 100 && g > 150 && b < 100) {
                    escudos.push({x, y, ancho: 4, alto: 4});
                }
            }
        }
        
        if (plataformas.length + peligros.length + trampolines.length + escudos.length === 0) {
            crearNivelBasico();
        }
    } catch (error) {
        crearNivelBasico();
    }
}

function crearNivelBasico() {
    window.plataformas = [];
    window.peligros = [];
    window.trampolines = [];
    window.escudos = [];
    
    for (let x = 0; x < canvas.width; x += 50) {
        plataformas.push({x, y: canvas.height - 20, ancho: 40, alto: 20});
    }
    
    peligros.push({x: canvas.width / 2, y: canvas.height - 40, ancho: 20, alto: 20});
    trampolines.push({x: canvas.width / 3, y: canvas.height - 40, ancho: 20, alto: 20});
    escudos.push({x: canvas.width / 4, y: canvas.height - 60, ancho: 15, alto: 15});
}

// Control del jugador
function manejarTeclas(e) {
    const acciones = {
        'ArrowLeft': () => { jugador.velocidadX = -VELOCIDAD_MOVIMIENTO; jugador.direccion = -1; },
        'ArrowRight': () => { jugador.velocidadX = VELOCIDAD_MOVIMIENTO; jugador.direccion = 1; },
        'ArrowUp': () => { if (jugador.enSuelo) jugador.velocidadY = VELOCIDAD_SALTO; },
        ' ': () => { if (jugador.enSuelo) jugador.velocidadY = VELOCIDAD_SALTO; }
    };
    
    if (acciones[e.key]) acciones[e.key]();
}

function manejarOrientacion(e) {
    const gamma = e.gamma;
    if (gamma > 10) {
        jugador.velocidadX = VELOCIDAD_MOVIMIENTO;
        jugador.direccion = 1;
    } else if (gamma < -10) {
        jugador.velocidadX = -VELOCIDAD_MOVIMIENTO;
        jugador.direccion = -1;
    } else {
        jugador.velocidadX = 0;
    }
}

/*
 * ========================================
 * SECCIÓN DESARROLLADA POR: ANDRÉS FELIPE SALAMANCA
 * Responsable de: Bucle principal del juego, física del jugador,
 * sistema de colisiones, renderizado y interfaz de usuario
 * ========================================
 */

// Bucle principal
function bucleJuego() {
    if (!juegoEnPausa) actualizarJugador();
    dibujarJuego();
    
    if (juegoEnPausa) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSA', canvas.width/2, canvas.height/2);
        ctx.font = '24px Arial';
        ctx.fillText('Presiona Continuar para seguir', canvas.width/2, canvas.height/2 + 50);
    }
    
    requestAnimationFrame(bucleJuego);
}

function actualizarJugador() {
    jugador.animacion += 0.2;
    jugador.velocidadY += GRAVEDAD;
    jugador.x += jugador.velocidadX;
    jugador.y += jugador.velocidadY;

    // Actualizar invencibilidad
    if (jugador.invencible) {
        jugador.tiempoInvencibilidad--;
        if (jugador.tiempoInvencibilidad <= 0) {
            jugador.invencible = false;
        }
    }

    if (jugador.x < 0) jugador.x = 0;
    if (jugador.x > canvas.width - jugador.ancho) jugador.x = canvas.width - jugador.ancho;
    if (jugador.y > canvas.height) { mostrarResultado('derrota'); return; }

    // Colisiones
    jugador.enSuelo = false;
    procesarColisiones();
    
    if (jugador.x >= metaX) mostrarResultado('victoria');
}

function procesarColisiones() {
    // Plataformas
    for (let plataforma of plataformas) {
        if (detectarColision(jugador, plataforma)) {
            if (jugador.velocidadY > 0 && jugador.y < plataforma.y) {
                jugador.y = plataforma.y - jugador.alto;
                jugador.velocidadY = 0;
                jugador.enSuelo = true;
            }
        }
    }

    // Trampolines
    for (let trampolin of trampolines) {
        if (detectarColision(jugador, trampolin)) {
            jugador.velocidadY = VELOCIDAD_SALTO * 1.5;
        }
    }

    // Escudos
    for (let i = escudos.length - 1; i >= 0; i--) {
        if (detectarColision(jugador, escudos[i])) {
            jugador.tieneEscudo = true;
            escudos.splice(i, 1);
        }
    }

    // Peligros
    for (let peligro of peligros) {
        if (detectarColision(jugador, peligro) && !jugador.invencible) {
            if (jugador.tieneEscudo) {
                // Perder escudo y activar invencibilidad temporal
                jugador.tieneEscudo = false;
                jugador.invencible = true;
                jugador.tiempoInvencibilidad = 60; // 1 segundo a 60 FPS
                
                // Efecto visual: empujar al jugador hacia atrás
                jugador.velocidadX = jugador.direccion * -2;
                jugador.velocidadY = -3;
            } else {
                mostrarResultado('derrota');
                return;
            }
        }
    }
}

function detectarColision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.ancho &&
           obj1.x + obj1.ancho > obj2.x &&
           obj1.y < obj2.y + obj2.alto &&
           obj1.y + obj1.alto > obj2.y;
}

// Renderizado
function dibujarJuego() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (imagenNivel) {
        ctx.globalAlpha = 0.8;
        ctx.drawImage(imagenNivel, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;
    }
    
    // Línea de meta
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(metaX, 0);
    ctx.lineTo(metaX, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    if (window.debug) dibujarElementosNivel();
    dibujarPersonaje();
    dibujarHUD();
}

function dibujarPersonaje() {
    const { x, y, ancho, alto } = jugador;
    const colorBase = jugador.tieneEscudo ? '#00ff00' : '#FF6B6B';
    const colorOscuro = jugador.tieneEscudo ? '#008000' : '#FF5252';
    
    // Efecto de parpadeo cuando está invencible
    if (jugador.invencible && Math.floor(jugador.tiempoInvencibilidad / 5) % 2 === 0) {
        return; // No dibujar el personaje para crear efecto de parpadeo
    }
    
    // Sombra
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(x + 2, y + alto + 2, ancho - 4, 3);
    
    // Cuerpo
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.fillStyle = colorBase;
    ctx.fillRect(x + 4, y + 8, ancho - 8, alto - 12);
    ctx.strokeRect(x + 4, y + 8, ancho - 8, alto - 12);
    
    // Cabeza
    ctx.fillStyle = '#FFE4B5';
    ctx.fillRect(x + 6, y + 2, ancho - 12, 8);
    ctx.strokeRect(x + 6, y + 2, ancho - 12, 8);
    
    // Cara
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 8, y + 4, 3, 2);
    ctx.fillRect(x + ancho - 11, y + 4, 3, 2);
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x + ancho/2, y + 6, 2, 0, Math.PI);
    ctx.stroke();
    
    // Extremidades animadas
    const brazoOffset = Math.sin(jugador.animacion) * 2;
    ctx.fillStyle = colorOscuro;
    ctx.fillRect(x + 2, y + 10 + brazoOffset, 3, 6);
    ctx.fillRect(x + ancho - 5, y + 10 - brazoOffset, 3, 6);
    
    if (Math.abs(jugador.velocidadX) > 0) {
        const piernaOffset = Math.sin(jugador.animacion * 2) * 2;
        ctx.fillRect(x + 6, y + alto - 4, 3, 4 + piernaOffset);
        ctx.fillRect(x + ancho - 9, y + alto - 4, 3, 4 - piernaOffset);
    } else {
        ctx.fillRect(x + 6, y + alto - 4, 3, 4);
        ctx.fillRect(x + ancho - 9, y + alto - 4, 3, 4);
    }
    
    // Efecto escudo
    if (jugador.tieneEscudo) {
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x + ancho/2, y + alto/2, ancho/2 + 5, 0, Math.PI * 2);
        ctx.stroke();
    }
}

function dibujarElementosNivel() {
    const elementos = [
        { lista: plataformas, color: 'rgba(0, 0, 0, 0.5)' },
        { lista: peligros, color: 'rgba(255, 0, 0, 0.5)' },
        { lista: trampolines, color: 'rgba(0, 0, 255, 0.5)' },
        { lista: escudos, color: 'rgba(0, 255, 0, 0.5)' }
    ];
    
    elementos.forEach(({ lista, color }) => {
        ctx.fillStyle = color;
        (lista || []).forEach(item => {
            ctx.fillRect(item.x, item.y, item.ancho, item.alto);
        });
    });
}

function dibujarHUD() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 200, 60);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText('Llega a la línea dorada', 20, 30);
    
    if (jugador.tieneEscudo) {
        ctx.fillStyle = '#00ff00';
        ctx.fillText('🛡️ Escudo Activo', 20, 50);
    }
    
    const progreso = Math.min((jugador.x / metaX) * 100, 100);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Progreso: ${progreso.toFixed(0)}%`, 20, 65);
}

function reiniciarNivel() {
    Object.assign(jugador, { 
        x: 50, y: 50, 
        velocidadX: 0, velocidadY: 0, 
        tieneEscudo: false, animacion: 0,
        invencible: false, tiempoInvencibilidad: 0
    });
}

function mostrarResultado(tipo) {
    juegoEnPausa = true;
    
    const esVictoria = tipo === 'victoria';
    const overlay = document.createElement('div');
    overlay.className = `overlay-resultado ${tipo}`;
    overlay.innerHTML = `
        <div class="contenido-resultado">
            <i class="fas fa-${esVictoria ? 'trophy' : 'skull-crossbones'} icono-resultado"></i>
            <h2>${esVictoria ? '¡FELICITACIONES!' : '¡PERDISTE!'}</h2>
            <p>${esVictoria ? '¡Has completado el nivel exitosamente!' : 'Has tocado un obstáculo peligroso'}</p>
            <div class="botones-resultado">
                <button id="btnReintentar" class="btn-resultado">
                    <i class="fas fa-redo"></i> ${esVictoria ? 'Volver a Jugar' : 'Intentar de Nuevo'}
                </button>
                <button id="btnOtroNivel" class="btn-resultado">
                    <i class="fas fa-list"></i> Seleccionar Otro Nivel
                </button>
                <button id="btnMenuResultado" class="btn-resultado">
                    <i class="fas fa-home"></i> Menú Principal
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    const acciones = {
        btnReintentar: () => { document.body.removeChild(overlay); juegoEnPausa = false; reiniciarNivel(); },
        btnOtroNivel: () => { document.body.removeChild(overlay); mostrarPantalla(elementos.menuPrincipal); },
        btnMenuResultado: () => { document.body.removeChild(overlay); mostrarPantalla(elementos.menuPrincipal); }
    };
    
    Object.entries(acciones).forEach(([id, accion]) => {
        document.getElementById(id).onclick = accion;
    });
}

function iniciarBucleJuego() {
    reiniciarNivel();
    requestAnimationFrame(bucleJuego);
}