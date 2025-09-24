async function getUsuarios() {
    try {
        const peticion = await fetch('http://localhost:3001/usuarios', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!peticion.ok) {
            throw new Error("Error al obtener las usuarios");
        }

        const consultas = await peticion.json();
        return consultas;

    } catch (error) {
        console.error("Hay problemas para obtener user", error);
        throw error;
    }
}

async function createUsuarios(nuevaConsulta) {
    try {
        const peticion = await fetch('http://localhost:3001/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaConsulta)
        });

        if (!peticion.ok) {
            throw new Error("Error al agregar usuario");
        }

        const consultaCreada = await peticion.json();
        return consultaCreada;

    } catch (error) {
        console.error("Error al crear", error);
        throw error;
    }
}

async function updateUsuarios(id, datosActualizados) {
    try {
        const peticion = await fetch(`http://localhost:3001/usuarios/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizados)
        });

        if (!peticion.ok) {
            throw new Error("Error al actualizar la usuarios");
        }

        const consultaActualizada = await peticion.json();
        return consultaActualizada;

    } catch (error) {
        console.error("Problema existente", error);
        throw error;
    }
}

async function deleteUsuarios(id) {
    try {
        const peticion = await fetch(`http://localhost:3001/usuarios/${id}`, {
            method: 'DELETE'
        });

        if (!peticion.ok) {
            throw new Error("Error al eliminar");
        }

        return { mensaje: "Consulta eliminada correctamente" };

    } catch (error) {
        console.error("Problema existente", error);
        throw error;
    }
}

export default { getUsuarios, createUsuarios, updateUsuarios, deleteUsuarios};