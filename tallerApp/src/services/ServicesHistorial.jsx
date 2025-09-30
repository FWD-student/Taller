// Citas Historial
async function getCitasHistorial() {
    try {
        const peticion = await fetch('http://localhost:3001/citasHistorial', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!peticion.ok) {
            throw new Error("Error al obtener el historial de citas");
        }

        const historial = await peticion.json();
        return historial;

    } catch (error) {
        console.error("Error al obtener historial de citas", error);
        throw error;
    }
}

async function createCitaHistorial(cita, accion) {
    try {
        const registro = {
            ...cita,
            accion,
            fechaHistorial: new Date().toISOString()
        };

        const peticion = await fetch('http://localhost:3001/citasHistorial', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registro)
        });

        if (!peticion.ok) {
            throw new Error("Error al crear historial de cita");
        }

        const historialCreado = await peticion.json();
        return historialCreado;

    } catch (error) {
        console.error("Error al crear historial de cita", error);
        throw error;
    }
}

// Usuarios Historial
async function getUsuariosHistorial() {
    try {
        const peticion = await fetch('http://localhost:3001/usuariosHistorial', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!peticion.ok) {
            throw new Error("Error al obtener el historial de usuarios");
        }

        const historial = await peticion.json();
        return historial;

    } catch (error) {
        console.error("Error al obtener historial de usuarios", error);
        throw error;
    }
}

async function createUsuarioHistorial(usuario, accion) {
    try {
        const { password, ...usuarioSinPassword } = usuario;
        const registro = {
            ...usuarioSinPassword,
            accion,
            fechaHistorial: new Date().toISOString()
        };

        const peticion = await fetch('http://localhost:3001/usuariosHistorial', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registro)
        });

        if (!peticion.ok) {
            throw new Error("Error al crear historial de usuario");
        }

        const historialCreado = await peticion.json();
        return historialCreado;

    } catch (error) {
        console.error("Error al crear historial de usuario", error);
        throw error;
    }
}

// Servicios Historial
async function getServiciosHistorial() {
    try {
        const peticion = await fetch('http://localhost:3001/serviciosHistorial', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!peticion.ok) {
            throw new Error("Error al obtener el historial de servicios");
        }

        const historial = await peticion.json();
        return historial;

    } catch (error) {
        console.error("Error al obtener historial de servicios", error);
        throw error;
    }
}

async function createServicioHistorial(servicio, accion) {
    try {
        const registro = {
            ...servicio,
            accion,
            fechaHistorial: new Date().toISOString()
        };

        const peticion = await fetch('http://localhost:3001/serviciosHistorial', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registro)
        });

        if (!peticion.ok) {
            throw new Error("Error al crear historial de servicio");
        }

        const historialCreado = await peticion.json();
        return historialCreado;

    } catch (error) {
        console.error("Error al crear historial de servicio", error);
        throw error;
    }
}

// Comentarios Historial
async function getComentariosHistorial() {
    try {
        const peticion = await fetch('http://localhost:3001/comentariosHistorial', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!peticion.ok) {
            throw new Error("Error al obtener el historial de comentarios");
        }

        const historial = await peticion.json();
        return historial;

    } catch (error) {
        console.error("Error al obtener historial de comentarios", error);
        throw error;
    }
}

async function createComentarioHistorial(comentario, accion) {
    try {
        const registro = {
            ...comentario,
            accion,
            fechaHistorial: new Date().toISOString()
        };

        const peticion = await fetch('http://localhost:3001/comentariosHistorial', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registro)
        });

        if (!peticion.ok) {
            throw new Error("Error al crear historial de comentario");
        }

        const historialCreado = await peticion.json();
        return historialCreado;

    } catch (error) {
        console.error("Error al crear historial de comentario", error);
        throw error;
    }
}

export default {
    getCitasHistorial,
    createCitaHistorial,
    getUsuariosHistorial,
    createUsuarioHistorial,
    getServiciosHistorial,
    createServicioHistorial,
    getComentariosHistorial,
    createComentarioHistorial
};