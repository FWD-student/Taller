import React from 'react';
import '../Marcas/marcas.css'; // Corregido: sin asignar a variable
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