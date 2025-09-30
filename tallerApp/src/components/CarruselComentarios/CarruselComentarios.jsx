import React, { useState, useEffect } from 'react';
import ServicesComents from '../../services/ServicesComents';
import './carruselComentarios.css';

function CarruselComentarios() {
  const [comentarios, setComentarios] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarComentarios();
  }, []);

  const cargarComentarios = async () => {
    try {
      const data = await ServicesComents.getComentsUsers();
      setComentarios(data);
      setCargando(false);
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
      setCargando(false);
    }
  };

  const siguiente = () => {
    setIndiceActual((prev) => (prev + 1) % comentarios.length);
  };

  const anterior = () => {
    setIndiceActual((prev) => (prev - 1 + comentarios.length) % comentarios.length);
  };

  const irA = (indice) => {
    setIndiceActual(indice);
  };

  const renderEstrellas = (rating) => {
    return [...Array(5)].map((_, i) => (
      <i key={i} className={`carrusel__estrella ${i < rating ? 'llena' : 'vacia'}`}>
        ★
      </i>
    ));
  };

  if (cargando) {
    return (
      <div className="carrusel__contenedor">
        <div className="carrusel__cargando">
          <p>Cargando testimonios...</p>
        </div>
      </div>
    );
  }

  if (comentarios.length === 0) {
    return (
      <div className="carrusel__contenedor">
        <div className="carrusel__sin-comentarios">
          <h3>Testimonios de Clientes</h3>
          <p>Aún no hay comentarios. ¡Sé el primero en compartir tu experiencia!</p>
        </div>
      </div>
    );
  }

  const comentarioActual = comentarios[indiceActual];

  return (
    <div className="carrusel__contenedor">
      <h3 className="carrusel__titulo">Lo que dicen nuestros clientes</h3>

      <div className="carrusel__wrapper">
        <button className="carrusel__btn-nav carrusel__btn-anterior" onClick={anterior} aria-label="Anterior"></button>

        <div className="carrusel__card">
          <div className="carrusel__avatar-seccion">
            <div className="carrusel__avatar">
              {comentarioActual.nombreUsuario.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="carrusel__contenido">
            <h4 className="carrusel__nombre">{comentarioActual.nombreUsuario}</h4>

            <div className="carrusel__rating">
              {renderEstrellas(comentarioActual.rating || 5)}
            </div>

            <p className="carrusel__texto">"{comentarioActual.comentario}"</p>

            <div className="carrusel__info">
              <div className="carrusel__badge">
                {comentarioActual.citasCompletadas} servicio{comentarioActual.citasCompletadas !== 1 ? 's' : ''} completado{comentarioActual.citasCompletadas !== 1 ? 's' : ''}
              </div>
              <div className="carrusel__fecha">
                {new Date(comentarioActual.fechaComentario).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long'
                })}
              </div>
            </div>
          </div>
        </div>

        <button className="carrusel__btn-nav carrusel__btn-siguiente" onClick={siguiente} aria-label="Siguiente"></button>
      </div>

      <div className="carrusel__indicadores">
        {comentarios.map((_, indice) => (
          <button
            key={indice}
            className={`carrusel__indicador ${indice === indiceActual ? 'activo' : ''}`}
            onClick={() => irA(indice)}
            aria-label={`Ir al comentario ${indice + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default CarruselComentarios;