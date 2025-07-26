# 🎮 PixelCraft Adventures
### Juego de Plataformas con Creación de Niveles por Dibujo

<img width="1256" height="705" alt="image" src="https://github.com/user-attachments/assets/93fb9395-2088-438b-b834-48cccaa4dfed" />
<img width="857" height="606" alt="image" src="https://github.com/user-attachments/assets/89542973-dbbd-4552-bbab-b02acf1198ba" />


---

## 📖 Descripción

**PixelCraft Adventures** es un innovador juego de plataformas 2D que permite a los jugadores crear niveles únicos dibujando en papel y fotografiándolos. El juego utiliza tecnología de análisis de imágenes para convertir dibujos físicos en niveles jugables, combinando la creatividad tradicional con la diversión digital.

### ✨ Características Principales

- 🎨 **Creación de Niveles por Dibujo**: Dibuja tu nivel en papel y conviértelo en un juego real
- 🌈 **Sistema de Colores Inteligente**: Cada color tiene una función específica en el juego
- ☁️ **Almacenamiento en la Nube**: Guarda y comparte tus niveles usando Firebase
- 📱 **Controles Multiples**: Teclado, táctil y giroscopio para dispositivos móviles
- 🎯 **Física Realista**: Sistema de gravedad, saltos y colisiones fluidas
- 🛡️ **Sistema de Power-ups**: Escudos protectores y trampolines especiales

---

## 🎨 Cómo Crear un Nivel

### Materiales Necesarios
- Papel blanco
- Marcadores o lápices de colores
- Cámara o smartphone

### Código de Colores

| Color | Función | Descripción |
|-------|---------|-------------|
| ⬛ **Negro** | Plataformas | Superficies sólidas donde el jugador puede caminar |
| 🟥 **Rojo** | Peligros | Obstáculos que eliminan al jugador al contacto |
| 🟦 **Azul** | Trampolines | Impulsan al jugador hacia arriba con fuerza extra |
| 🟩 **Verde** | Escudos | Power-ups que protegen de un golpe mortal |

### Pasos para Crear
1. Dibuja tu nivel usando los colores especificados
2. Toma una foto clara y bien iluminada
3. Sube la imagen desde el juego
4. ¡Juega tu creación al instante!

---

## 🎮 Controles

### Teclado (PC)
- `←` `→` Mover izquierda/derecha
- `↑` / `Espacio` Saltar
- `Pausa` Pausar juego

### Controles Táctiles (Móvil)
- Botones en pantalla para movimiento
- Soporte para giroscopio (inclinar dispositivo)

### Funciones Especiales
- `Debug` Mostrar elementos del nivel
- `Reiniciar` Volver al inicio del nivel

---

## 🚀 Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet para guardar/cargar niveles
- Cámara (opcional, para crear niveles)

### Ejecución
1. Clona o descarga el repositorio
2. Abre `index.html` en tu navegador
3. ¡Comienza a jugar!

### Configuración de Firebase
El juego utiliza Firebase para almacenar niveles. La configuración está en `config.js` y ya incluye las credenciales necesarias.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Canvas**: Renderizado 2D y análisis de imágenes
- **Firebase**: Base de datos Firestore para almacenamiento
- **ImgBB API**: Hosting de imágenes
- **Font Awesome**: Iconografía
- **Responsive Design**: Compatible con dispositivos móviles

---

## 👥 Equipo de Desarrollo

Este proyecto fue desarrollado colaborativamente por:

### 🔧 **Andrés Hincapié Ruiz**
**Responsabilidades:**
- Variables globales y configuración inicial
- Sistema de eventos y navegación
- Controles táctiles y de dispositivo
- Interfaz de usuario y menús
- Gestión de pantallas y transiciones

### 🎨 **Dairo**
**Responsabilidades:**
- Análisis y procesamiento de imágenes
- Sistema de detección de colores
- Generación de elementos del juego
- Creación de niveles automática
- Optimización del rendimiento de imágenes

### ⚡ **Andrés Felipe Salamanca**
**Responsabilidades:**
- Bucle principal del juego
- Física del jugador y gravedad
- Sistema de colisiones
- Renderizado y gráficos
- Interfaz de usuario en juego (HUD)

---

## 🎯 Mecánicas del Juego

### Objetivo
Llegar a la **línea dorada** ubicada al final de cada nivel evitando obstáculos y utilizando power-ups estratégicamente.

### Sistema de Vida
- El jugador tiene **una vida** por defecto
- Los **escudos verdes** otorgan protección contra un golpe
- Tocar peligros rojos sin escudo resulta en derrota

### Física del Juego
- **Gravedad**: 0.9 unidades por frame
- **Velocidad de salto**: -9 unidades (hacia arriba)
- **Velocidad de movimiento**: 4 unidades por frame
- **Trampolines**: Impulso de 1.5x la fuerza de salto normal

---

## 📁 Estructura del Proyecto

```
PixelCraft-Adventures/
├── index.html          # Página principal
├── styles.css          # Estilos y diseño
├── juego.js           # Lógica principal del juego
├── config.js          # Configuración de Firebase
└── README.md          # Documentación
```

---

## 🔄 Flujo de Juego

1. **Menú Principal**: Crear nuevo nivel o cargar existentes
2. **Creador de Nivel**: Subir imagen y nombrar nivel
3. **Análisis**: Procesamiento automático de colores
4. **Juego**: Experiencia de plataformas fluida
5. **Resultados**: Victoria o derrota con opciones de repetir

---

## 🐛 Modo Debug

Activa el modo debug para visualizar:
- Hitboxes de plataformas (negro transparente)
- Áreas de peligro (rojo transparente)
- Zonas de trampolines (azul transparente)
- Ubicación de escudos (verde transparente)

---

## 📱 Compatibilidad

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Dispositivos móviles iOS/Android

---

## 🤝 Contribuciones

Este proyecto fue desarrollado como parte de un proyecto colaborativo. Para sugerencias o mejoras, contacta al equipo de desarrollo.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

## 🎉 ¡Disfruta Jugando!

**PixelCraft Adventures** combina la creatividad del dibujo tradicional con la emoción de los videojuegos. ¡Crea, comparte y juega niveles únicos que solo tu imaginación puede limitar!

---

*Desarrollado con ❤️ por Andrés Hincapié Ruiz, Dairo y Andrés Felipe Salamanca*
