import React from 'react'
import './contacta.css'
import cotizar from '../../image/iconsContacto/cotizar.png'
import email from '../../image/iconsContacto/email.png'
import telefono from '../../image/iconsContacto/telefono.png'

function Comentarios() {
  return (
    <div className='contenderoPrincipal'>

        <h1>Contactenos</h1>

        <div className='contenedorSimple'>
            <div className='item'>
                <h3>Correo</h3>
                <a href="mailto:luisblocon15@gmail.com"><img className='mail' src= {email} alt="icono" /></a>
                <p>luisblocon15@gmail.com</p>
            </div>
            
            <div className='item'>
                <h3>Telefono</h3>
                <a href="tel:+506 6348 0444"><img className='tele' src= {telefono} alt="icono" /></a>
                <p>+506 6348 0444</p>
            </div>

            <div className='item'>
                <h3>Cotizacion</h3>
                <a href="tel:2663 6363"><img className='coti' src={cotizar} alt="icono" /></a>
                <p>2663 6363</p>
            </div>
        </div>
        
    </div>
  )
}

export default Comentarios