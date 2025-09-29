import React, { useState, useEffect } from 'react';
import ServiceCitas from '../../services/ServicesCitas';
import ServiceComentsUsers from '../../services/ServicesComentsUsers';
import Swal from 'sweetalert2';
import './comentariosUsers.css';

function ComentariosUsers() {
  const [comentario, setComentario] = useState('');
  const [citasCompletadas, setCitasCompletadas] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [puedeComentear, setPuedeComentear] = useState(false);

  useEffect(() => {
    verificarUsuarioYCitas();
  }, []);

  const verificarUsuarioYCitas = async () => {
    const usuarioGuardado = sessionStorage.getItem('usuario');
    if (!usuarioGuardado) {
      setPuedeComentear(false);
      return;
    }

    const datosUsuario = JSON.parse(usuarioGuardado);
    setUsuario(datosUsuario);

    try {
      const todasLasCitas = await ServiceCitas.getCitas();
      
      
      const citasDelUsuario = todasLasCitas.filter(cita => 
        cita.email === datosUsuario.email && 
        (cita.estado === 'completada' || cita.estado === 'finalizada')
      );

      setCitasCompletadas(citasDelUsuario);

      setPuedeComentear(citasDelUsuario.length > 0);

    } catch (error) {
      console.error('Error al verificar citas:', error);
      setPuedeComentear(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comentario.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'Por favor escribe tu comentario',
        confirmButtonColor: '#e74c3c'
      });
      return;
    }

    try {
      const nuevoComentario = {
        usuarioId: usuario.id,
        nombreUsuario: usuario.nombre,
        emailUsuario: usuario.email,
        comentario: comentario.trim(),
        fechaComentario: new Date().toISOString(),
        citasCompletadas: citasCompletadas.length
      };

      await ServiceComentsUsers.createComentsUsers(nuevoComentario);
      
      setComentario('');
      
      Swal.fire({
        icon: 'success',
        title: 'Comentario enviado',
        text: 'Gracias por compartir tu experiencia con nosotros',
        confirmButtonColor: '#e74c3c'
      });

    } catch (error) {
      console.error('Error al enviar comentario:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar tu comentario. Inténtalo de nuevo.',
        confirmButtonColor: '#e74c3c'
      });
    }
  };

  if (!usuario) {
    return (
      <div className="comentariosContainer">
        <div className="mensajeAcceso">
          <h3>Acceso requerido</h3>
          <p>Debes iniciar sesión para poder comentar</p>
        </div>
      </div>
    );
  }

  if (!puedeComentear) {
    return (
      <div className="comentariosContainer">
        <div className="mensajeRestriccion">
          <h3>Comentarios disponibles después del servicio</h3>
          <p>Para poder dejar un comentario, necesitas haber completado al menos una cita con nosotros.</p>
          <p>Una vez que tu moto haya sido atendida y el servicio finalizado, podrás compartir tu experiencia.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="comentariosContainer">
      <div className="comentariosForm">
        <h3>Comparte tu experiencia</h3>
        <p>Hola <strong>{usuario.nombre}</strong>, nos gustaría conocer tu opinión sobre nuestro servicio.</p>
        <p className="infoCitas">Has completado {citasCompletadas.length} servicio{citasCompletadas.length !== 1 ? 's' : ''} con nosotros.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="grupoComentario">
            <label htmlFor="comentario">Tu comentario:</label>
            <textarea
              id="comentario"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Cuéntanos sobre tu experiencia con nuestro taller..."
              rows="5"
              maxLength="500"
              required
            />
            <small className="contadorCaracteres">
              {comentario.length}/500 caracteres
            </small>
          </div>
          
          <div className="botonesComentario">
            <button type="submit" className="btnEnviarComentario">
              Enviar Comentario
            </button>
            <button 
              type="button" 
              className="btnLimpiarComentario"
              onClick={() => setComentario('')}
            >
              Limpiar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ComentariosUsers;