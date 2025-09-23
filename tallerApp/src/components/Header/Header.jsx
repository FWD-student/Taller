import React from 'react'
import { Link } from "react-router-dom";
import '../Header/header.css'

function Header() {
  return (
    <header className='header'>
      <div className='header-container'>
        <h1>Mi Aplicación</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/servicios">Servicios</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
            <li><Link to="/acerca">Acerca de</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header