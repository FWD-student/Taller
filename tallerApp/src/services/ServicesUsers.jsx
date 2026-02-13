// ANTES: Estas funciones conectaban con json-server en localhost:3001
// AHORA: Usamos localStorage para persistir datos localmente
// La estructura se mantiene igual para no romper los componentes que las usan

// Generador de IDs únicos tipo json-server
const generarId = () => Math.random().toString(36).substr(2, 9);

// ==================== USUARIOS ====================
// Leo usuarios del localStorage, si no existe devuelvo array vacío
const getUsuarios = () => {
    const datos = localStorage.getItem('usuarios');
    return datos ? JSON.parse(datos) : [];
};

// Guardo un nuevo usuario en localStorage con ID único
const createUsuarios = (nuevoUsuario) => {
    const usuarios = getUsuarios();
    const usuarioConId = { ...nuevoUsuario, id: generarId() };
    usuarios.push(usuarioConId);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    return usuarioConId;
};

// Actualizo un usuario existente buscando por su ID
const updateUsuarios = (id, datosActualizados) => {
    const usuarios = getUsuarios();
    const index = usuarios.findIndex(u => u.id === id);
    if (index !== -1) {
        usuarios[index] = { ...usuarios[index], ...datosActualizados };
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        return usuarios[index];
    }
    throw new Error("Usuario no encontrado");
};

// Elimino usuario del localStorage filtrando por ID
const deleteUsuarios = (id) => {
    const usuarios = getUsuarios();
    const nuevosUsuarios = usuarios.filter(u => u.id !== id);
    localStorage.setItem('usuarios', JSON.stringify(nuevosUsuarios));
    return { mensaje: "Usuario eliminado correctamente" };
};

export default { getUsuarios, createUsuarios, updateUsuarios, deleteUsuarios };

/* 
// CÓDIGO ORIGINAL CON JSON-SERVER (comentado):
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
*/
