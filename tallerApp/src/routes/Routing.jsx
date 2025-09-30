import React from 'react'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Home from '../pages/Home'
import LogIn from '../pages/LogIn'
import Nosotros from '../pages/Nosotros'
import Servicio from '../pages/Servicios'
import Contacto from '../pages/Contacto'
import Admin from '../pages/Admin'
import Cuenta from '../pages/Cuenta'
import Comentarios from '../pages/Comentarios'
import { AdminRoute, UserRoute } from './PrivateRoute'

function Routing() {
  return (
    <div>
        <Router>
            <Routes>
                <Route path='/' element={<Navigate to='/home' />}/>
                <Route path='/home' element = {<Home/>}/>
                <Route path='/login' element = {<LogIn/>}/>
                <Route path='/admin' element = {<AdminRoute><Admin/></AdminRoute>}/>
                <Route path='/cuenta' element = {<UserRoute><Cuenta/></UserRoute>}/>
                <Route path='/nosotros' element = {<Nosotros/>}/>
                <Route path='/servicios' element = {<Servicio/>}/>
                <Route path='/contacto' element = {<Contacto/>}/>
                <Route path='/comentarios' element = {<UserRoute><Comentarios/></UserRoute>}/>
            </Routes>
        </Router>
    </div>
  )
}

export default Routing