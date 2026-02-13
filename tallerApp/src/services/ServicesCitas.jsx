// ANTES: Conexión con json-server en localhost:3001
// AHORA: Persistencia con localStorage para que funcione en Vercel

const generarId = () => Math.random().toString(36).substr(2, 9);

// ==================== CITAS ====================
// Obtengo todas las citas almacenadas
const getCitas = () => {
    const datos = localStorage.getItem('citas');
    return datos ? JSON.parse(datos) : [];
};

// Creo nueva cita con ID único y fecha de creación
const createCitas = (nuevaCita) => {
    const citas = getCitas();
    const citaConDatos = { 
        ...nuevaCita, 
        id: generarId(),
        fechaCreacion: new Date().toISOString(),
        estado: nuevaCita.estado || 'pendiente'
    };
    citas.push(citaConDatos);
    localStorage.setItem('citas', JSON.stringify(citas));
    return citaConDatos;
};

// Actualizo cita existente por ID
const updateCitas = (id, datosActualizados) => {
    const citas = getCitas();
    const index = citas.findIndex(c => c.id === id);
    if (index !== -1) {
        citas[index] = { ...citas[index], ...datosActualizados };
        localStorage.setItem('citas', JSON.stringify(citas));
        return citas[index];
    }
    throw new Error("Cita no encontrada");
};

// Elimino cita del registro
const deleteCitas = (id) => {
    const citas = getCitas();
    const nuevasCitas = citas.filter(c => c.id !== id);
    localStorage.setItem('citas', JSON.stringify(nuevasCitas));
    return { mensaje: "Cita eliminada correctamente" };
};

export default { getCitas, createCitas, updateCitas, deleteCitas };

/*
// CÓDIGO ORIGINAL CON JSON-SERVER:
async function getCitas() {
    try {
        const peticion = await fetch('http://localhost:3001/citas', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!peticion.ok) {
            throw new Error("Error al obtener las citas");
        }

        const consultas = await peticion.json();
        return consultas;

    } catch (error) {
        console.error("Hay problemas para obtener", error);
        throw error;
    }
}

async function createCitas(nuevaConsulta) {
    try {
        const peticion = await fetch('http://localhost:3001/citas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaConsulta)
        });

        if (!peticion.ok) {
            throw new Error("Error al crear la cita");
        }

        const consultaCreada = await peticion.json();
        return consultaCreada;

    } catch (error) {
        console.error("Error al crear", error);
        throw error;
    }
}

async function updateCitas(id, datosActualizados) {
    try {
        const peticion = await fetch(`http://localhost:3001/citas/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizados)
        });

        if (!peticion.ok) {
            throw new Error("Error al actualizar la citas");
        }

        const consultaActualizada = await peticion.json();
        return consultaActualizada;

    } catch (error) {
        console.error("Problema existente", error);
        throw error;
    }
}

async function deleteCitas(id) {
    try {
        const peticion = await fetch(`http://localhost:3001/citas/${id}`, {
            method: 'DELETE'
        });

        if (!peticion.ok) {
            throw new Error("Error al eliminar la cita");
        }

        return { mensaje: "Cita eliminada correctamente" };

    } catch (error) {
        console.error("Problema existente", error);
        throw error;
    }
}

export default { getCitas, createCitas, updateCitas, deleteCitas};
*/
