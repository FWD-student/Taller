// Comentarios de usuarios migrados a localStorage
const generarId = () => Math.random().toString(36).substr(2, 9);

const getComentsUsers = () => {
    const datos = localStorage.getItem('comentsUsers');
    return datos ? JSON.parse(datos) : [];
};

const createComentsUsers = (nuevoComentario) => {
    const comentarios = getComentsUsers();
    const comentarioConId = { 
        ...nuevoComentario, 
        id: generarId(),
        fechaComentario: new Date().toISOString()
    };
    comentarios.push(comentarioConId);
    localStorage.setItem('comentsUsers', JSON.stringify(comentarios));
    return comentarioConId;
};

const updateComentsUsers = (id, datosActualizados) => {
    const comentarios = getComentsUsers();
    const index = comentarios.findIndex(c => c.id === id);
    if (index !== -1) {
        comentarios[index] = { ...comentarios[index], ...datosActualizados };
        localStorage.setItem('comentsUsers', JSON.stringify(comentarios));
        return comentarios[index];
    }
    throw new Error("Comentario no encontrado");
};

const deleteComentsUsers = (id) => {
    const comentarios = getComentsUsers();
    const nuevosComentarios = comentarios.filter(c => c.id !== id);
    localStorage.setItem('comentsUsers', JSON.stringify(nuevosComentarios));
    return { mensaje: "Comentario eliminado correctamente" };
};

export default { getComentsUsers, createComentsUsers, updateComentsUsers, deleteComentsUsers };

/*
// CÓDIGO ORIGINAL:
async function getComentsUsers() {...}
async function createComentsUsers(nuevaConsulta) {...}
async function updateComentsUsers(id, datosActualizados) {...}
async function deleteComentsUsers(id) {...}
export default { getComentsUsers, createComentsUsers, updateComentsUsers, deleteComentsUsers};
*/
