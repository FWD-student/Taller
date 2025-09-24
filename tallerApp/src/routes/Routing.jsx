import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from '../pages/Home'
import LogIn from '../pages/LogIn'
import Cuenta from '../pages/Cuenta'
import Nosotros from '../pages/Nosotros'
import Servicios from '../pages/Servicios'
import Contacto from '../pages/Contacto'

function Routing() {
  return (
    <div>
        <Router>
            <Routes>
                <Route path='/home' element = {<Home/>}/>
                <Route path='/login' element = {<LogIn/>}/>
                <Route path='/cuenta' element = {<Cuenta/>}/>
                <Route path='/nosotros' element = {<Nosotros/>}/>
                <Route path='/servicios' element = {<Servicios/>}/>
                <Route path='/contacto' element = {<Contacto/>}/>
            </Routes>
        </Router>
    </div>
  )
}

export default Routing