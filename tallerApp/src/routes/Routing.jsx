import React from 'react'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Home from '../pages/Home'
import LogIn from '../pages/LogIn'
import Nosotros from '../pages/Nosotros'
import Servicios from '../pages/Servicios'
import Contacto from '../pages/Contacto'
import Admin from '../pages/Admin'
import Cuenta from '../pages/Cuenta'
import PrivateRoute from './PrivateRoute'

function Routing() {
  return (
    <div>
        <Router>
            <Routes>
                <Route path='/' element={<Navigate to='/home' />}/>
                <Route path='/home' element = {<Home/>}/>
                <Route path='/login' element = {<LogIn/>}/>
                <Route path='/admin' element = {<PrivateRoute>{<Admin/>}</PrivateRoute>}/>
                <Route path='/cuenta' element = {<PrivateRoute>{<Cuenta/>}</PrivateRoute>}/>
                <Route path='/nosotros' element = {<Nosotros/>}/>
                <Route path='/servicios' element = {<Servicios/>}/>
                <Route path='/contacto' element = {<Contacto/>}/>
            </Routes>
        </Router>
    </div>
  )
}

export default Routing