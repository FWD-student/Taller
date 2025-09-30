# Guía Completa: Rutas Privadas en React

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [¿Cuándo usar rutas privadas?](#cuándo-usar-rutas-privadas)
3. [Estructura básica](#estructura-básica)
4. [Variantes de implementación](#variantes-de-implementación)
5. [Ejemplos prácticos](#ejemplos-prácticos)
6. [Mejores prácticas](#mejores-prácticas)
7. [Troubleshooting](#troubleshooting)

## Introducción

Las rutas privadas son un mecanismo de protección que permite restringir el acceso a ciertas páginas de tu aplicación React basándose en el estado de autenticación del usuario. Si un usuario no autenticado intenta acceder a una ruta protegida, será redirigido automáticamente a una página de login.

## ¿Cuándo usar rutas privadas?

**Usa rutas privadas cuando necesites proteger:**
- Páginas de perfil de usuario
- Dashboards administrativos
- Configuraciones de cuenta
- Contenido exclusivo para usuarios registrados
- Páginas con información sensible

**No necesitas rutas privadas para:**
- Páginas informativas (Home, Acerca de, Contacto)
- Páginas de marketing
- Landing pages
- Página de login/registro

## Estructura básica

### Componente de verificación de autenticación

El componente base que verifica si un usuario está autenticado:

```javascript
import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  const isAuthenticated = () => {
    // Verificar el estado de autenticación
    const token = localStorage.getItem('token')
    const usuario = sessionStorage.getItem('usuario')
    return token !== null || usuario !== null
  }

  return isAuthenticated() ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
```

### Uso en el routing

```javascript
import PrivateRoute from './components/PrivateRoute'
import Dashboard from './pages/Dashboard'

// En tu componente de rutas
<Route path='/dashboard' element={
  <PrivateRoute>
    <Dashboard />
  </PrivateRoute>
} />
```

## Variantes de implementación

### Variante 1: Componente reutilizable (Recomendado)

**Archivo: `/src/components/PrivateRoute.jsx`**

```javascript
import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  const isAuthenticated = () => {
    const usuario = sessionStorage.getItem('usuario')
    return usuario !== null
  }

  return isAuthenticated() ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
```

**Uso en Routing.jsx:**

```javascript
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'
import PrivateRoute from '../components/PrivateRoute'

function Routing() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        
        {/* Rutas privadas */}
        <Route path='/dashboard' element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        
        <Route path='/profile' element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  )
}

export default Routing
```

**Ventajas:**
- Reutilizable para múltiples rutas
- Código limpio y mantenible
- Fácil de testear

**Desventajas:**
- Requiere importar cada componente de página en el routing

---

### Variante 2: Componente específico por página

**Archivo: `/src/routes/PrivateRoutes.jsx`**

```javascript
import React from 'react'
import { Navigate } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'

const PrivateRoute = ({ children }) => {
  const isAuthenticated = () => {
    const usuario = sessionStorage.getItem('usuario')
    return usuario !== null
  }

  return isAuthenticated() ? children : <Navigate to="/login" replace />
}

// Componentes específicos para cada página
const DashboardProtegido = () => (
  <PrivateRoute>
    <Dashboard />
  </PrivateRoute>
)

const ProfileProtegido = () => (
  <PrivateRoute>
    <Profile />
  </PrivateRoute>
)

export { DashboardProtegido, ProfileProtegido }
```

**Uso en Routing.jsx:**

```javascript
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import { DashboardProtegido, ProfileProtegido } from '../routes/PrivateRoutes'

function Routing() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<DashboardProtegido />} />
        <Route path='/profile' element={<ProfileProtegido />} />
      </Routes>
    </Router>
  )
}

export default Routing
```

**Ventajas:**
- Routing más limpio
- Imports centralizados en un archivo

**Desventajas:**
- Menos flexible
- Más archivos que mantener

---

### Variante 3: Con Context API (Aplicaciones grandes)

**Archivo: `/src/contexts/AuthContext.jsx`**

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un usuario guardado al cargar la app
    const savedUser = sessionStorage.getItem('usuario')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    sessionStorage.setItem('usuario', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('usuario')
  }

  const isAuthenticated = () => {
    return user !== null
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
```

**Archivo: `/src/components/PrivateRoute.jsx`**

```javascript
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Cargando...</div> // O un componente de loading
  }

  return isAuthenticated() ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
```

**Ventajas:**
- Estado global de autenticación
- Mejor para aplicaciones complejas
- Funciones centralizadas de login/logout

**Desventajas:**
- Más complejo para aplicaciones simples
- Requiere configuración adicional

---

### Variante 4: Con verificación de roles

**Archivo: `/src/components/PrivateRoute.jsx`**

```javascript
import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children, requiredRole = null }) => {
  const isAuthenticated = () => {
    const usuario = sessionStorage.getItem('usuario')
    return usuario !== null
  }

  const hasRequiredRole = () => {
    if (!requiredRole) return true
    
    const usuario = JSON.parse(sessionStorage.getItem('usuario'))
    return usuario && usuario.role === requiredRole
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  if (!hasRequiredRole()) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default PrivateRoute
```

**Uso:**

```javascript
// Solo usuarios autenticados
<Route path='/dashboard' element={
  <PrivateRoute>
    <Dashboard />
  </PrivateRoute>
} />

// Solo administradores
<Route path='/admin' element={
  <PrivateRoute requiredRole="admin">
    <AdminPanel />
  </PrivateRoute>
} />
```

## Ejemplos prácticos

### Ejemplo completo con autenticación

**1. Componente de Login que guarda en sessionStorage:**

```javascript
const handleLogin = async (credentials) => {
  try {
    const response = await api.login(credentials)
    const userData = {
      id: response.id,
      name: response.name,
      email: response.email,
      role: response.role
    }
    
    sessionStorage.setItem('usuario', JSON.stringify(userData))
    navigate('/dashboard')
  } catch (error) {
    console.error('Error en login:', error)
  }
}
```

**2. PrivateRoute que verifica sessionStorage:**

```javascript
const PrivateRoute = ({ children }) => {
  const isAuthenticated = () => {
    try {
      const usuario = sessionStorage.getItem('usuario')
      return usuario !== null && JSON.parse(usuario).id
    } catch {
      return false
    }
  }

  return isAuthenticated() ? children : <Navigate to="/login" replace />
}
```

**3. Configuración de rutas:**

```javascript
function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas privadas */}
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute><Profile /></PrivateRoute>
        } />
        <Route path="/settings" element={
          <PrivateRoute><Settings /></PrivateRoute>
        } />
        
        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}
```

## Mejores prácticas

### 1. Verificación de autenticación

```javascript
const isAuthenticated = () => {
  try {
    const usuario = sessionStorage.getItem('usuario')
    if (!usuario) return false
    
    const userData = JSON.parse(usuario)
    return userData && userData.id
  } catch (error) {
    console.error('Error al verificar autenticación:', error)
    return false
  }
}
```

### 2. Manejo de tokens con expiración

```javascript
const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('token')
    const expirationTime = localStorage.getItem('tokenExpiration')
    
    if (!token || !expirationTime) return false
    
    return Date.now() < parseInt(expirationTime)
  } catch {
    return false
  }
}
```

### 3. Componente de Loading

```javascript
const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await verifyToken() // Función async que verifica el token
      setAuthenticated(isAuth)
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  if (loading) {
    return <div>Verificando autenticación...</div>
  }

  return authenticated ? children : <Navigate to="/login" replace />
}
```

### 4. Logout automático

```javascript
// En tu contexto de autenticación o componente principal
useEffect(() => {
  const handleStorageChange = (e) => {
    if (e.key === 'usuario' && e.newValue === null) {
      // El usuario fue eliminado del storage, hacer logout
      navigate('/login')
    }
  }

  window.addEventListener('storage', handleStorageChange)
  return () => window.removeEventListener('storage', handleStorageChange)
}, [])
```

## Troubleshooting

### Problema 1: "Cannot read properties of null"

**Error:** Intento de parsear datos nulos del storage
**Solución:**

```javascript
const isAuthenticated = () => {
  try {
    const usuario = sessionStorage.getItem('usuario')
    return usuario !== null && JSON.parse(usuario)
  } catch (error) {
    // Limpiar storage corrupto
    sessionStorage.removeItem('usuario')
    return false
  }
}
```

### Problema 2: Loops infinitos de redirección

**Error:** Redirección infinita entre /login y ruta privada
**Solución:** Usar `replace` en Navigate

```javascript
return <Navigate to="/login" replace />
```

### Problema 3: Estado no se actualiza después del login

**Error:** PrivateRoute no detecta que el usuario se autenticó
**Solución:** Usar Context API o forzar re-render

```javascript
// Con Context API
const { isAuthenticated } = useAuth()

