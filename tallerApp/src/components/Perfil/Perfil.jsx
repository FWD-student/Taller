import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ServicesUsers from '../../services/ServicesUsers';
import ServiceCitas from '../../services/ServicesCitas';
import Swal from 'sweetalert2';
import '../Perfil/perfil.css';

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [puedeComentear, setPuedeComentear] = useState(false);
  const [citasCompletadas, setCitasCompletadas] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const usuarioGuardado = sessionStorage.getItem('usuario');
    if (!usuarioGuardado) {
      Swal.fire({
        icon: 'warning',
        title: 'Acceso denegado',
        text: 'Debes iniciar sesión para ver tu perfil',
        confirmButtonColor: '#e74c3c'
      });
      return;
    }

    const { id } = JSON.parse(usuarioGuardado);
    cargarDatosUsuario(id);
    verificarCitasCompletadas(JSON.parse(usuarioGuardado));
  }, []);

  const cargarDatosUsuario = async (id) => {
    try {
      const usuarios = await ServicesUsers.getUsuarios();
      const datos = usuarios.find(u => u.id === id);
      if (datos) {
        setUsuario(datos);
        setForm(datos);
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar tus datos',
        confirmButtonColor: '#e74c3c'
      });
    }
  };

  const verificarCitasCompletadas = async (datosUsuario) => {
    try {
      const todasLasCitas = await ServiceCitas.getCitas();
      const citasDelUsuario = todasLasCitas.filter(cita => 
        cita.email === datosUsuario.email && 
        (cita.estado === 'completada' || cita.estado === 'finalizada')
      );
      
      setCitasCompletadas(citasDelUsuario.length);
      setPuedeComentear(citasDelUsuario.length > 0);
    } catch (error) {
      console.error('Error al verificar citas:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let nuevoValor = value;

    if (name === 'telefono' || name === 'cedula') {
      nuevoValor = value.replace(/\D/g, '');
    }

    if (name === 'nombre') {
      nuevoValor = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    }

    setForm(prev => ({ ...prev, [name]: nuevoValor }));
  };

  const guardarCambios = async () => {
    if (!form) return;

    if (form.cedula.length < 9 || form.telefono.length < 8) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos inválidos',
        text: 'Verifica que la cédula tenga al menos 9 dígitos y el teléfono al menos 8.',
        confirmButtonColor: '#e74c3c'
      });
      return;
    }

    try {
      await ServicesUsers.updateUsuarios(form.id, form);
      sessionStorage.setItem('usuario', JSON.stringify(form));
      setUsuario(form);
      setModoEdicion(false);

      Swal.fire({
        icon: 'success',
        title: 'Datos actualizados',
        text: 'Tu perfil se ha guardado correctamente',
        confirmButtonColor: '#e74c3c'
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: 'No se pudieron actualizar tus datos',
        confirmButtonColor: '#e74c3c'
      });
    }
  };

  // modificarlo
  const irAComentarios = () => {
    navigate('/comentarios');
  };

  if (!form) return null;

  return (
    <div className="perfilContainer">
      <h2>Mi Perfil</h2>

      <button className="btnVolver" onClick={() => navigate('/home')}>
        ← Volver
      </button>

      <div className="perfilFormulario">
        <label>Cédula</label>
        <input
          type="text"
          name="cedula"
          value={form.cedula}
          onChange={handleChange}
          maxLength="13"
          pattern="[0-9]*"
          disabled={!modoEdicion}
        />

        <label>Nombre</label>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          disabled={!modoEdicion}
        />

        <label htmlFor="telefono">Teléfono</label>
        <input
          type="text"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          maxLength="15"
          pattern="[0-9]*"
          disabled={!modoEdicion}
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          disabled={!modoEdicion}
        />

        <div className="botonesPerfil">
          {modoEdicion ? (
            <>
              <button className="btnGuardar" onClick={guardarCambios}>Guardar</button>
              <button className="btnCancelar" onClick={() => {
                setForm(usuario);
                setModoEdicion(false);
              }}>Cancelar</button>
            </>
          ) : (
            <button className="btnEditar" onClick={() => setModoEdicion(true)}>Editar</button>
          )}
        </div>
      </div>

      <div className="seccionComentarios">
        <h3>Comparte tu experiencia</h3>
        {puedeComentear ? (
          <div className="comentariosHabilitados">
            <p>Has completado <strong>{citasCompletadas}</strong> servicio{citasCompletadas !== 1 ? 's' : ''} con nosotros.</p>
            <p>¡Nos encantaría conocer tu opinión!</p>
            <button className="btnComentarios" onClick={irAComentarios}>
              Escribir Comentario
            </button>
          </div>
        ) : (
          <div className="comentariosDeshabilitados">
            <p>Para poder comentar, necesitas haber completado al menos un servicio con nosotros.</p>
            <p>Una vez que tu cita sea finalizada, podrás compartir tu experiencia.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Perfil;