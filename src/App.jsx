import { Routes, Route, useNavigate, Link } from 'react-router-dom'
import EncabezadoSitio from './components/EncabezadoSitio'
import PiePagina from './components/PiePagina'
import PaginaEventos from './pages/PaginaEventos'
import PaginaDetalle from './pages/PaginaDetalle'
import PaginaCarrito from './pages/PaginaCarrito'
import { useCarrito } from './context/hooks'

function App() {
  // para cambiar de ruta
  const navegar = useNavigate()
  // el carrito vive en el contexto, aqui solo lo usamos
  const carrito = useCarrito()

  function verDetalle(id) {
    navegar('/eventos/' + id)
  }

  return (
    <>
      <EncabezadoSitio cantidadCarrito={carrito.cantidadTotal} />
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
              />
            }
          />
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