// O forzar re-render
const [authState, setAuthState] = useState(Date.now())

// En el login exitoso
sessionStorage.setItem('usuario', JSON.stringify(userData))
setAuthState(Date.now()) // Fuerza re-render
```

### Problema 4: Usuario puede acceder escribiendo URL directamente

**Error:** La protección no funciona navegando por URL
**Verificar:** Que PrivateRoute esté correctamente implementado y que la función de autenticación funcione.

### Problema 5: Importaciones incorrectas

**Error:** `PrivateRoute is not defined`
**Verificar:**
- Que el export/import coincidan
- Que la ruta del archivo sea correcta
- Que el componente esté exportado como default

```javascript
// Exportar
export default PrivateRoute

// Importar
import PrivateRoute from './components/PrivateRoute'
```

## Conclusión

Las rutas privadas son esenciales para proteger contenido sensible en aplicaciones React. La implementación más común y recomendada es la **Variante 1** (componente reutilizable) para la mayoría de aplicaciones. Para proyectos más complejos, considera usar Context API (**Variante 3**) para un mejor manejo del estado global de autenticación.

Recuerda siempre:
- Verificar autenticación tanto en frontend como backend
- Manejar errores graciosamente
- Usar `replace` en las redirecciones
- Limpiar storage al hacer logout
- Testear todos los escenarios de navegación