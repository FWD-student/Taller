import React from 'react'
import '../Footer/footer.css'


function Footer() {
  const redesSociales = [
    { nombre: 'Facebook', url: 'https://facebook.com', icono: 'FB' },
    { nombre: 'WhatsApp', url: 'https://wa.me/88887777', icono: 'WA' },
    { nombre: 'Instagram', url: 'https://instagram.com', icono: 'IG' },
    { nombre: 'YouTube', url: 'https://youtube.com', icono: 'YT' }
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
                {red.icono} {red.nombre}
              </button>
            ))}
          </div>
        </div>
        <div className='infoContact'>
          <p>© 2025 Taller de Motos. Todos los derechos reservados.</p>
          <p>Contacto: info@tallerdemotos.com | Teléfono: 8888-7777</p>
        </div>
      </div>
    </footer>

  )
}

export default Footer