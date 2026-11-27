import '../estilos/perfil.css'
import { useNavigate, Navigate } from 'react-router-dom'
import Boton from '../components/Boton'
import { useSesion } from '../context/hooks'

// datos de la cuenta del usuario con sesion iniciada
function PaginaPerfil() {
  const navegar = useNavigate()
  const sesion = useSesion()

  // sin sesion no hay perfil: se manda al login y despues vuelve aqui
  if (!sesion.usuario) {
    return <Navigate to="/login" state={{ desde: '/perfil' }} replace />
  }

  const usuario = sesion.usuario

  function cerrarSesion() {
    sesion.salir()
    navegar('/eventos')
  }

  return (
    <section className="pagina-estrecha">
      <p className="kicker">Tu cuenta</p>
      <h1 className="titulo-hero">Mi perfil</h1>

      <dl className="resumen-filas perfil-datos">
        <div>
          <dt>Nombre</dt>
          <dd>{usuario.nombre}</dd>
        </div>
        <div>
          <dt>Correo</dt>
          <dd>{usuario.correo}</dd>
        </div>
        <div>
          <dt>Tipo de cuenta</dt>
          <dd>{usuario.rol}</dd>
        </div>
      </dl>

      <div className="perfil-acciones">
        <Boton alHacerClic={() => navegar('/boletos')}>Ver mis boletos</Boton>
        <Boton variante="borde" alHacerClic={() => navegar('/eventos')}>
          Ver eventos
        </Boton>
        <Boton variante="texto" alHacerClic={cerrarSesion}>
          Cerrar sesión
        </Boton>
      </div>
    </section>
  )
}

export default PaginaPerfil