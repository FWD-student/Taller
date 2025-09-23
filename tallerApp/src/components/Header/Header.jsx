import React from 'react'
import { Link } from "react-router-dom";
import '../Header/header.css'
import logo from '../../image/logo/LogoMecanic.jpg'

function Header() {
  return (
    <header className='header'>
      <div className='header-container'>
        <h1>Taller JPL</h1>
        <img src={logo} alt="" className='logo'/>
        <nav className='navBar'>
          <ul className='list'>
            <li className='item' ><Link to="/">Home</Link></li>
            <li className='item' ><Link to="/servicios">Servicios</Link></li>
            <li className='item' ><Link to="/contacto">Contacto</Link></li>
            <li className='item' ><Link to="/acerca">Acerca de</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header