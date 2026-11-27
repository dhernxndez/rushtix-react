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
import PaginaConfirmacion from './pages/PaginaConfirmacion'
import PaginaBoletos from './pages/PaginaBoletos'
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
      <EncabezadoSitio cantidadCarrito={carrito.cantidadTotal} usuario={sesion.usuario} alSalir={cerrarSesion} />
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
                alContinuar={() => navegar('/pago')}
              />
            }
          />
                  <Route path="/login" element={<PaginaLogin />} />
          <Route path="/registro" element={<PaginaRegistro />} />
          <Route path="/pago" element={<PaginaPago />} />
          <Route path="/perfil" element={<PaginaPerfil />} />
          <Route path="/confirmacion/:ordenId" element={<PaginaConfirmacion />} />
          <Route path="/boletos" element={<PaginaBoletos />} />
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