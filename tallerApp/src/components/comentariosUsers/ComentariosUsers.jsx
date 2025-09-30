import React, { useState, useEffect } from 'react';
import ServiceCitas from '../../services/ServicesCitas';
import ServicesComents from '../../services/ServicesComents';
import ModerationService from '../../services/ModerationService';
import Swal from 'sweetalert2';
import './comentariosUsers.css';

function ComentariosUsers() {
  const [comentario, setComentario] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [citasCompletadas, setCitasCompletadas] = useState([]);
  const [citasSinComentar, setCitasSinComentar] = useState([]);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [puedeComentear, setPuedeComentear] = useState(false);
  const [moderando, setModerando] = useState(false);

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
      const todosLosComentarios = await ServicesComents.getComentsUsers();

      const citasDelUsuario = todasLasCitas.filter(cita =>
        cita.userId === datosUsuario.id &&
        (cita.estado === 'completada' || cita.estado === 'finalizada')
      );

      // Filtrar citas que aún no tienen comentario
      const citasSinComentario = citasDelUsuario.filter(cita => {
        const yaComentada = todosLosComentarios.some(
          comentario => comentario.citaId === cita.id
        );
        return !yaComentada;
      });

      setCitasCompletadas(citasDelUsuario);
      setCitasSinComentar(citasSinComentario);
      setPuedeComentear(citasSinComentario.length > 0);

      if (citasSinComentario.length > 0) {
        setCitaSeleccionada(citasSinComentario[0].id);
      }

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

    if (rating === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Valoración requerida',
        text: 'Por favor califica tu experiencia con estrellas',
        confirmButtonColor: '#e74c3c'
      });
      return;
    }

    try {
      // Mostrar indicador de moderación
      setModerando(true);

      // Moderar el comentario con IA
      const resultadoModeracion = await ModerationService.moderarComentario(
        comentario.trim(),
        rating
      );

      setModerando(false);

      // Si el comentario NO fue aprobado
      if (!resultadoModeracion.aprobado) {
        await Swal.fire({
          icon: 'warning',
          title: 'Comentario no aprobado',
          html: `
            <p><strong>Razón:</strong> ${resultadoModeracion.razon}</p>
            ${resultadoModeracion.sugerencia ? `<p><strong>Sugerencia:</strong> ${resultadoModeracion.sugerencia}</p>` : ''}
          `,
          confirmButtonColor: '#e74c3c',
          confirmButtonText: 'Entendido'
        });
        return;
      }

      // Si fue aprobado, guardar el comentario
      const citaComentada = citasCompletadas.find(c => c.id === citaSeleccionada);

      const nuevoComentario = {
        usuarioId: usuario.id,
        nombreUsuario: usuario.nombre,
        emailUsuario: usuario.email,
        comentario: comentario.trim(),
        rating: rating,
        fechaComentario: new Date().toISOString(),
        citaId: citaSeleccionada,
        servicioNombre: citaComentada?.servicio || 'Servicio',
        moderado: true
      };

      await ServicesComents.createComentsUsers(nuevoComentario);

      setComentario('');
      setRating(0);

      // Recargar citas para actualizar la lista
      await verificarUsuarioYCitas();

      Swal.fire({
        icon: 'success',
        title: '¡Comentario publicado!',
        text: 'Tu comentario ha sido aprobado y publicado correctamente',
        confirmButtonColor: '#e74c3c'
      });

    } catch (error) {
      setModerando(false);
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
      <div className="comentarios__contenedor">
        <div className="comentarios__mensaje-acceso">
          <h3>Acceso requerido</h3>
          <p>Debes iniciar sesión para poder comentar</p>
        </div>
      </div>
    );
  }

  if (!puedeComentear) {
    return (
      <div className="comentarios__contenedor">
        <div className="comentarios__mensaje-restriccion">
          <h3>No hay citas disponibles para comentar</h3>
          {citasCompletadas.length === 0 ? (
            <>
              <p>Para poder dejar un comentario, necesitas haber completado al menos una cita con nosotros.</p>
              <p>Una vez que tu moto haya sido atendida y el servicio finalizado, podrás compartir tu experiencia.</p>
            </>
          ) : (
            <>
              <p>Ya has comentado todas tus citas completadas.</p>
              <p>¡Gracias por compartir tu experiencia con nosotros!</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="comentarios__contenedor">
      <div className="comentarios__formulario">
        <h3>Comparte tu experiencia</h3>
        <p>Hola <strong>{usuario.nombre}</strong>, nos gustaría conocer tu opinión sobre nuestro servicio.</p>
        <p className="comentarios__info-citas">
          Tienes {citasSinComentar.length} cita{citasSinComentar.length !== 1 ? 's' : ''} sin comentar de {citasCompletadas.length} completada{citasCompletadas.length !== 1 ? 's' : ''}.
        </p>

        <div>
          <div className="comentarios__grupo-cita">
            <label>Selecciona la cita a comentar:</label>
            <select
              value={citaSeleccionada || ''}
              onChange={(e) => setCitaSeleccionada(e.target.value)}
              className="comentarios__select-cita"
            >
              {citasSinComentar.map((cita) => (
                <option key={cita.id} value={cita.id}>
                  {cita.servicio} - {new Date(cita.fecha).toLocaleDateString('es-ES')}
                </option>
              ))}
            </select>
          </div>

          <div className="comentarios__grupo-rating">
            <label>Califica tu experiencia:</label>
            <div className="comentarios__estrellas">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`comentarios__estrella ${star <= (hoverRating || rating) ? 'activa' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </button>
              ))}
            </div>
            {rating > 0 && (
              <small className="comentarios__texto-rating">
                {rating === 1 && 'Malo'}
                {rating === 2 && 'Regular'}
                {rating === 3 && 'Bueno'}
                {rating === 4 && 'Muy bueno'}
                {rating === 5 && 'Excelente'}
              </small>
            )}
          </div>

          <div className="comentarios__grupo-comentario">
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
            <small className="comentarios__contador">
              {comentario.length}/500 caracteres
            </small>
          </div>

          <div className="comentarios__botones">
            <button
              type="button"
              className="comentarios__btn-enviar"
              onClick={handleSubmit}
              disabled={moderando}
            >
              {moderando ? 'Moderando con IA...' : 'Enviar Comentario'}
            </button>
            <button
              type="button"
              className="comentarios__btn-limpiar"
              onClick={() => {
                setComentario('');
                setRating(0);
              }}
              disabled={moderando}
            >
              Limpiar
            </button>
          </div>

          {moderando && (
            <div className="comentarios__mensaje-moderacion">
              <p>🤖 Analizando tu comentario con inteligencia artificial...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComentariosUsers;