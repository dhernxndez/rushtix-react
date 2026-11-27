import { Link, NavLink } from 'react-router-dom'
import Logo from './Logo'

// encabezado como en el figma: enlaces a la izquierda y acciones de cuenta a la derecha
// usuario es null si no hay sesion; alSalir cierra la sesion
function EncabezadoSitio({ usuario, alSalir }) {
  const enlaces = [
    { ruta: '/eventos', texto: 'Eventos' },
    { ruta: '/boletos', texto: 'Mis boletos' },
    { ruta: '/ayuda', texto: 'Ayuda' },
  ]

  // los roles admin y organizador ven ademas la pantalla de verificar boletos
  if (usuario && (usuario.rol === 'admin' || usuario.rol === 'organizador')) {
    enlaces.push({ ruta: '/admin/verificar', texto: 'Verificar' })
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
        </ul>
      </nav>
      {/* sin sesion: iniciar sesion y registrarme; con sesion: perfil y salir */}
      <div className="encabezado-acciones">
        {usuario ? (
          <>
            <Link to="/perfil" className="boton boton-borde boton-s">
              Mi perfil
            </Link>
            <button type="button" className="boton boton-principal boton-s" onClick={alSalir}>
              Salir ({usuario.nombre})
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="boton boton-borde boton-s">
              Iniciar sesión
            </Link>
            <Link to="/registro" className="boton boton-principal boton-s">
              Registrarme
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default EncabezadoSitio