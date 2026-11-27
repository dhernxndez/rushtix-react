import { Link, NavLink } from 'react-router-dom'
import Logo from './Logo'

// usuario es null si no hay sesion; alSalir cierra la sesion
function EncabezadoSitio({ cantidadCarrito, usuario, alSalir }) {
  const enlaces = [
    { ruta: '/eventos', texto: 'Eventos' },
    { ruta: '/carrito', texto: 'Carrito (' + cantidadCarrito + ')' },
  ]
  // si hay sesion se ven los boletos, si no se ofrece entrar
  if (usuario) {
     enlaces.push({ ruta: '/perfil', texto: 'Mi perfil' })
     enlaces.push({ ruta: '/boletos', texto: 'Mis boletos' })
  } else {
    enlaces.push({ ruta: '/login', texto: 'Ingresar' })
  }

  return (
    <header className="encabezado">
      <Link to="/" className="encabezado-logo" aria-label="RushTix, ir al inicio">
        <Logo />
      </Link>
      <nav aria-label="Principal">
        <ul className="menu">
          {enlaces.map((enlace) => (
            <li key={enlace.ruta}>
              <NavLink to={enlace.ruta} className="menu-boton">
                {enlace.texto}
              </NavLink>
            </li>
          ))}
          {usuario && (
            <li>
              <button type="button" className="menu-boton menu-salir" onClick={alSalir}>
                Salir ({usuario.nombre})
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default EncabezadoSitio