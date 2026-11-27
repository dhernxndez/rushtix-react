import '../../estilos/admin.css'
import { NavLink, Outlet } from 'react-router-dom'

// marco del panel admin: barra lateral y, a la derecha, la pantalla de la ruta hija (Outlet)
function LayoutAdmin() {
  return (
    <div className="admin">
      <aside className="admin-lateral">
        <p className="kicker">Panel admin</p>
        <nav aria-label="Panel de administración">
          <ul>
            <li>
              {/* end: Dashboard solo queda marcado en /admin exacto */}
              <NavLink to="/admin" end className="admin-enlace">
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/eventos" className="admin-enlace">
                Eventos
              </NavLink>
            </li>
                        <li>
              <NavLink to="/admin/inventario" className="admin-enlace">
                Inventario y precios
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/usuarios" className="admin-enlace">
                Usuarios
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/reportes" className="admin-enlace">
                Reportes
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="admin-contenido">
        <Outlet />
      </div>
    </div>
  )
}

export default LayoutAdmin
