import React from 'react';
import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ children }) => {
  const usuario = JSON.parse(sessionStorage.getItem('usuario') || 'null');

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const usuario = JSON.parse(sessionStorage.getItem('usuario') || 'null');

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (!usuario.esAdmin) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export const UserRoute = ({ children }) => {
  const usuario = JSON.parse(sessionStorage.getItem('usuario') || 'null');

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.esAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default PrivateRoute;