import React from 'react'

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
    <footer>
      <div>
        <div>
          <h3>Síguenos en nuestras redes sociales</h3>
          <div>
            {redesSociales.map((red, index) => (
              <button 
                key={index}
                onClick={() => handleRedirect(red.url)}
                title={red.nombre}
              >
                {red.icono} {red.nombre}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p>© 2025 Mi Aplicacion. Todos los derechos reservados.</p>
          <p>Contacto: info@gmail.com | Teléfono: 8888-7777</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer