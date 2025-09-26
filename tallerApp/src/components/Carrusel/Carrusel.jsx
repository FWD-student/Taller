import React from 'react'
import '../Carrusel/carrusel.css'
import Carousel from 'react-bootstrap/Carousel';
import img1 from '../../image/carruselP/moto1.jpg'
import img2 from '../../image/carruselP/moto2.jpg'
import img3 from '../../image/carruselP/moto3.jpg'
import img4 from '../../image/carruselP/moto4.jpg'
import img5 from '../../image/carruselP/moto5.jpg'


function Carrusel() {

    const img = [
      { src:img1, alt: 'Confianza' },
      { src:img2, alt: 'Las mejores practicas' },
      { src:img3, alt: 'Atencion a los detalles' },
      { src:img4, alt: 'Humildad' },
      { src:img5, alt: 'Cuidados' }
    ]

  return (
    <div className="contenedorMecanica">
            <h2 className="tituloMecanica">Por que nosotros</h2>
            <Carousel interval={2500} pause="hover">
                {img.map((logo, index) => (
                    <Carousel.Item key={index}>
                        <img 
                            className="imgMecanic d-block w-100" 
                            src={logo.src} 
                            alt={logo.alt} 
                        />
                        <Carousel.Caption>
                            <h2>{logo.alt}</h2>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
  )
}

export default Carrusel