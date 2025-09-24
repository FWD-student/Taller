import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServicesUsers from '../../services/ServicesUsers';
import Swal from 'sweetalert2';
import './sesion.css';

const Sesion = () => {
  const navigate = useNavigate();
  const [tipoForm, setTipoForm] = useState('login');

  const [formLogin, setFormLogin] = useState({ usuario: '', password: '' });
  const [formRegistro, setFormRegistro] = useState({
    cedula: '', nombre: '', telefono: '', email: '', password: ''
  });

  const handleChange = (e, setForm, sanitize = null) => {
    const { name, value } = e.target;
    const nuevoValor = sanitize ? sanitize(value) : value;
    setForm(prev => ({ ...prev, [name]: nuevoValor }));
  };

  const validarCampos = (form) => Object.values(form).every(v => v.trim() !== '');

  const mostrarAlerta = (icon, title, text) => {
    return Swal.fire({ icon, title, text, confirmButtonColor: '#e74c3c' });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validarCampos(formLogin)) {
      return mostrarAlerta('warning', 'Campos incompletos', 'Por favor completa todos los campos');
    }

    try {
      const usuarios = await ServicesUsers.getUsuarios();
      const usuario = usuarios.find(u =>
        (u.email === formLogin.usuario || u.nombre === formLogin.usuario) &&
        u.password === formLogin.password
      );

      if (!usuario) {
        return mostrarAlerta('error', 'Error de acceso', 'Usuario o contraseña incorrectos');
      }

      sessionStorage.setItem('usuario', JSON.stringify({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        cedula: usuario.cedula,
        telefono: usuario.telefono
      }));

      await Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: `Hola ${usuario.nombre}`,
        confirmButtonColor: '#e74c3c',
        timer: 1500
      });

      navigate('/home');
    } catch {
      mostrarAlerta('error', 'Error', 'No se pudo conectar con el servidor');
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    if (!validarCampos(formRegistro)) {
      return mostrarAlerta('warning', 'Campos incompletos', 'Por favor completa todos los campos');
    }

    try {
      await ServicesUsers.createUsuarios(formRegistro);
      await Swal.fire({
        icon: 'success',
        title: '¡Cuenta creada!',
        text: 'Tu cuenta ha sido registrada correctamente',
        confirmButtonColor: '#e74c3c'
      });

      setTipoForm('login');
      setFormRegistro({ cedula: '', nombre: '', telefono: '', email: '', password: '' });
    } catch {
      mostrarAlerta('error', 'Error al registrar', 'No se pudo crear la cuenta. Intenta de nuevo.');
    }
  };

  return (
    <div className='paginaSesion'>
      <div className='contenedorSesion'>
        <div className='tabsSesion'>
          {['login', 'registro'].map(tipo => (
            <button
              key={tipo}
              className={`tabBtn ${tipoForm === tipo ? 'activo' : ''}`}
              onClick={() => setTipoForm(tipo)}
            >
              {tipo === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
            </button>
          ))}
        </div>

        {tipoForm === 'login' ? (
          <form className='formSesion' onSubmit={handleLogin}>
            <h2>Bienvenido de vuelta</h2>
            <p className='subtitulo'>Ingresa a tu cuenta</p>

            <div className='grupoInput'>
              <label htmlFor="usuario">Correo o usuario</label>
              <input
                type="text"
                id="usuario"
                name="usuario"
                placeholder="Ingresa tu usuario o email"
                value={formLogin.usuario}
                onChange={e => handleChange(e, setFormLogin)}
                required
              />
            </div>

            <div className='grupoInput'>
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Ingresa tu contraseña"
                value={formLogin.password}
                onChange={e => handleChange(e, setFormLogin)}
                required
              />
            </div>

            <button type="submit" className='btnPrincipal'>Iniciar Sesión</button>

            <p className='enlaceCambio'>
              ¿No tienes cuenta?
              <span onClick={() => setTipoForm('registro')}> Regístrate aquí</span>
            </p>
          </form>
        ) : (
          <form className='formSesion' onSubmit={handleRegistro}>
            <h2>Crear cuenta nueva</h2>
            <p className='subtitulo'>Únete a Taller JPL</p>

            <div className='grupoInputDoble'>
              <div className='grupoInput'>
                <label htmlFor="cedula">Cédula</label>
                <input
                  type="text"
                  id="cedula"
                  name="cedula"
                  placeholder="Número de cédula"
                  value={formRegistro.cedula}
                  onChange={e => handleChange(e, setFormRegistro, v => v.replace(/\D/g, ''))}
                  maxLength="10"
                  required
                />
              </div>

              <div className='grupoInput'>
                <label htmlFor="nombre">Nombre completo</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Tu nombre completo"
                  value={formRegistro.nombre}
                  onChange={e => handleChange(e, setFormRegistro, v => v.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''))}
                  required
                />
              </div>
            </div>

            <div className='grupoInputDoble'>
              <div className='grupoInput'>
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  placeholder="Número de teléfono"
                  value={formRegistro.telefono}
                  onChange={e => handleChange(e, setFormRegistro, v => v.replace(/\D/g, ''))}
                  maxLength="10"
                  required
                />
              </div>

              <div className='grupoInput'>
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="tu@email.com"
                  value={formRegistro.email}
                  onChange={e => handleChange(e, setFormRegistro)}
                  required
                />
              </div>
            </div>

            <div className='grupoInput'>
              <label htmlFor="passwordReg">Contraseña</label>
              <input
                type="password"
                id="passwordReg"
                name="password"
                placeholder="Crea una contraseña segura"
                value={formRegistro.password}
                onChange={e => handleChange(e, setFormRegistro)}
                required
              />
            </div>

            <button type="submit" className='btnPrincipal'>Crear Cuenta</button>

            <p className='enlaceCambio'>
              ¿Ya tienes cuenta?
              <span onClick={() => setTipoForm('login')}> Inicia sesión aquí</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Sesion;
