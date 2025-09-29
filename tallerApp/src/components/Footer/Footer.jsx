import React from 'react'
import '../Footer/footer.css'
import icoF from '../../image/icons/fc.png'
import icoI from '../../image/icons/inst.png'
import icoW from '../../image/icons/wats.png'
import icoY from '../../image/icons/yt.png'

function Footer() {

  const mensaje = "Hola%20necesito%20informacion%20de%20"
  const numero = "63480444"

  const redesSociales = [
    { nombre: 'Facebook', url: 'https://facebook.com', img: icoF },
    { nombre: 'WhatsApp', url: `https://wa.me/${numero}?text=${mensaje}`, img: icoW },
    { nombre: 'Instagram', url: 'https://www.instagram.com/__luis_9m/', img: icoI },
    { nombre: 'YouTube', url: 'https://youtube.com', img: icoY }
  ];

  const handleRedirect = (url) => {
    window.open(url, '_blank');
  };

  return (
    <footer className='footer'>
      <div className='contenedorFooter'>
        <div className='seccionRedes'>
          <h3>Síguenos en nuestras redes sociales</h3>
          <div className='btnsRedSocial'>
            {redesSociales.map((red, index) => (
              <button 
                key={index}
                className='btnRedSocial'
                onClick={() => handleRedirect(red.url)}
                title={red.nombre}
              >
                <img src={red.img} alt={red.nombre} className='iconoRed' />
                {red.nombre}
              </button>
            ))}
          </div>
        </div>
        <div className='infoContact'>
          <p>© 2025 Taller de Motos. Todos los derechos reservados.</p>
          <p>Contacto: info@tallerdemotos.com | Teléfono: 6348-0444</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer