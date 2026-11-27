import { Routes, Route, useNavigate, Link } from 'react-router-dom'
import EncabezadoSitio from './components/EncabezadoSitio'
import PiePagina from './components/PiePagina'
import PaginaEventos from './pages/PaginaEventos'
import PaginaDetalle from './pages/PaginaDetalle'
import PaginaCarrito from './pages/PaginaCarrito'
import PaginaLogin from './pages/PaginaLogin'
import PaginaRegistro from './pages/PaginaRegistro'
import PaginaPerfil from './pages/PaginaPerfil'
import PaginaPago from './pages/PaginaPago'
import PaginaResumen from './pages/PaginaResumen'
import PaginaConfirmacion from './pages/PaginaConfirmacion'
import PaginaBoletos from './pages/PaginaBoletos'
import PaginaBoleto from './pages/PaginaBoleto'
import PaginaAyuda from './pages/PaginaAyuda'
import PaginaVerificar from './pages/PaginaVerificar'
import RutaProtegida from './components/RutaProtegida'
import LayoutAdmin from './pages/admin/LayoutAdmin'
import PaginaAdminDashboard from './pages/admin/PaginaAdminDashboard'
import PaginaAdminEventos from './pages/admin/PaginaAdminEventos'
import PaginaAdminFormEvento from './pages/admin/PaginaAdminFormEvento'
import PaginaAdminUsuarios from './pages/admin/PaginaAdminUsuarios'
import PaginaAdminReportes from './pages/admin/PaginaAdminReportes'
import PaginaAdminTendencias from './pages/admin/PaginaAdminTendencias'
import { useCarrito, useSesion } from './context/hooks'

function App() {
  // para cambiar de ruta
  const navegar = useNavigate()
  // el carrito vive en el contexto, aqui solo lo usamos
  const carrito = useCarrito()
  // la sesion tambien vive en el contexto
  const sesion = useSesion()

  function verDetalle(id) {
    navegar('/eventos/' + id)
  }

  // al salir se vuelve a la lista de eventos
  function cerrarSesion() {
    sesion.salir()
    navegar('/eventos')
  }

  return (
    <>
      <EncabezadoSitio usuario={sesion.usuario} alSalir={cerrarSesion} />
      <main className="contenido">
        <Routes>
          <Route path="/" element={<PaginaEventos alVerDetalle={verDetalle} />} />
          <Route path="/eventos" element={<PaginaEventos alVerDetalle={verDetalle} />} />
          <Route
            path="/eventos/:id"
            element={
              <PaginaDetalle
                alVolver={() => navegar('/eventos')}
                alAgregar={carrito.agregar}
                alIrAlCarrito={() => navegar('/carrito')}
              />
            }
          />
          <Route
            path="/carrito"
            element={
              <PaginaCarrito
                items={carrito.items}
                alQuitar={carrito.quitar}
                alCambiarCantidad={carrito.cambiarCantidad}
                alVaciar={carrito.vaciar}
                alSeguirComprando={() => navegar('/eventos')}
                alContinuar={() => navegar('/resumen')}
              />
            }
          />
                  <Route path="/login" element={<PaginaLogin />} />
          <Route path="/registro" element={<PaginaRegistro />} />
          <Route path="/pago" element={<PaginaPago />} />
          <Route
            path="/resumen"
            element={
              <PaginaResumen
                items={carrito.items}
                alVolverAlCarrito={() => navegar('/carrito')}
                alIrAPagar={() => navegar('/pago')}
                alVerEventos={() => navegar('/eventos')}
              />
            }
          />
          <Route path="/perfil" element={<PaginaPerfil />} />
          <Route path="/confirmacion/:ordenId" element={<PaginaConfirmacion />} />
          <Route path="/boletos" element={<PaginaBoletos />} />
          <Route path="/boletos/:boletoId" element={<PaginaBoleto />} />
          <Route path="/ayuda" element={<PaginaAyuda />} />
          {/* solo organizador y admin */}
          <Route
            path="/admin/verificar"
            element={
              <RutaProtegida roles={['admin', 'organizador']}>
                <PaginaVerificar />
              </RutaProtegida>
            }
          />
          {/* panel admin (A1, A2): rutas hijas dentro de LayoutAdmin, solo organizador y admin */}
          <Route
            path="/admin"
            element={
              <RutaProtegida roles={['admin', 'organizador']}>
                <LayoutAdmin />
              </RutaProtegida>
            }
          >
            <Route index element={<PaginaAdminDashboard />} />
            <Route path="eventos" element={<PaginaAdminEventos />} />
            <Route path="eventos/nuevo" element={<PaginaAdminFormEvento />} />
            <Route path="eventos/:id" element={<PaginaAdminFormEvento />} />
            <Route path="usuarios" element={<PaginaAdminUsuarios />} />
            <Route path="reportes" element={<PaginaAdminReportes />} />
            <Route path="reportes/tendencias" element={<PaginaAdminTendencias />} />
          </Route>
          <Route
            path="*"
            element={
              <section>
                <h1>{'P\u00e1gina no encontrada'}</h1>
                <p>
                  La ruta que buscas no existe. <Link to="/eventos">Volver a los eventos</Link>
                </p>
              </section>
            }
          />
        </Routes>
      </main>
      <PiePagina />
    </>
  )
}

export default App