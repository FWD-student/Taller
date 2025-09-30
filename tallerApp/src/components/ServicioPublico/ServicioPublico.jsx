import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ServiciosService from "../../services/ServiciosServices";
import "./servicioPublico.css";

function ServicioPublico() {
  const [servicios, setServicios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = async () => {
    try {
      const data = await ServiciosService.getServicios();
      setServicios(data);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los servicios",
        confirmButtonColor: "#e74c3c"
      });
    }
  };

  const handleAgendarCita = (servicio) => {
    const usuario = JSON.parse(sessionStorage.getItem("usuario") || "null");

    if (!usuario) {
      Swal.fire({
        icon: "info",
        title: "Iniciar sesión requerido",
        text: "Debes iniciar sesión o registrarte para agendar una cita",
        confirmButtonColor: "#e74c3c",
        showCancelButton: true,
        confirmButtonText: "Ir a Login",
        cancelButtonText: "Cerrar"
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    } else {
      // Usuario registrado, navegar a home para agendar cita
      const nombreServicio = servicio?.nombre || 'el servicio seleccionado';

      Swal.fire({
        icon: "success",
        title: "Redirigiendo...",
        text: `Te llevaremos al formulario de citas para agendar: ${nombreServicio}`,
        confirmButtonColor: "#e74c3c",
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        navigate("/home", { state: { servicioSeleccionado: nombreServicio } });
        // Hacer scroll al formulario después de un pequeño delay
        setTimeout(() => {
          const formElement = document.querySelector('.form');
          if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      });
    }
  };

  const usuario = JSON.parse(sessionStorage.getItem("usuario") || "null");

  return (
    <div className="contenedorServ">
      <header className="headerServicios">
        <h2>Nuestros Servicios</h2>
        <p>Ofrecemos servicios de calidad para tu motocicleta</p>
        {!usuario && (
          <p className="mensajeRegistro" onClick={() => navigate("/login")} style={{ cursor: 'pointer' }}>
            ¡Regístrate para aprovechar nuestras promociones especiales!
          </p>
        )}
      </header>

      <div className="listaServicios">
        {servicios.map((serv) => (
          <div key={serv.id} className={`cardServicio ${serv.tipo === "promocion" ? "promocion" : ""}`}>
            {serv.imagen && <img src={serv.imagen} alt={serv.nombre} />}
            {serv.tipo === "promocion" && (
              <div className="badgePromocion">
                ⭐ Promoción Especial
              </div>
            )}
            <div className="contenidoTarjeta">
              <h3>{serv.nombre}</h3>
              <p className="descripcion">{serv.descripcion}</p>
              <div className="detallesServicio">
                <p className="precio">
                  <strong>Precio:</strong> ₡{serv.precio}
                </p>
                <p className="duracion">
                  <strong>Duración:</strong> {serv.duracion} min
                </p>
              </div>
              {usuario ? (
                <button
                  className="btnAgendar"
                  onClick={() => handleAgendarCita(serv)}
                >
                  Agendar Cita
                </button>
              ) : (
                <button
                  className="btnRegistrar"
                  onClick={() => navigate("/login")}
                >
                  Regístrate para Agendar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServicioPublico;