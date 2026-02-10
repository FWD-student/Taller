import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
// import MenuIcon from '@mui/icons-material/Menu';
// import CloseIcon from '@mui/icons-material/Close';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import logo from '../../image/logo/LogoMecanic.jpg';
import '../Header/header.css';

function Header() {
  const [usuario, setUsuario] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarUsuario = () => {
      const data = sessionStorage.getItem('usuario');
      setUsuario(data ? JSON.parse(data) : null);
    };

    cargarUsuario();

    const eventos = ['storage', 'userLogin', 'userLogout'];
    eventos.forEach(e => window.addEventListener(e, cargarUsuario));

    return () => eventos.forEach(e => window.removeEventListener(e, cargarUsuario));
  }, []);

  useEffect(() => {
    const cerrarMenu = e => {
      if (!e.target.closest('.seccionUsuario')) setShowUserMenu(false);
    };
    if (showUserMenu) document.addEventListener('click', cerrarMenu);
    return () => document.removeEventListener('click', cerrarMenu);
  }, [showUserMenu]);

  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que quieres cerrar tu sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      sessionStorage.removeItem('usuario');
      setUsuario(null);
      setShowUserMenu(false);
      window.dispatchEvent(new Event('userLogout'));

      await Swal.fire({
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión correctamente',
        icon: 'success',
        confirmButtonColor: '#e74c3c',
        timer: 1500
      });

      navigate('/home');
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="contenedorTitulo">
          <img src={logo} alt="Logo Taller JPL" className="logo" />
          <h1>Taller JPL</h1>
        </div>

        <button 
          className="menuHamburguesa" 
          onClick={() => setMenuMobileOpen(!menuMobileOpen)}
          aria-label="Menú"
        >
          {menuMobileOpen ? <span style={{fontSize: '24px'}}>✕</span> : <span style={{fontSize: '24px'}}>☰</span>}
        </button>

        {menuMobileOpen && (
          <div className="menuOverlay" onClick={() => setMenuMobileOpen(false)}></div>
        )}

        <nav className={`navBarlist ${menuMobileOpen ? 'mobileAbierto' : ''}`}>
          <ul className="lista">
            <li className="itemes"><Link to="/home" onClick={() => setMenuMobileOpen(false)}>Home</Link></li>
            <li className="itemes"><Link to="/servicios" onClick={() => setMenuMobileOpen(false)}>Servicios</Link></li>
            <li className="itemes"><Link to="/contacto" onClick={() => setMenuMobileOpen(false)}>Contacto</Link></li>
            <li className="itemes"><Link to="/nosotros" onClick={() => setMenuMobileOpen(false)}>Acerca de</Link></li>
          </ul>
        </nav>

        <div className="seccionAuth">
          {usuario ? (
            <div className="seccionUsuario">
              <button className="btnUsuario" onClick={() => setShowUserMenu(!showUserMenu)}>
                <span className="nombreUsuario">Hola, {usuario.nombre.split(' ')[0]}</span>
                <span className="iconoUsuarioMobile" style={{fontSize: '28px'}}>👤</span>
              </button>

              {showUserMenu && (
                <div className="menuUsuario">
                  <div className="infoUsuario">
                    <p>{usuario.nombre}</p>
                    <p>{usuario.email}</p>
                  </div>
                  <hr className="separador" />
                  <button className="opcionMenu" onClick={() => navigate('/Cuenta')}>
                    Ver Perfil
                  </button>
                  <button className="opcionMenu cerrarSesion" onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/LogIn" className="btnUsuario">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;