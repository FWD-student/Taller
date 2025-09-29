async function getServicios() {
    try {
        const peticion = await fetch('http://localhost:3001/servicios', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!peticion.ok) {
            throw new Error("Error al obtener las servicios");
        }

        const consultas = await peticion.json();
        return consultas;

    } catch (error) {
        console.error("Hay problemas para obtener user", error);
        throw error;
    }
}

async function createServicios(nuevaConsulta) {
    try {
        const peticion = await fetch('http://localhost:3001/servicios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaConsulta)
        });

        if (!peticion.ok) {
            throw new Error("Error al agregar servicio");
        }

        const consultaCreada = await peticion.json();
        return consultaCreada;

    } catch (error) {
        console.error("Error al crear", error);
        throw error;
    }
}

async function updateServicios(id, datosActualizados) {
    try {
        const peticion = await fetch(`http://localhost:3001/servicios/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizados)
        });

        if (!peticion.ok) {
            throw new Error("Error al actualizar la servicio");
        }

        const consultaActualizada = await peticion.json();
        return consultaActualizada;

    } catch (error) {
        console.error("Problema existente", error);
        throw error;
    }
}

async function deleteServicios(id) {
    try {
        const peticion = await fetch(`http://localhost:3001/servicios/${id}`, {
            method: 'DELETE'
        });

        if (!peticion.ok) {
            throw new Error("Error al eliminar");
        }

        return { mensaje: "Servicio eliminado correctamente" };

    } catch (error) {
        console.error("Problema existente", error);
        throw error;
    }
}

export default { getServicios, createServicios, updateServicios, deleteServicios};