# Taller JPL - Sistema de Gestión

Sistema web para la gestión de citas y servicios de un taller de motocicletas, desarrollado con React y Vite.

## Estructura del Proyecto

```
tallerApp/
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── pages/          # Páginas principales
│   ├── services/       # Servicios de API
│   ├── routes/         # Configuración de rutas
│   └── utils/          # Utilidades (generación de PDF, etc.)
├── db.json             # Base de datos simulada (json-server)
└── package.json
```

## Tecnologías Utilizadas

- **Frontend**: React 19 + Vite 7
- **UI**: Bootstrap 5 + React Bootstrap
- **Routing**: React Router DOM 7
- **Alertas**: SweetAlert2
- **PDF**: jsPDF + html2canvas
- **QR**: qrcode
- **Backend**: json-server (desarrollo)

## Funcionalidades Principales

### Para Usuarios
- Registro con verificación de email
- Sistema de autenticación
- Agendar citas para servicios
- Consultar historial de servicios
- Descargar tickets con código QR
- Dejar comentarios sobre servicios recibidos

### Para Administradores
- Panel de administración completo
- Gestión de citas (ver, modificar estado, eliminar)
- Gestión de usuarios (CRUD completo)
- Gestión de servicios ofrecidos
- Moderación de comentarios
- Historial detallado de operaciones

## Instalación y Configuración

### Requisitos Previos
- Node.js (versión 16 o superior)
- npm o yarn

### Instalación
```bash
npm install
```

### Variables de Entorno
Crear archivo `.env` en la raíz con:
```
VITE_BREVO_API_KEY=tu_api_key
VITE_EMAIL_REMITENTE=tu_email@dominio.com
```

### Ejecución en Desarrollo
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend (json-server)
npx json-server --watch db.json --port 3000
```

### Compilación para Producción
```bash
npm run build
```

## Aspectos Importantes para Otros Proyectos

### Arquitectura Modular
El proyecto sigue una estructura organizada por responsabilidades:
- **Separación de componentes**: Cada componente tiene su responsabilidad específica
- **Servicios centralizados**: Todas las llamadas API están en `/services`
- **Rutas protegidas**: Sistema de guards para proteger rutas según roles

### Sistema de Roles
Implementa tres tipos de rutas protegidas:
- `PrivateRoute`: Requiere autenticación
- `AdminRoute`: Requiere rol de administrador
- `UserRoute`: Requiere rol de usuario estándar

### Flujo de Autenticación
1. Usuario ingresa credenciales
2. Sistema valida contra base de datos
3. Sesión se almacena en sessionStorage
4. Rutas protegen acceso según rol

### Sistema de Notificaciones
- Emails transaccionales usando Brevo API
- Confirmaciones de citas
- Códigos de verificación
- Actualizaciones de estado

### Generación de Documentos
- Tickets en PDF con información de cita
- Códigos QR para verificación rápida
- Exportación usando html2canvas y jsPDF

## Patrones de Diseño Aplicados

### Hooks Personalizados
El proyecto utiliza hooks de React para:
- Gestión de estado local con `useState`
- Efectos secundarios con `useEffect`
- Navegación con `useNavigate`

### Servicios Reutilizables
Cada entidad tiene su servicio (`ServicesUsers`, `ServiceCitas`, etc.) con operaciones CRUD estándar.

### Componentes Controlados
Todos los formularios usan componentes controlados con validación en tiempo real.

## Consideraciones para Escalar

1. **Backend Real**: Migrar de json-server a un backend robusto (Node.js/Express, Django, etc.)
2. **Base de Datos**: Implementar PostgreSQL o MongoDB según necesidades
3. **Autenticación**: Migrar a JWT con refresh tokens
4. **Estado Global**: Considerar Context API o Redux para estado complejo
5. **Testing**: Agregar pruebas unitarias (Jest) e integración (Cypress)
6. **CI/CD**: Configurar pipelines de despliegue automático
7. **Monitoreo**: Implementar logging y monitoreo de errores

## Buenas Prácticas Aplicadas

- Validación de formularios en cliente
- Confirmaciones antes de acciones destructivas
- Feedback visual al usuario (loading, success, error)
- Código modular y reutilizable
- Nombres descriptivos de variables y funciones
- Comentarios en lógica compleja
- Manejo de errores con try-catch

## Contribuir

Para contribuir al proyecto:
1. Mantener la estructura de carpetas existente
2. Seguir convenciones de nombres establecidas
3. Documentar funciones complejas
4. Validar inputs del usuario
5. Manejar errores apropiadamente

## Licencia

ISC