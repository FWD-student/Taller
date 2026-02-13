// Historial de operaciones guardado en localStorage
const generarId = () => Math.random().toString(36).substr(2, 9);

// Función auxiliar para obtener cualquier tipo de historial
const getHistorial = (tipo) => {
    const datos = localStorage.getItem(`${tipo}Historial`);
    return datos ? JSON.parse(datos) : [];
};

// Función auxiliar para guardar en historial
const guardarEnHistorial = (tipo, registro) => {
    const historial = getHistorial(tipo);
    historial.push({ ...registro, id: generarId() });
    localStorage.setItem(`${tipo}Historial`, JSON.stringify(historial));
    return registro;
};

// ==================== CITAS ====================
const getCitasHistorial = () => getHistorial('citas');

const createCitaHistorial = (cita, accion) => {
    const registro = {
        ...cita,
        accion,
        fechaHistorial: new Date().toISOString()
    };
    return guardarEnHistorial('citas', registro);
};

// ==================== USUARIOS ====================
const getUsuariosHistorial = () => getHistorial('usuarios');

const createUsuarioHistorial = (usuario, accion) => {
    const { password, ...usuarioSinPassword } = usuario;
    const registro = {
        ...usuarioSinPassword,
        accion,
        fechaHistorial: new Date().toISOString()
    };
    return guardarEnHistorial('usuarios', registro);
};

// ==================== SERVICIOS ====================
const getServiciosHistorial = () => getHistorial('servicios');

const createServicioHistorial = (servicio, accion) => {
    const registro = {
        ...servicio,
        accion,
        fechaHistorial: new Date().toISOString()
    };
    return guardarEnHistorial('servicios', registro);
};

// ==================== COMENTARIOS ====================
const getComentariosHistorial = () => getHistorial('comentarios');

const createComentarioHistorial = (comentario, accion) => {
    const registro = {
        ...comentario,
        accion,
        fechaHistorial: new Date().toISOString()
    };
    return guardarEnHistorial('comentarios', registro);
};

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

/*
// CÓDIGO ORIGINAL CON JSON-SERVER (comentado):
async function getCitasHistorial() {...}
async function createCitaHistorial(cita, accion) {...}
async function getUsuariosHistorial() {...}
async function createUsuarioHistorial(usuario, accion) {...}
async function getServiciosHistorial() {...}
async function createServicioHistorial(servicio, accion) {...}
async function getComentariosHistorial() {...}
async function createComentarioHistorial(comentario, accion) {...}
export default {...};
*/
