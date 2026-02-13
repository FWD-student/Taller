// Migración de json-server a localStorage para servicios
const generarId = () => Math.random().toString(36).substr(2, 9);

// Servicios predeterminados del taller
const serviciosDefault = [
    {
        id: "a7c4",
        nombre: "Cambio de aceite",
        descripcion: "El cambio de aceite incluye el reemplazo del mismo y cambio de filtro de aceite para las motos que lo posean",
        precio: "5000",
        duracion: "5",
        imagen: "https://tse2.mm.bing.net/th/id/OIP.u6498QlmtocILDnKN4QvkwHaE8?rs=1&pid=ImgDetMain&o=7&rm=3",
        tipo: "comun"
    },
    {
        id: "7986",
        nombre: "Mantenimiento general",
        descripcion: "El mantenimiento general incluye: calibración de válvulas, inspección de fugas de aceite en el motor, chequear instalaciones eléctricas, revisar el estado de los frenos, lubricación de cadena, cambio de aceite si lo desea + valor de base al agregar cambio del aceite; solo paga el valor del aceite.",
        precio: "15000",
        duracion: "45",
        imagen: "https://www.todomecanica.com/media/k2/items/cache/f485f3bba43b8b317872f4e70f010721_L.jpg",
        tipo: "comun"
    },
    {
        id: "922c",
        nombre: "Mantenimiento General de Terror (Halloween)",
        descripcion: "Trae a un amigo y el segundo mantenimiento general sale a mitad de precio.\nIncluye la calibración de válvulas embrujadas, inspección de fugas de aceite que aparecen como sombras en el motor, chequeo de las instalaciones eléctricas para que no haya sustos inesperados, revisión de frenos para que no chillen como fantasmas, lubricación de cadena con toque macabro y, si lo deseas, el cambio de aceite maldito: solo pagas el valor del aceite.",
        precio: "22500",
        duracion: "50-70",
        imagen: "https://tse3.mm.bing.net/th/id/OIP.v3XuoeK3D9QsgRhLYQvb_AHaE6?rs=1&pid=ImgDetMain&o=7&rm=3",
        tipo: "promocion"
    }
];

// Obtengo servicios del localStorage o cargo los predeterminados
const getServicios = () => {
    const datos = localStorage.getItem('servicios');
    if (!datos) {
        localStorage.setItem('servicios', JSON.stringify(serviciosDefault));
        return serviciosDefault;
    }
    return JSON.parse(datos);
};

// Creo nuevo servicio
const createServicios = (nuevoServicio) => {
    const servicios = getServicios();
    const servicioConId = { ...nuevoServicio, id: generarId() };
    servicios.push(servicioConId);
    localStorage.setItem('servicios', JSON.stringify(servicios));
    return servicioConId;
};

// Actualizo servicio
const updateServicios = (id, datosActualizados) => {
    const servicios = getServicios();
    const index = servicios.findIndex(s => s.id === id);
    if (index !== -1) {
        servicios[index] = { ...servicios[index], ...datosActualizados };
        localStorage.setItem('servicios', JSON.stringify(servicios));
        return servicios[index];
    }
    throw new Error("Servicio no encontrado");
};

// Elimino servicio
const deleteServicios = (id) => {
    const servicios = getServicios();
    const nuevosServicios = servicios.filter(s => s.id !== id);
    localStorage.setItem('servicios', JSON.stringify(nuevosServicios));
    return { mensaje: "Servicio eliminado correctamente" };
};

export default { getServicios, createServicios, updateServicios, deleteServicios };

/*
// CÓDIGO ORIGINAL:
async function getServicios() {...}
async function createServicios(nuevaConsulta) {...}
async function updateServicios(id, datosActualizados) {...}
async function deleteServicios(id) {...}
export default { getServicios, createServicios, updateServicios, deleteServicios};
*/
