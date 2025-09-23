import React, { useState, useEffect } from 'react'
import ServiceCitas from '../../services/ServicesCitas'
import Swal from 'sweetalert2'
import '../Form/form.css'

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

  //funciontes integradas
  const obtenerFechaMinima = () => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  };

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
    
    if (name === 'telefono') {
      // Remover cualquier caracter que no sea numero
      const soloNumeros = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: soloNumeros
      }));
      return;
    }

    if (name === 'nombre') {
      const soloLetras = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: soloLetras
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validarFormulario = () => {
    // Campos obligatorios
    if (!formData.nombre.trim()) {
      mostrarAlerta('warning', 'Campo requerido', 'El nombre es obligatorio');
      return false;
    }

    if (!formData.email.trim()) {
      mostrarAlerta('warning', 'Campo requerido', 'El email es obligatorio');
      return false;
    }

    if (!formData.telefono.trim()) {
      mostrarAlerta('warning', 'Campo requerido', 'El teléfono es obligatorio');
      return false;
    }

    if (!formData.servicio.trim()) {
      mostrarAlerta('warning', 'Campo requerido', 'Debes seleccionar un servicio');
      return false;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      mostrarAlerta('warning', 'Email inválido', 'Por favor ingresa un email válido');
      return false;
    }

    if (formData.telefono.length < 8) {
      mostrarAlerta('warning', 'Teléfono inválido', 'El teléfono debe tener al menos 8 dígitos');
      return false;
    }

    if (formData.fecha) {
      const fechaSeleccionada = new Date(formData.fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas
      
      if (fechaSeleccionada < hoy) {
        mostrarAlerta('warning', 'Fecha inválida', 'No puedes seleccionar una fecha anterior a hoy');
        return false;
      }
    }

    return true;
  };

  const crearCita = async () => {
    if (!validarFormulario()) {
      return;
    }

    try {
      const nuevaCita = {
        nombre: formData.nombre.trim(),
        email: formData.email.trim().toLowerCase(),
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
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#95a5a6',
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
      return fechaObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
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
    } catch (error) {
      return hora;
    }
  };

  function mostrarAlerta(tipo, titulo, mensaje) {
    Swal.fire({
      icon: tipo,
      title: titulo,
      text: mensaje,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#e74c3c'
    });
  }

  const limpiarFormulario = () => {
    setFormData({ 
      nombre: '', 
      email: '', 
      telefono: '', 
      servicio: '', 
      fecha: '', 
      hora: '', 
      mensaje: '' 
    });
    mostrarAlerta('info', 'Campos limpiados', 'El formulario ha sido limpiado');
  };

  return (
    <div className='form'>
      <div className='seccionCita'>
        <h2>Agendar Nueva Cita</h2>
        <div className='contenedorForm'>
          <div className='grupoInput'>
            <label htmlFor="nombre">Nombre</label>
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
              maxLength="50"
            />
          </div>
          
          <div className='grupoInput'>
            <label htmlFor="email">Correo</label>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico *"
              value={formData.email}
              onChange={handleChange}
              maxLength="100"
            />
          </div>
          
          <div className='grupoInput'>
            <label htmlFor="telefono">Telefono</label>
            <input
              type="tel"
              name="telefono"
              placeholder="Número de teléfono *"
              value={formData.telefono}
              onChange={handleChange}
              maxLength="15"
              pattern="[0-9]*"
            />
          </div>

          <div className='grupoInput'>
            <select
              name="servicio"
              value={formData.servicio}
              onChange={handleChange}
            >
              <option value="">Selecciona un servicio *</option>
              <option value="mantenimiento">Mantenimiento General</option>
              <option value="revision">Revisión Técnica</option>
              <option value="reparacion">Reparacion</option>
              <option value="cambio_aceite">Cambio de Aceite</option>
              <option value="diagnostico">Diagnóstico</option>
              <option value="emergencia">Emergencia</option>
            </select>
          </div>

          <div className='grupoInput'>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              min={obtenerFechaMinima()}
            />
          </div>

          <div className='grupoInput'>
            <select
              name="hora"
              value={formData.hora}
              onChange={handleChange}
            >
              <option value="">Selecciona una hora</option>
              <option value="07:00">7:00 AM</option>
              <option value="07:30">7:30 AM</option>
              <option value="08:00">8:00 AM</option>
              <option value="08:30">8:30 AM</option>
              <option value="09:00">9:00 AM</option>
              <option value="09:30">9:30 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="10:30">10:30 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="11:30">11:30 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="12:30">12:30 PM</option>
              <option value="13:00">1:00 PM</option>
              <option value="13:30">1:30 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="14:30">2:30 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="15:30">3:30 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="16:30">4:30 PM</option>
              <option value="17:00">5:00 PM</option>
              <option value="17:30">5:30 PM</option>
            </select>
          </div>
          
          <div className='grupoInput'>
            <label htmlFor="textArea">Descripcion (opcional)</label>
            <textarea
              name="mensaje"
              placeholder="Mensaje adicional (opcional)"
              value={formData.mensaje}
              onChange={handleChange}
              rows="3"
              maxLength="500"
            />
          </div>
          
          <div className='grupsBtns'>
            <button className='btnAdd' onClick={crearCita}>
              Agendar Cita
            </button>
            <button 
              className='btnClear'
              onClick={limpiarFormulario}
            >
              Limpiar Campos
            </button>
          </div>
        </div>
      </div>

      <div className='bloqueCitas'>
        <h3>Mis Citas ({listaCitas.length})</h3>
        {listaCitas.length > 0 ? (
          <div className='contenedorList'>
            {listaCitas.map((cita) => (
              <div key={cita.id} className='tarjetaCita'>
                <div className='infoCita'>
                  <h4>{cita.nombre}</h4>
                  <p><strong>Email:</strong> {cita.email}</p>
                  <p><strong>Telefono:</strong> {cita.telefono}</p>
                  <p><strong>Servicio:</strong> {cita.servicio}</p>
                  {cita.fecha && <p><strong>Fecha:</strong> {formatearFecha(cita.fecha)}</p>}
                  {cita.hora && <p><strong>Hora:</strong> {formatearHora(cita.hora)}</p>}
                  {cita.mensaje && <p><strong>Mensaje:</strong> {cita.mensaje}</p>}
                  <p><strong>Estado:</strong> <span className={`estado ${cita.estado}`}>{cita.estado}</span></p>
                  <small>Creada: {formatearFecha(cita.fechaCreacion)}</small>
                </div>

                <div className='citaActions'>
                  <button 
                    className='btnBorrar'
                    onClick={() => eliminarCita(cita.id)}
                    title="Eliminar cita"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='msjVacio'>
            <p>No hay citas agendadas</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FormCitas