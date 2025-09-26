async function getComentsUsers() {
    try {
        const peticion = await fetch('http://localhost:3001/comentsUsers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!peticion.ok) {
            throw new Error("Error al obtener las comentario");
        }

        const consultas = await peticion.json();
        return consultas;

    } catch (error) {
        console.error("Hay problemas para obtener", error);
        throw error;
    }
}

async function createComentsUsers(nuevaConsulta) {
    try {
        const peticion = await fetch('http://localhost:3001/comentsUsers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaConsulta)
        });

        if (!peticion.ok) {
            throw new Error("Error al crear la comentario");
        }

        const consultaCreada = await peticion.json();
        return consultaCreada;

    } catch (error) {
        console.error("Error al crear", error);
        throw error;
    }
}

async function updateComentsUsers(id, datosActualizados) {
    try {
        const peticion = await fetch(`http://localhost:3001/comentsUsers/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizados)
        });

        if (!peticion.ok) {
            throw new Error("Error al actualizar la comentario");
        }

        const consultaActualizada = await peticion.json();
        return consultaActualizada;

    } catch (error) {
        console.error("Problema existente", error);
        throw error;
    }
}

async function deleteComentsUsers(id) {
    try {
        const peticion = await fetch(`http://localhost:3001/comentsUsers/${id}`, {
            method: 'DELETE'
        });

        if (!peticion.ok) {
            throw new Error("Error al eliminar la cita");
        }

        return { mensaje: "Comentario eliminada correctamente" };

    } catch (error) {
        console.error("Problema existente", error);
        throw error;
    }
}

export default { getComentsUsers, createComentsUsers, updateComentsUsers, deleteComentsUsers};