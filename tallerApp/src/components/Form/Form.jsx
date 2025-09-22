import React, { useState, useEffect } from 'react'
import ServicesCitas from '../services/ServicesCitas.jsx'
import Swal from 'sweetalert2'

function FormCitas() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    servicio: '',
    fecha: '',
    hora: '',
    mensaje: ''
  });

  const [listaCitas, setListaCitas] = useState([]);

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      const citas = await ServiceCitas.getCitas();
      setListaCitas(citas);
    } catch (error) {
      console.error("Error al cargar citas:", error);
      mostrarAlerta('error', 'Error', 'No se pudieron cargar las citas');
    }
  };

  const handleChange = (evento) => {
    const { name, value } = evento.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const crearCita = async () => {
    if (!formData.nombre.trim() || !formData.email.trim() || !formData.telefono.trim() || !formData.servicio.trim()) {
      mostrarAlerta('warning', 'Campos requeridos', 'Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      const nuevaCita = {
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        telefono: formData.telefono.trim(),
        servicio: formData.servicio.trim(),
        fecha: formData.fecha,
        hora: formData.hora,
        mensaje: formData.mensaje.trim(),
        fechaCreacion: new Date().toISOString(),
        estado: 'pendiente'
      };
      
      const citaCreada = await ServiceCitas.createCitas(nuevaCita);
      setListaCitas(prevCitas => [...prevCitas, citaCreada]);
      
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        servicio: '',
        fecha: '',
        hora: '',
        mensaje: ''
      });
      
      mostrarAlerta('success', 'Éxito', 'Tu cita ha sido creada correctamente');
      
    } catch (error) {
      console.error("Error al crear cita:", error);
      mostrarAlerta('error', 'Error', 'No se pudo crear la cita');
    }
  };

  const eliminarCita = async (id) => {
    const resultado = await Swal.fire({
      title: '¿Eliminar cita?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!resultado.isConfirmed) return;

    try {
      await ServiceCitas.deleteCitas(id);
      setListaCitas(prevCitas => prevCitas.filter(cita => cita.id !== id));
      mostrarAlerta('success', 'Eliminada', 'La cita ha sido eliminada correctamente');
    } catch (error) {
      console.error("Error al eliminar cita:", error);
      mostrarAlerta('error', 'Error', 'No se pudo eliminar la cita');
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Sin fecha';
    try {
      const fechaObj = new Date(fecha);
      return fechaObj.toLocaleDateString('es-ES');
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  function mostrarAlerta(tipo, titulo, mensaje) {
    Swal.fire({
      icon: tipo,
      title: titulo,
      text: mensaje,
      confirmButtonText: 'Aceptar',
    });
  }

  return (
    <div>
      <div>
        <h2>Agendar Nueva Cita</h2>
        <div>
          <div>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre completo *"
              value={formData.nombre}
              onChange={handleChange}
              onKeyDown={(evento) => {
                if (evento.key === "Enter") {
                  crearCita()
                }
              }}
            />
          </div>
          
          <div>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico *"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <input
              type="tel"
              name="telefono"
              placeholder="Número de teléfono *"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          <div>
            <select
              name="servicio"
              value={formData.servicio}
              onChange={handleChange}
            >
              <option value="">Selecciona un servicio *</option>
              <option value="consulta">Consulta General</option>
              <option value="revision">Revisión</option>
              <option value="tratamiento">Tratamiento</option>
              <option value="emergencia">Emergencia</option>
              <option value="seguimiento">Seguimiento</option>
            </select>
          </div>

          <div>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
            />
          </div>

          <div>
            <input
              type="time"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <textarea
              name="mensaje"
              placeholder="Mensaje adicional (opcional)"
              value={formData.mensaje}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
          
          <div>
            <button onClick={crearCita}>
              Agendar Cita
            </button>
            <button onClick={() => setFormData({ nombre: '', email: '', telefono: '', servicio: '', fecha: '', hora: '', mensaje: '' })}>
              Limpiar Campos
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3>Mis Citas ({listaCitas.length})</h3>
        {listaCitas.length > 0 ? (
          <div>
            {listaCitas.map((cita) => (
              <div key={cita.id}>
                <div>
                  <h4>{cita.nombre}</h4>
                  <p>Email: {cita.email}</p>
                  <p>Teléfono: {cita.telefono}</p>
                  <p>Servicio: {cita.servicio}</p>
                  {cita.fecha && <p>Fecha: {formatearFecha(cita.fecha)}</p>}
                  {cita.hora && <p>Hora: {cita.hora}</p>}
                  {cita.mensaje && <p>Mensaje: {cita.mensaje}</p>}
                  <p>Estado: {cita.estado}</p>
                  <small>Creada: {formatearFecha(cita.fechaCreacion)}</small>
                </div>
                <div>
                  <button onClick={() => eliminarCita(cita.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p>No hay citas agendadas</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FormCitas