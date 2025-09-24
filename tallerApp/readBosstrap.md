# Componente Marcas - React Bootstrap Carousel

Este documento explica cómo implementar un componente de carrusel de marcas utilizando React y React Bootstrap.

## Tabla de Contenidos

- [Descripción](#descripción)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Implementación](#implementación)
- [Estilos CSS](#estilos-css)
- [Problemas Comunes](#problemas-comunes)
- [Personalización](#personalización)

## Descripción

El componente `Marcas` es un carrusel responsivo que muestra logos de diferentes marcas con las que trabaja la empresa. Utiliza React Bootstrap para crear una experiencia visual atractiva con transiciones automáticas y controles de usuario.

## Requisitos Previos

- Node.js (versión 14 o superior)
- React (versión 16.8 o superior)
- npm o yarn como gestor de paquetes

## Instalación

### Paso 1: Instalar dependencias

```bash
# Instalar React Bootstrap y Bootstrap
npm install react-bootstrap bootstrap

# O con yarn
yarn add react-bootstrap bootstrap
```

### Paso 2: Importar estilos de Bootstrap

En tu archivo principal (`src/index.js` o `src/App.js`), añade la importación de los estilos de Bootstrap:

```javascript
import 'bootstrap/dist/css/bootstrap.min.css';
```

## Estructura del Proyecto

```
src/
├── components/
│   └── Marcas/
│       ├── Marcas.js          # Componente principal
│       └── marcas.css         # Estilos personalizados
├── image/
│   └── marcas/
│       ├── Honda.png
│       ├── suzuki.png
│       ├── yamaha.png
│       ├── katana.png
│       ├── serpento.png
│       └── freedom.png
└── ...
```

## Implementación

### Componente Principal (Marcas.js)

```javascript
import React from 'react';
import './marcas.css';
import Carousel from 'react-bootstrap/Carousel';

// Importar imágenes
import honda from '../../image/marcas/Honda.png';
import suzuki from '../../image/marcas/suzuki.png';
import yamaha from '../../image/marcas/yamaha.png';
import katana from '../../image/marcas/katana.png';
import serpento from '../../image/marcas/serpento.png';
import freedom from '../../image/marcas/freedom.png';

function Marcas() {
    const logos = [
        { src: honda, alt: 'Honda' },
        { src: suzuki, alt: 'Suzuki' },
        { src: yamaha, alt: 'Yamaha' },
        { src: katana, alt: 'Katana' },
        { src: serpento, alt: 'Serpento' },
        { src: freedom, alt: 'Freedom' }
    ];

    return (
        <div className="marcasContainer">
            <h2 className="tituloMarcas">Marcas que trabajamos</h2>
            <Carousel interval={2000} pause="hover">
                {logos.map((logo, index) => (
                    <Carousel.Item key={index}>
                        <img 
                            className="logoMarca d-block w-100" 
                            src={logo.src} 
                            alt={logo.alt} 
                        />
                        <Carousel.Caption>
                            <h5>{logo.alt}</h5>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
}

export default Marcas;
```

### Características del Componente

- **Carrusel automático**: Cambia cada 2 segundos (`interval={2000}`)
- **Pausa al hover**: Se detiene cuando el usuario pasa el mouse sobre él
- **Navegación manual**: Incluye controles para avanzar/retroceder
- **Indicadores**: Muestra puntos indicadores en la parte inferior
- **Responsivo**: Se adapta a diferentes tamaños de pantalla

## Estilos CSS

Crea el archivo `marcas.css` con los siguientes estilos:

```css
.marcasContainer {
    padding: 2rem;
    text-align: center;
    background-color: #f8f9fa;
}

.tituloMarcas {
    margin-bottom: 2rem;
    color: #333;
    font-weight: bold;
    font-size: 2rem;
}

.logoMarca {
    height: 200px;
    object-fit: contain;
    margin: 0 auto;
    background-color: white;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.carousel {
    max-width: 600px;
    margin: 0 auto;
}

.carousel-caption {
    background-color: rgba(0,0,0,0.7);
    border-radius: 4px;
    padding: 0.5rem 1rem;
}

.carousel-caption h5 {
    margin: 0;
    font-weight: bold;
}

/* Responsividad */
@media (max-width: 768px) {
    .logoMarca {
        height: 150px;
    }
    
    .tituloMarcas {
        font-size: 1.5rem;
    }
    
    .marcasContainer {
        padding: 1rem;
    }
}
```

## Problemas Comunes

### Error: "Module not found: Can't resolve 'react-bootstrap'"

**Solución:**
```bash
npm install react-bootstrap bootstrap
```

### Error: Estilos no se aplican correctamente

**Solución:**
Asegúrate de importar Bootstrap CSS en tu archivo principal:
```javascript
import 'bootstrap/dist/css/bootstrap.min.css';
```

### Error: Imágenes no cargan

**Solución:**
1. Verifica que las rutas de las imágenes sean correctas
2. Asegúrate de que los archivos existan en la ubicación especificada
3. Considera usar la carpeta `public` para imágenes estáticas:

```javascript
// Si las imágenes están en public/images/marcas/
const logos = [
    { src: '/images/marcas/Honda.png', alt: 'Honda' },
    // ...
];
```

### Error: Carrusel no funciona correctamente

**Solución:**
Añade las clases de Bootstrap necesarias:
```javascript
<img 
    className="logoMarca d-block w-100" 
    src={logo.src} 
    alt={logo.alt} 
/>
```

## Personalización

### Cambiar velocidad del carrusel
```javascript
<Carousel interval={3000}> {/* 3 segundos */}
```

### Desactivar avance automático
```javascript
<Carousel interval={null}>
```

### Ocultar controles
```javascript
<Carousel controls={false}>
```

### Ocultar indicadores
```javascript
<Carousel indicators={false}>
```

### Personalizar transición
```javascript
<Carousel fade> {/* Efecto de desvanecimiento */}
```

### Añadir más marcas
```javascript
const logos = [
    // Marcas existentes...
    { src: nuevaMarca, alt: 'Nueva Marca' },
];
```

## Uso en otros componentes

Para usar el componente en tu aplicación:

```javascript
import React from 'react';
import Marcas from './components/Marcas/Marcas';

function App() {
    return (
        <div className="App">
            <Marcas />
        </div>
    );
}

export default App;
```

## Consideraciones de Accesibilidad

El componente incluye:
- Atributos `alt` descriptivos para todas las imágenes
- Navegación por teclado automática (React Bootstrap)
- Controles ARIA para lectores de pantalla
- Pausa automática al enfocar con teclado

## Versionado

- **v1.0.0**: Implementación inicial con carrusel básico
- **v1.1.0**: Añadidos estilos responsivos y mejoras de accesibilidad