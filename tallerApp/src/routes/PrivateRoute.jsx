import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const usuario = JSON.parse(sessionStorage.getItem('usuario') || 'null');

  if (!usuario) return <Navigate to="/login" replace />;


  if (location.pathname === '/admin' && !usuario.esAdmin) {
    return <Navigate to="/cuenta" replace />;
  }

  if (location.pathname === '/cuenta' && usuario.esAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default PrivateRoute;