import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ServiciosService from "../../services/ServiciosServices";
import "./servicios.css";

function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    duracion: "",
    imagen: ""
  });

  const mostrarAlerta = (icon, title, text) =>
    Swal.fire({ icon, title, text, confirmButtonColor: "#e74c3c" });

  const resetForm = () =>
    setForm({ nombre: "", descripcion: "", precio: "", duracion: "", imagen: "" });

  const abrirModal = (servicio = null) => {
    setEditando(servicio);
    setForm(servicio || { nombre: "", descripcion: "", precio: "", duracion: "", imagen: "" });
    setModal(true);
  };

  const cerrarModal = () => {
    setModal(false);
    setEditando(null);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = async () => {
    try {
      const data = await ServiciosService.getServicios();
      setServicios(data);
    } catch {
      mostrarAlerta("error", "Error", "No se pudieron cargar los servicios");
    }
  };

  const guardarServicio = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.descripcion || !form.precio) {
      return mostrarAlerta("warning", "Campos requeridos", "Completa todos los campos obligatorios");
    }

    try {
      if (editando) {
        await ServiciosService.updateServicios(editando.id, form);
        setServicios((prev) =>
          prev.map((s) => (s.id === editando.id ? { ...s, ...form } : s))
        );
        mostrarAlerta("success", "Actualizado", "Servicio actualizado correctamente");
      } else {
        const nuevo = await ServiciosService.createServicios(form);
        setServicios((prev) => [...prev, nuevo]);
        mostrarAlerta("success", "Creado", "Servicio agregado correctamente");
      }
      cerrarModal();
    } catch {
      mostrarAlerta("error", "Error", "No se pudo guardar el servicio");
    }
  };

  const eliminarServicio = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "¿Eliminar servicio?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#95a5a6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!isConfirmed) return;

    try {
      await ServiciosService.deleteServicios(id);
      setServicios((prev) => prev.filter((s) => s.id !== id));
      mostrarAlerta("success", "Eliminado", "Servicio eliminado correctamente");
    } catch {
      mostrarAlerta("error", "Error", "No se pudo eliminar el servicio");
    }
  };

  return (
    <div className="serviciosAdmin">
      <header className="headerServicios">
        <h2>Gestión de Servicios</h2>
        <button onClick={() => abrirModal()} className="btnAgregar">+ Nuevo Servicio</button>
      </header>

      <div className="listaServicios">
        {servicios.map((serv) => (
          <div key={serv.id} className="cardServicio">
            {serv.imagen && <img src={serv.imagen} alt={serv.nombre} />}
            <h3>{serv.nombre}</h3>
            <p>{serv.descripcion}</p>
            <p><strong>Precio:</strong> ${serv.precio}</p>
            <p><strong>Duración:</strong> {serv.duracion} min</p>
            <div className="acciones">
              <button onClick={() => abrirModal(serv)}>Editar</button>
              <button onClick={() => eliminarServicio(serv.id)} className="btnEliminar">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="modalServicio">
          <div className="modalContenido">
            <h3>{editando ? "Editar Servicio" : "Nuevo Servicio"}</h3>
            <form onSubmit={guardarServicio}>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
              />
              <textarea
                name="descripcion"
                placeholder="Descripción"
                value={form.descripcion}
                onChange={handleChange}
              />
              <input
                type="number"
                name="precio"
                placeholder="Precio"
                value={form.precio}
                onChange={handleChange}
              />
              <input
                type="text"
                name="duracion"
                placeholder="Duración (minutos)"
                value={form.duracion}
                onChange={handleChange}
              />
              <input
                type="text"
                name="imagen"
                placeholder="URL de la imagen"
                value={form.imagen}
                onChange={handleChange}
              />
              <div className="accionesModal">
                <button type="submit" className="btnGuardar">Guardar</button>
                <button type="button" onClick={cerrarModal}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Servicios;