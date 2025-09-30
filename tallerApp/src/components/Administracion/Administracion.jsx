import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ServiceCitas from "../../services/ServicesCitas";
import ServiceComentsUsers from "../../services/ServicesComents";
import ServicesUsers from "../../services/ServicesUsers";
import ServicesHistorial from "../../services/ServicesHistorial";
import EmailService from "../../services/EmailService";
import Swal from "sweetalert2";
import ServicioAdmin from "../ServicioAdmin/ServicioAdmin";
import "./Administracion.css";

function PanelAdmin() {
  const [citas, setCitas] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [vistaActual, setVistaActual] = useState("citas");
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [modalUsuario, setModalUsuario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [formUsuario, setFormUsuario] = useState({
    cedula: "", nombre: "", telefono: "", email: "", password: ""
  });
  const [modalHistorial, setModalHistorial] = useState(false);
  const [tipoHistorial, setTipoHistorial] = useState("");
  const [datosHistorial, setDatosHistorial] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(sessionStorage.getItem("usuario") || "{}");
    if (!usuario.esAdmin) {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "No tienes permisos de administrador",
        confirmButtonColor: "#e74c3c",
      }).then(() => {
        navigate("/");
      });
      return;
    }

    cargarDatos();
  }, [navigate]);

  const cargarDatos = async () => {
    try {
      const [citasData, comentariosData, usuariosData] = await Promise.all([
        ServiceCitas.getCitas(),
        ServiceComentsUsers.getComentsUsers(),
        ServicesUsers.getUsuarios(),
      ]);
      setCitas(citasData);
      setComentarios(comentariosData);
      setUsuarios(usuariosData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      mostrarAlerta("error", "Error", "No se pudieron cargar los datos");
    }
  };

  const cambiarEstadoCita = async (id, nuevoEstado) => {
    try {
      const citaActualizada = await ServiceCitas.updateCitas(id, { estado: nuevoEstado });
      await ServicesHistorial.createCitaHistorial(citaActualizada, "modificado");

      // Enviar email de cambio de estado
      await EmailService.emailCambioEstadoCita(citaActualizada, nuevoEstado);

      setCitas((prevCitas) =>
        prevCitas.map((cita) =>
          cita.id === id ? { ...cita, estado: nuevoEstado } : cita
        )
      );
      mostrarAlerta(
        "success",
        "Estado actualizado",
        `La cita ha sido marcada como ${nuevoEstado}`
      );
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      mostrarAlerta("error", "Error", "No se pudo actualizar el estado");
    }
  };

  const eliminarCita = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Eliminar cita?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#95a5a6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) {
      try {
        const citaAEliminar = citas.find(c => c.id === id);
        await ServiceCitas.deleteCitas(id);
        await ServicesHistorial.createCitaHistorial(citaAEliminar, "eliminado");

        setCitas((prevCitas) => prevCitas.filter((cita) => cita.id !== id));
        mostrarAlerta(
          "success",
          "Eliminada",
          "La cita ha sido eliminada correctamente"
        );
      } catch (error) {
        mostrarAlerta("error", "Error", "No se pudo eliminar la cita");
      }
    }
  };

  const eliminarComentario = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Eliminar comentario?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#95a5a6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) {
      try {
        const comentarioAEliminar = comentarios.find(c => c.id === id);
        await ServiceComentsUsers.deleteComentsUsers(id);
        await ServicesHistorial.createComentarioHistorial(comentarioAEliminar, "eliminado");

        setComentarios((prevComentarios) =>
          prevComentarios.filter((com) => com.id !== id)
        );
        mostrarAlerta(
          "success",
          "Eliminado",
          "El comentario ha sido eliminado correctamente"
        );
      } catch (error) {
        mostrarAlerta("error", "Error", "No se pudo eliminar el comentario");
      }
    }
  };

  const mostrarAlerta = (icon, title, text) => {
    Swal.fire({ icon, title, text, confirmButtonColor: "#e74c3c" });
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const cerrarSesion = () => {
    sessionStorage.removeItem("usuario");
    navigate("/home");
  };

  const abrirModalHistorial = async (tipo) => {
    try {
      let historial = [];
      switch(tipo) {
        case "citas":
          historial = await ServicesHistorial.getCitasHistorial();
          break;
        case "usuarios":
          historial = await ServicesHistorial.getUsuariosHistorial();
          break;
        case "servicios":
          historial = await ServicesHistorial.getServiciosHistorial();
          break;
        case "comentarios":
          historial = await ServicesHistorial.getComentariosHistorial();
          break;
        default:
          break;
      }
      setDatosHistorial(historial);
      setTipoHistorial(tipo);
      setModalHistorial(true);
    } catch (error) {
      console.error("Error al cargar historial:", error);
      mostrarAlerta("error", "Error", "No se pudo cargar el historial");
    }
  };

  const cerrarModalHistorial = () => {
    setModalHistorial(false);
    setTipoHistorial("");
    setDatosHistorial([]);
  };

  const abrirModalUsuario = (usuario = null) => {
    setUsuarioEditando(usuario);
    setFormUsuario(usuario || { cedula: "", nombre: "", telefono: "", email: "", password: "" });
    setModalUsuario(true);
  };

  const cerrarModalUsuario = () => {
    setModalUsuario(false);
    setUsuarioEditando(null);
    setFormUsuario({ cedula: "", nombre: "", telefono: "", email: "", password: "" });
  };

  const handleChangeUsuario = (e) => {
    const { name, value } = e.target;
    setFormUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();
    if (!formUsuario.cedula || !formUsuario.nombre || !formUsuario.email || !formUsuario.password) {
      return mostrarAlerta("warning", "Campos incompletos", "Completa todos los campos obligatorios");
    }

    try {
      if (usuarioEditando) {
        const usuarioActualizado = await ServicesUsers.updateUsuarios(usuarioEditando.id, formUsuario);
        await ServicesHistorial.createUsuarioHistorial(usuarioActualizado, "modificado");

        setUsuarios((prev) =>
          prev.map((u) => (u.id === usuarioEditando.id ? { ...u, ...formUsuario } : u))
        );
        mostrarAlerta("success", "Actualizado", "Usuario actualizado correctamente");
      } else {
        const nuevo = await ServicesUsers.createUsuarios(formUsuario);
        await ServicesHistorial.createUsuarioHistorial(nuevo, "creado");

        setUsuarios((prev) => [...prev, nuevo]);
        mostrarAlerta("success", "Creado", "Usuario agregado correctamente");
      }
      cerrarModalUsuario();
    } catch {
      mostrarAlerta("error", "Error", "No se pudo guardar el usuario");
    }
  };

  const eliminarUsuario = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#95a5a6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) {
      try {
        const usuarioAEliminar = usuarios.find(u => u.id === id);
        await ServicesUsers.deleteUsuarios(id);
        await ServicesHistorial.createUsuarioHistorial(usuarioAEliminar, "eliminado");

        setUsuarios((prev) => prev.filter((u) => u.id !== id));
        mostrarAlerta("success", "Eliminado", "Usuario eliminado correctamente");
      } catch {
        mostrarAlerta("error", "Error", "No se pudo eliminar el usuario");
      }
    }
  };

  const citasFiltradas =
    filtroEstado === "todas"
      ? citas
      : citas.filter((cita) => cita.estado === filtroEstado);

  const estadisticas = {
    totalCitas: citas.length,
    pendientes: citas.filter((c) => c.estado === "pendiente").length,
    completadas: citas.filter(
      (c) => c.estado === "completada" || c.estado === "finalizada"
    ).length,
    comentarios: comentarios.length,
    usuarios: usuarios.length,
  };

  return (
    <div className="panelAdmin">
      <header className="headerAdmin">
        <h1>Panel de Administración</h1>
        <div className="accionesHeader">
          <button onClick={() => navigate("/home")} className="btnSecundario">
            Ver Sitio
          </button>
          <button onClick={cerrarSesion} className="btnCerrarSesion">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <nav className="navAdmin">
        <button
          className={vistaActual === "citas" ? "activo" : ""}
          onClick={() => setVistaActual("citas")}
        >
          Gestión de Citas ({estadisticas.totalCitas})
        </button>
        <button
          className={vistaActual === "comentarios" ? "activo" : ""}
          onClick={() => setVistaActual("comentarios")}
        >
          Comentarios ({estadisticas.comentarios})
        </button>
        <button
          className={vistaActual === "usuarios" ? "activo" : ""}
          onClick={() => setVistaActual("usuarios")}
        >
          Usuarios ({estadisticas.usuarios})
        </button>
        <button
          className={vistaActual === "servicios" ? "activo" : ""}
          onClick={() => setVistaActual("servicios")}
        >
          Servicios
        </button>
        <button
          className={vistaActual === "historial" ? "activo" : ""}
          onClick={() => setVistaActual("historial")}
        >
          Historial
        </button>
      </nav>

      {vistaActual === "citas" && (
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
            {citasFiltradas.map((cita) => (
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

      {vistaActual === "comentarios" && (
        <div className="seccionComentarios">
          <h2>Comentarios de Usuarios</h2>
          <div className="listaComentarios">
            {comentarios.map((comentario) => (
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

      {vistaActual === "usuarios" && (
        <div className="seccionUsuarios">
          <div className="headerSeccion">
            <h2>Gestión de Usuarios</h2>
            <button onClick={() => abrirModalUsuario()} className="btnAgregar">
              + Nuevo Usuario
            </button>
          </div>

          <div className="listaUsuarios">
            {usuarios.map((usuario) => (
              <div key={usuario.id} className="tarjetaUsuario">
                <div className="infoUsuario">
                  <h4>{usuario.nombre}</h4>
                  <p><strong>Cédula:</strong> {usuario.cedula}</p>
                  <p><strong>Email:</strong> {usuario.email}</p>
                  <p><strong>Teléfono:</strong> {usuario.telefono}</p>
                </div>
                <div className="accionesUsuario">
                  <button onClick={() => abrirModalUsuario(usuario)} className="btnEditar">
                    Editar
                  </button>
                  <button onClick={() => eliminarUsuario(usuario.id)} className="btnEliminar">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {modalUsuario && (
            <div className="modalServicio">
              <div className="modalContenido">
                <h3>{usuarioEditando ? "Editar Usuario" : "Nuevo Usuario"}</h3>
                <form onSubmit={guardarUsuario}>
                  <label htmlFor="cedula">Cédula</label>
                  <input
                    type="text"
                    name="cedula"
                    placeholder="Cédula"
                    value={formUsuario.cedula}
                    onChange={handleChangeUsuario}
                    maxLength="10"
                    required
                  />
                  <label htmlFor="Nombre completo">Nombre completo</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre completo"
                    value={formUsuario.nombre}
                    onChange={handleChangeUsuario}
                    required
                  />
                  <label htmlFor="Teléfono">Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    placeholder="Teléfono"
                    value={formUsuario.telefono}
                    onChange={handleChangeUsuario}
                    maxLength="10"
                    required
                  />
                  <label htmlFor="Email">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formUsuario.email}
                    onChange={handleChangeUsuario}
                    required
                  />
                  <label htmlFor="Contraseña">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={formUsuario.password}
                    onChange={handleChangeUsuario}
                    required
                  />
                  <div className="accionesModal">
                    <button type="submit" className="btnGuardar">Guardar</button>
                    <button type="button" onClick={cerrarModalUsuario}>Cancelar</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {vistaActual === "servicios" && (
        <div className="seccionServicios">
          <ServicioAdmin />
        </div>
      )}

      {vistaActual === "historial" && (
        <div className="seccionHistorial">
          <h2>Historial de Cambios</h2>
          <p className="descripcionHistorial">
            Consulta el historial completo de todas las operaciones realizadas en el sistema
          </p>

          <div className="botonesHistorial">
            <button
              className="btnHistorial btnCitas"
              onClick={() => abrirModalHistorial("citas")}
            >
              Historial de Citas
            </button>
            <button
              className="btnHistorial btnUsuarios"
              onClick={() => abrirModalHistorial("usuarios")}
            >
              Historial de Usuarios
            </button>
            <button
              className="btnHistorial btnServicios"
              onClick={() => abrirModalHistorial("servicios")}
            >
              Historial de Servicios
            </button>
            <button
              className="btnHistorial btnComentarios"
              onClick={() => abrirModalHistorial("comentarios")}
            >
              Historial de Comentarios
            </button>
          </div>
        </div>
      )}

      {modalHistorial && (
        <div className="modalHistorial">
          <div className="modalContenido modalHistorialContenido">
            <div className="headerModal">
              <h3>Historial de {tipoHistorial.charAt(0).toUpperCase() + tipoHistorial.slice(1)}</h3>
              <button className="btnCerrarModal" onClick={cerrarModalHistorial}>X</button>
            </div>

            <div className="listaHistorial">
              {datosHistorial.length === 0 ? (
                <p className="sinDatos">No hay registros en el historial</p>
              ) : (
                datosHistorial.map((registro) => (
                  <div key={registro.id} className={`registroHistorial ${registro.accion}`}>
                    <div className="accionBadge">{registro.accion}</div>
                    <div className="infoRegistro">
                      {tipoHistorial === "citas" && (
                        <>
                          <p><strong>Cliente:</strong> {registro.nombre}</p>
                          <p><strong>Email:</strong> {registro.email}</p>
                          <p><strong>Servicio:</strong> {registro.servicio}</p>
                          <p><strong>Estado:</strong> {registro.estado}</p>
                          {registro.fecha && <p><strong>Fecha cita:</strong> {formatearFecha(registro.fecha)}</p>}
                        </>
                      )}
                      {tipoHistorial === "usuarios" && (
                        <>
                          <p><strong>Nombre:</strong> {registro.nombre}</p>
                          <p><strong>Email:</strong> {registro.email}</p>
                          <p><strong>Cedula:</strong> {registro.cedula}</p>
                          <p><strong>Telefono:</strong> {registro.telefono}</p>
                        </>
                      )}
                      {tipoHistorial === "servicios" && (
                        <>
                          <p><strong>Servicio:</strong> {registro.nombre}</p>
                          <p><strong>Descripcion:</strong> {registro.descripcion}</p>
                          <p><strong>Precio:</strong> {registro.precio}</p>
                          <p><strong>Duracion:</strong> {registro.duracion} min</p>
                          <p><strong>Tipo:</strong> {registro.tipo}</p>
                        </>
                      )}
                      {tipoHistorial === "comentarios" && (
                        <>
                          <p><strong>Usuario:</strong> {registro.nombreUsuario}</p>
                          <p><strong>Comentario:</strong> {registro.comentario}</p>
                          <p><strong>Rating:</strong> {registro.rating}</p>
                          <p><strong>Servicio:</strong> {registro.servicioNombre}</p>
                        </>
                      )}
                      <small className="fechaHistorial">
                        Registrado: {formatearFecha(registro.fechaHistorial)}
                      </small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PanelAdmin;