import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ServicesUsers from '../../services/ServicesUsers';
import ServiceCitas from '../../services/ServicesCitas';
import TicketGenerator from '../../utils/TicketGenerator';
import Swal from 'sweetalert2';
import '../Perfil/perfil.css';

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [puedeComentear, setPuedeComentear] = useState(false);
  const [citasCompletadas, setCitasCompletadas] = useState(0);
  const [todasLasCitas, setTodasLasCitas] = useState([]);
  const [vistaHistorial, setVistaHistorial] = useState(false);

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
      const citas = await ServiceCitas.getCitas();
      const citasDelUsuario = citas.filter(cita => cita.userId === datosUsuario.id);
      const citasFinalizadas = citasDelUsuario.filter(cita =>
        cita.estado === 'completada' || cita.estado === 'finalizada'
      );

      setTodasLasCitas(citasDelUsuario);
      setCitasCompletadas(citasFinalizadas.length);
      setPuedeComentear(citasFinalizadas.length > 0);
    } catch (error) {
      console.error('Error al verificar citas:', error);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin fecha';
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  const formatearHora = (hora) => {
    if (!hora) return 'Sin hora';
    try {
      const [horas, minutos] = hora.split(':');
      const horaNum = parseInt(horas);
      const ampm = horaNum >= 12 ? 'PM' : 'AM';
      const hora12 = horaNum > 12 ? horaNum - 12 : horaNum === 0 ? 12 : horaNum;
      return `${hora12}:${minutos} ${ampm}`;
    } catch {
      return hora;
    }
  };

  const obtenerColorEstado = (estado) => {
    const colores = {
      'pendiente': '#f39c12',
      'confirmada': '#3498db',
      'completada': '#27ae60',
      'finalizada': '#27ae60',
      'cancelada': '#e74c3c'
    };
    return colores[estado] || '#95a5a6';
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

  const irAComentarios = () => {
    navigate('/comentarios');
  };

  const descargarTicket = async (cita) => {
    try {
      await TicketGenerator.generarTicket(cita, usuario);
      Swal.fire({
        icon: 'success',
        title: 'Ticket descargado',
        text: 'El ticket se ha descargado correctamente',
        confirmButtonColor: '#e74c3c'
      });
    } catch (error) {
      console.error('Error al descargar ticket:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo descargar el ticket',
        confirmButtonColor: '#e74c3c'
      });
    }
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

      <div className="seccionHistorial">
        <div className="historialHeader">
          <h3>Historial de Citas</h3>
          <button
            className="btnToggleHistorial"
            onClick={() => setVistaHistorial(!vistaHistorial)}
          >
            {vistaHistorial ? 'Ocultar' : 'Ver Historial'}
          </button>
        </div>

        {vistaHistorial && (
          <div className="contenedorHistorial">
            {todasLasCitas.length > 0 ? (
              <div className="listaCitas">
                {todasLasCitas.map((cita) => (
                  <div key={cita.id} className="tarjetaCitaHistorial">
                    <div className="headerCita">
                      <h4>{cita.servicio}</h4>
                      <div
                        className="estadoBadge"
                        style={{ backgroundColor: obtenerColorEstado(cita.estado) }}
                      >
                        {cita.estado}
                      </div>
                    </div>
                    <div className="detalleCita">
                      <p><strong>Fecha:</strong> {formatearFecha(cita.fecha)}</p>
                      <p><strong>Hora:</strong> {formatearHora(cita.hora)}</p>
                      {cita.mensaje && <p><strong>Mensaje:</strong> {cita.mensaje}</p>}
                      <p><strong>Código:</strong> {cita.codigoConfirmacion}</p>
                      <p className="fechaCreacion">
                        Creada: {formatearFecha(cita.fechaCreacion)}
                      </p>
                    </div>
                    <div className="accionesCita">
                      <button
                        className="btnDescargarTicket"
                        onClick={() => descargarTicket(cita)}
                      >
                        📄 Descargar Ticket
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="sinCitas">
                <p>No tienes citas registradas aún.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Perfil;