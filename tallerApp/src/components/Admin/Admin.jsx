import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCitas from '../../services/ServicesCitas';
import ServiceComentsUsers from '../../services/ServicesComentsUsers';
import Swal from 'sweetalert2';
import './panelAdmin.css';

function PanelAdmin() {
  const [citas, setCitas] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [vistaActual, setVistaActual] = useState('citas');
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si es admin
    const usuario = JSON.parse(sessionStorage.getItem('usuario') || '{}');
    if (!usuario.esAdmin) {
      Swal.fire({
        icon: 'error',
        title: 'Acceso denegado',
        text: 'No tienes permisos de administrador',
        confirmButtonColor: '#e74c3c'
      }).then(() => {
        navigate('/');
      });
      return;
    }

    cargarDatos();
  }, [navigate]);

  const cargarDatos = async () => {
    try {
      const [citasData, comentariosData] = await Promise.all([
        ServiceCitas.getCitas(),
        ServiceComentsUsers.getComentsUsers()
      ]);
      setCitas(citasData);
      setComentarios(comentariosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      mostrarAlerta('error', 'Error', 'No se pudieron cargar los datos');
    }
  };

  const cambiarEstadoCita = async (id, nuevoEstado) => {
    try {
      await ServiceCitas.updateCitas(id, { estado: nuevoEstado });
      setCitas(prevCitas => 
        prevCitas.map(cita => 
          cita.id === id ? { ...cita, estado: nuevoEstado } : cita
        )
      );
      mostrarAlerta('success', 'Estado actualizado', `La cita ha sido marcada como ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      mostrarAlerta('error', 'Error', 'No se pudo actualizar el estado');
    }
  };

  const eliminarCita = async (id) => {
    const resultado = await Swal.fire({
      title: '¿Eliminar cita?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#95a5a6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (resultado.isConfirmed) {
      try {
        await ServiceCitas.deleteCitas(id);
        setCitas(prevCitas => prevCitas.filter(cita => cita.id !== id));
        mostrarAlerta('success', 'Eliminada', 'La cita ha sido eliminada correctamente');
      } catch (error) {
        mostrarAlerta('error', 'Error', 'No se pudo eliminar la cita');
      }
    }
  };

  const eliminarComentario = async (id) => {
    const resultado = await Swal.fire({
      title: '¿Eliminar comentario?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#95a5a6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (resultado.isConfirmed) {
      try {
        await ServiceComentsUsers.deleteComentsUsers(id);
        setComentarios(prevComentarios => prevComentarios.filter(com => com.id !== id));
        mostrarAlerta('success', 'Eliminado', 'El comentario ha sido eliminado correctamente');
      } catch (error) {
        mostrarAlerta('error', 'Error', 'No se pudo eliminar el comentario');
      }
    }
  };

  const mostrarAlerta = (icon, title, text) => {
    Swal.fire({ icon, title, text, confirmButtonColor: '#e74c3c' });
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin fecha';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const cerrarSesion = () => {
    sessionStorage.removeItem('usuario');
    navigate('/');
  };

  const citasFiltradas = filtroEstado === 'todas' 
    ? citas 
    : citas.filter(cita => cita.estado === filtroEstado);

  const estadisticas = {
    totalCitas: citas.length,
    pendientes: citas.filter(c => c.estado === 'pendiente').length,
    completadas: citas.filter(c => c.estado === 'completada' || c.estado === 'finalizada').length,
    comentarios: comentarios.length
  };

  return (
    <div className="panelAdmin">
      <header className="headerAdmin">
        <h1>Panel de Administración</h1>
        <div className="accionesHeader">
          <button onClick={() => navigate('/home')} className="btnSecundario">
            Ver Sitio
          </button>
          <button onClick={cerrarSesion} className="btnCerrarSesion">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <nav className="navAdmin">
        <button 
          className={vistaActual === 'citas' ? 'activo' : ''}
          onClick={() => setVistaActual('citas')}
        >
          Gestión de Citas ({estadisticas.totalCitas})
        </button>
        <button 
          className={vistaActual === 'comentarios' ? 'activo' : ''}
          onClick={() => setVistaActual('comentarios')}
        >
          Comentarios ({estadisticas.comentarios})
        </button>
      </nav>

      <div className="estadisticasAdmin">
        <div className="estatCard">
          <h3>{estadisticas.totalCitas}</h3>
          <p>Total Citas</p>
        </div>
        <div className="estatCard">
          <h3>{estadisticas.pendientes}</h3>
          <p>Pendientes</p>
        </div>
        <div className="estatCard">
          <h3>{estadisticas.completadas}</h3>
          <p>Completadas</p>
        </div>
        <div className="estatCard">
          <h3>{estadisticas.comentarios}</h3>
          <p>Comentarios</p>
        </div>
      </div>

      {vistaActual === 'citas' && (
        <div className="seccionCitas">
          <div className="filtrosAdmin">
            <h2>Gestión de Citas</h2>
            <select 
              value={filtroEstado} 
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="filtroSelect"
            >
              <option value="todas">Todas las citas</option>
              <option value="pendiente">Pendientes</option>
              <option value="completada">Completadas</option>
              <option value="finalizada">Finalizadas</option>
            </select>
          </div>

          <div className="listaCitas">
            {citasFiltradas.map(cita => (
              <div key={cita.id} className="tarjetaCitaAdmin">
                <div className="infoCitaAdmin">
                  <h4>{cita.nombre}</h4>
                  <p><strong>Email:</strong> {cita.email}</p>
                  <p><strong>Teléfono:</strong> {cita.telefono}</p>
                  <p><strong>Servicio:</strong> {cita.servicio}</p>
                  <p><strong>Fecha:</strong> {formatearFecha(cita.fecha)}</p>
                  {cita.hora && <p><strong>Hora:</strong> {cita.hora}</p>}
                  {cita.mensaje && <p><strong>Mensaje:</strong> {cita.mensaje}</p>}
                  <p><strong>Estado:</strong> 
                    <span className={`estadoBadge ${cita.estado}`}>{cita.estado}</span>
                  </p>
                  <small>Creada: {formatearFecha(cita.fechaCreacion)}</small>
                </div>

                <div className="accionesCita">
                  <div className="cambiarEstado">
                    <label>Cambiar estado:</label>
                    <select 
                      value={cita.estado}
                      onChange={(e) => cambiarEstadoCita(cita.id, e.target.value)}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="completada">Completada</option>
                      <option value="finalizada">Finalizada</option>
                    </select>
                  </div>
                  <button 
                    className="btnEliminar"
                    onClick={() => eliminarCita(cita.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {vistaActual === 'comentarios' && (
        <div className="seccionComentarios">
          <h2>Comentarios de Usuarios</h2>
          <div className="listaComentarios">
            {comentarios.map(comentario => (
              <div key={comentario.id} className="tarjetaComentarioAdmin">
                <div className="infoComentarioAdmin">
                  <h4>{comentario.nombreUsuario}</h4>
                  <p><strong>Email:</strong> {comentario.emailUsuario}</p>
                  <div className="comentarioTexto">
                    <p>{comentario.comentario}</p>
                  </div>
                  <p><strong>Servicios completados:</strong> {comentario.citasCompletadas}</p>
                  <small>Comentario del: {formatearFecha(comentario.fechaComentario)}</small>
                </div>
                <div className="accionesComentario">
                  <button 
                    className="btnEliminar"
                    onClick={() => eliminarComentario(comentario.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PanelAdmin;