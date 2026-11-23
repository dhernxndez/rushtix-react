import { Link, NavLink } from 'react-router-dom'
import Logo from './Logo'

function EncabezadoSitio({ cantidadCarrito }) {
  const enlaces = [
    { ruta: '/eventos', texto: 'Eventos' },
    { ruta: '/carrito', texto: 'Carrito (' + cantidadCarrito + ')' },
  ]

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
        </ul>
      </nav>
    </header>
  )
}

export default EncabezadoSitio
