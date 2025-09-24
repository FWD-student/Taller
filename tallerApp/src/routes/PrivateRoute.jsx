import React from 'react'
import { Navigate } from 'react-router-dom'
import Cuenta from '../pages/Cuenta'

const PrivateRoute = ({ children }) => {
  const isAuthenticated = () => {
    const usuario = sessionStorage.getItem('usuario')
    return usuario !== null
  }

  return isAuthenticated() ? children : <Navigate to="/login" replace />
}

const CuentaProtegida = () => {
  return (
    <PrivateRoute>
      <Cuenta />
    </PrivateRoute>
  )
}

export default CuentaProtegida