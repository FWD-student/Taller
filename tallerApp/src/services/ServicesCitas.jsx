//(GET)
async function getLista() {
    try {
        const peticion = await fetch('http://localhost:3001/tareas', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!peticion.ok) {
            throw new Error("Error al obtener las Tareas");
        }

        const consultas = await peticion.json();
        return consultas;

    } catch (error) {
        console.error("Hay problemas para obtener", error);
        throw error;
    }
}

//(POST)
async function createLista(nuevaConsulta) {
    try {
        const peticion = await fetch('http://localhost:3001/tareas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaConsulta)
        });

        if (!peticion.ok) {
            throw new Error("Error al crear la Tarea");
        }

        const consultaCreada = await peticion.json();
        return consultaCreada;

    } catch (error) {
        console.error("Error al crear", error);
        throw error;
    }
}

//(PUT || PATCH)
async function updateLista(id, datosActualizados) {
    try {
        const peticion = await fetch(`http://localhost:3001/tareas/${id}`, {
            method: 'PATCH', // usar PATCH si solo se quiere modificar un atributo
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizados)
        });

        if (!peticion.ok) {
            throw new Error("Error al actualizar la lista");
        }

        const consultaActualizada = await peticion.json();
        return consultaActualizada;

    } catch (error) {
        console.error("Problema existente", error);
        throw error;
    }
}

//(DELETE)
async function deleteLista(id) {
    try {
        const peticion = await fetch(`http://localhost:3001/tareas/${id}`, {
            method: 'DELETE'
        });

        if (!peticion.ok) {
            throw new Error("Error al eliminar la tarea");
        }

        return { mensaje: "Consulta eliminada correctamente" };

    } catch (error) {
        console.error("Problema existente", error);
        throw error;
    }
}

export default { getLista, createLista, updateLista, deleteLista};