import { Navigate, useNavigate } from 'react-router-dom'
import EstadoVacio from './EstadoVacio'
import { useSesion } from '../context/hooks'

// protege una pantalla segun el rol del usuario
// roles: lista de roles que pueden entrar, por ejemplo ['admin', 'organizador']
function RutaProtegida({ roles, children }) {
  const sesion = useSesion()
  const navegar = useNavigate()

  // sin sesion se manda al login
  if (!sesion.usuario) {
    return <Navigate to="/login" state={{ desde: '/admin/verificar' }} replace />
  }

  // con sesion pero sin el rol correcto se avisa
  // OJO: esto solo oculta la pantalla, en un sistema real el servidor tambien debe revisar el rol
  if (!roles.includes(sesion.usuario.rol)) {
    return (
      <EstadoVacio
        titulo="No tienes permiso"
        mensaje="Esta pantalla es solo para organizadores y administradores."
        textoBoton="Volver a los eventos"
        alBoton={() => navegar('/eventos')}
      />
    )
  }

  return children
}

export default RutaProtegida