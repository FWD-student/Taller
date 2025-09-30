import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServicesUsers from '../../services/ServicesUsers';
import EmailService from '../../services/EmailService';
import Swal from 'sweetalert2';
import './sesion.css';

const Sesion = () => {
  const navigate = useNavigate();
  const [tipoForm, setTipoForm] = useState('login');

  const [formLogin, setFormLogin] = useState({ usuario: '', password: '' });
  const [formRegistro, setFormRegistro] = useState({
    cedula: '', nombre: '', telefono: '', email: '', password: ''
  });

  const [verificacionPendiente, setVerificacionPendiente] = useState(false);
  const [codigoGenerado, setCodigoGenerado] = useState('');
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [tiempoExpiracion, setTiempoExpiracion] = useState(null);

  const ADMIN_CREDENTIALS = {
    usuario: 'admin@tallerjpl.com',
    password: 'admin123'
  };

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

    if (formLogin.usuario.toLowerCase() === ADMIN_CREDENTIALS.usuario.toLowerCase() &&
        formLogin.password === ADMIN_CREDENTIALS.password) {

      sessionStorage.setItem('usuario', JSON.stringify({
        id: 'admin',
        nombre: 'Administrador',
        email: 'admin@tallerjpl.com',
        esAdmin: true
      }));

      await Swal.fire({
        icon: 'success',
        title: '¡Bienvenido Administrador!',
        text: 'Acceso al panel de administración',
        confirmButtonColor: '#e74c3c',
        timer: 1500
      });

      navigate('/admin');
      return;
    }

    try {
      const usuarios = await ServicesUsers.getUsuarios();
      const usuario = usuarios.find(u =>
        (u.email.toLowerCase() === formLogin.usuario.toLowerCase() ||
         u.nombre.toLowerCase() === formLogin.usuario.toLowerCase()) &&
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
        telefono: usuario.telefono,
        esAdmin: false
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

  const generarCodigoVerificacion = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    if (!validarCampos(formRegistro)) {
      return mostrarAlerta('warning', 'Campos incompletos', 'Por favor completa todos los campos');
    }

    // Validar contraseña: mínimo 8 caracteres alfanuméricos
    if (formRegistro.password.length < 8) {
      return mostrarAlerta('warning', 'Contraseña débil', 'La contraseña debe tener al menos 8 caracteres');
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])/;
    if (!passwordRegex.test(formRegistro.password)) {
      return mostrarAlerta('warning', 'Contraseña inválida', 'La contraseña debe contener letras y números');
    }

    try {
      const usuarios = await ServicesUsers.getUsuarios();

      // Validar email no repetido
      const emailExiste = usuarios.some(u => u.email.toLowerCase() === formRegistro.email.toLowerCase());
      if (emailExiste) {
        return mostrarAlerta('warning', 'Email en uso', 'Este correo electrónico ya está registrado');
      }

      // Validar teléfono máximo 2 veces
      const vecesUsadoTelefono = usuarios.filter(u => u.telefono === formRegistro.telefono).length;
      if (vecesUsadoTelefono >= 2) {
        return mostrarAlerta('warning', 'Teléfono en uso', 'Este número de teléfono ya ha sido registrado el máximo de veces permitidas');
      }

      // Generar código de verificación
      const codigo = generarCodigoVerificacion();
      setCodigoGenerado(codigo);
      setTiempoExpiracion(Date.now() + 10 * 60 * 1000); // 10 minutos

      // Enviar email con código
      await EmailService.emailCodigoVerificacion(formRegistro.email, codigo, formRegistro.nombre);

      await Swal.fire({
        icon: 'info',
        title: 'Verifica tu correo',
        text: 'Hemos enviado un código de verificación a tu email',
        confirmButtonColor: '#e74c3c'
      });

      setVerificacionPendiente(true);
    } catch {
      mostrarAlerta('error', 'Error al enviar código', 'No se pudo enviar el código de verificación. Intenta de nuevo.');
    }
  };

  const verificarCodigo = async () => {
    if (!codigoIngresado.trim()) {
      return mostrarAlerta('warning', 'Código requerido', 'Ingresa el código que recibiste por email');
    }

    if (Date.now() > tiempoExpiracion) {
      setVerificacionPendiente(false);
      setCodigoIngresado('');
      return mostrarAlerta('error', 'Código expirado', 'El código ha expirado. Intenta registrarte nuevamente.');
    }

    if (codigoIngresado !== codigoGenerado) {
      return mostrarAlerta('error', 'Código incorrecto', 'El código ingresado no es válido');
    }

    try {
      // Crear usuario
      const nuevoUsuario = await ServicesUsers.createUsuarios(formRegistro);

      // Enviar email de bienvenida
      await EmailService.emailRegistroUsuario(nuevoUsuario);

      await Swal.fire({
        icon: 'success',
        title: '¡Cuenta creada!',
        text: 'Tu cuenta ha sido verificada y creada exitosamente',
        confirmButtonColor: '#e74c3c'
      });

      // Resetear estados
      setVerificacionPendiente(false);
      setCodigoIngresado('');
      setCodigoGenerado('');
      setTiempoExpiracion(null);
      setTipoForm('login');
      setFormRegistro({ cedula: '', nombre: '', telefono: '', email: '', password: '' });
    } catch {
      mostrarAlerta('error', 'Error al crear cuenta', 'No se pudo crear la cuenta. Intenta de nuevo.');
    }
  };

  const cancelarVerificacion = () => {
    setVerificacionPendiente(false);
    setCodigoIngresado('');
    setCodigoGenerado('');
    setTiempoExpiracion(null);
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

            <div className='infoAdmin'>
              <small>Admin: admin@tallerjpl.com | Contraseña: admin123</small>
            </div>

            <p className='enlaceCambio'>
              ¿No tienes cuenta?
              <span onClick={() => setTipoForm('registro')}> Regístrate aquí</span>
            </p>
          </form>
        ) : verificacionPendiente ? (
          <div className='formSesion'>
            <h2>Verificación de Correo</h2>
            <p className='subtitulo'>Ingresa el código que enviamos a {formRegistro.email}</p>

            <div className='grupoInput'>
              <label htmlFor="codigo">Código de Verificación</label>
              <input
                type="text"
                id="codigo"
                name="codigo"
                placeholder="Ingresa el código de 6 dígitos"
                value={codigoIngresado}
                onChange={e => setCodigoIngresado(e.target.value.replace(/\D/g, ''))}
                maxLength="6"
                style={{ fontSize: '18px', letterSpacing: '5px', textAlign: 'center' }}
                autoFocus
              />
            </div>

            <p className='textoAyuda'>El código expira en 10 minutos. Revisa tu bandeja de entrada o spam.</p>

            <button type="button" onClick={verificarCodigo} className='btnSecundario'>
              Verificar Código
            </button>

            <button type="button" onClick={cancelarVerificacion} className='btnPrincipal'>
              Cancelar
            </button>
          </div>
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