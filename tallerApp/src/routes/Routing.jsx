import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from '../pages/Home'
import LogIn from '../pages/LogIn'
import Nosotros from '../pages/Nosotros'
import Servicios from '../pages/Servicios'
import Contacto from '../pages/Contacto'
import CuentaProtegida from './PrivateRoute'

function Routing() {
  return (
    <div>
        <Router>
            <Routes>
                <Route path='/home' element = {<Home/>}/>
                <Route path='/login' element = {<LogIn/>}/>
                <Route path='/cuenta' element = {<CuentaProtegida/>}/>
                <Route path='/nosotros' element = {<Nosotros/>}/>
                <Route path='/servicios' element = {<Servicios/>}/>
                <Route path='/contacto' element = {<Contacto/>}/>
            </Routes>
        </Router>
    </div>
  )
}

export default Routing