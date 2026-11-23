import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Link } from 'react-router-dom'
import EncabezadoSitio from './components/EncabezadoSitio'
import PiePagina from './components/PiePagina'
import PaginaEventos from './pages/PaginaEventos'
import PaginaDetalle from './pages/PaginaDetalle'
import PaginaCarrito from './pages/PaginaCarrito'
import { leerGuardado, guardar } from './utils/almacenamiento'

function App() {
  // para cambiar de ruta
  const navegar = useNavigate()
  const [carrito, setCarrito] = useState(() => leerGuardado('rushtix-carrito', []))

  // guardar el carrito cada vez que cambia
  useEffect(() => {
    guardar('rushtix-carrito', carrito)
  }, [carrito])

  function verDetalle(id) {
    navegar('/eventos/' + id)
  }

  function agregarAlCarrito(nuevo) {
    const existe = carrito.find((i) => i.eventoId === nuevo.eventoId && i.zonaId === nuevo.zonaId)
    if (existe) {
      const copia = carrito.map((i) => {
        if (i === existe) {
          let cantidad = i.cantidad + nuevo.cantidad
          if (cantidad > 8) {
            cantidad = 8
          }
          return { eventoId: i.eventoId, zonaId: i.zonaId, nombreEvento: i.nombreEvento, nombreZona: i.nombreZona, fecha: i.fecha, precio: i.precio, cantidad: cantidad }
        }
        return i
      })
      setCarrito(copia)
    } else {
      setCarrito(carrito.concat([nuevo]))
    }
  }

  function cambiarCantidad(idEvento, idZona, nueva) {
    if (nueva < 1 || nueva > 8) {
      return
    }
    const copia = carrito.map((i) => {
      if (i.eventoId === idEvento && i.zonaId === idZona) {
        return { eventoId: i.eventoId, zonaId: i.zonaId, nombreEvento: i.nombreEvento, nombreZona: i.nombreZona, fecha: i.fecha, precio: i.precio, cantidad: nueva }
      }
      return i
    })
    setCarrito(copia)
  }

  function quitarDelCarrito(idEvento, idZona) {
    setCarrito(carrito.filter((i) => !(i.eventoId === idEvento && i.zonaId === idZona)))
  }

  let cantidadCarrito = 0
  for (let i = 0; i < carrito.length; i++) {
    cantidadCarrito = cantidadCarrito + carrito[i].cantidad
  }

  return (
    <>
      <EncabezadoSitio cantidadCarrito={cantidadCarrito} />
      <main className="contenido">
        <Routes>
          <Route path="/" element={<PaginaEventos alVerDetalle={verDetalle} />} />
          <Route path="/eventos" element={<PaginaEventos alVerDetalle={verDetalle} />} />
          <Route
            path="/eventos/:id"
            element={
              <PaginaDetalle
                alVolver={() => navegar('/eventos')}
                alAgregar={agregarAlCarrito}
                alIrAlCarrito={() => navegar('/carrito')}
              />
            }
          />
          <Route
            path="/carrito"
            element={
              <PaginaCarrito
                items={carrito}
                alQuitar={quitarDelCarrito}
                alCambiarCantidad={cambiarCantidad}
                alVaciar={() => setCarrito([])}
                alSeguirComprando={() => navegar('/eventos')}
              />
            }
          />
          <Route
            path="*"
            element={
              <section>
                <h1>Página no encontrada</h1>
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
