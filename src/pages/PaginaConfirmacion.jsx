import { useState, useEffect } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import Pasos from '../components/Pasos'
import Boton from '../components/Boton'
import EstadoCarga from '../components/EstadoCarga'
import MensajeError from '../components/MensajeError'
import ResumenCompra from '../components/ResumenCompra'
import { obtenerOrden } from '../api/ordenes'
import { useSesion } from '../context/hooks'
import { formatearFechaCorta } from '../utils/formato'

// paso 4: confirmacion de la compra con el resumen de lo que se pago
function PaginaConfirmacion() {
  const { ordenId } = useParams()
  const navegar = useNavigate()
  const sesion = useSesion()
  const [orden, setOrden] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)

  let usuarioId = null
  if (sesion.usuario) {
    usuarioId = sesion.usuario.id
  }

  // pide la orden; el AbortController cancela si se sale de la pagina
  useEffect(() => {
    if (usuarioId === null) {
      return
    }
    const control = new AbortController()
    obtenerOrden(ordenId, control.signal)
      .then((ordenPedida) => {
        // una orden solo la puede ver quien la compro
        if (ordenPedida.usuarioId !== usuarioId) {
          throw new Error('No encontramos esa orden.')
        }
        setOrden(ordenPedida)
        setCargando(false)
      })
      .catch((e) => {
        if (e.name === 'AbortError') {
          return
        }
        setError(e.message)
        setCargando(false)
      })
    return () => {
      control.abort()
    }
  }, [ordenId, usuarioId, intento])

  function reintentar() {
    setCargando(true)
    setError('')
    setIntento(intento + 1)
  }

  if (!sesion.usuario) {
    return <Navigate to="/login" state={{ desde: '/confirmacion/' + ordenId }} replace />
  }

  return (
    <section>
      <Pasos actual={4} />
      <p className="kicker">Paso 4 de 4</p>
      <h1 className="titulo-hero">Listo, tu compra está confirmada</h1>
      <p className="subtitulo">Te mandamos el boleto con QR al correo {sesion.usuario.correo}.</p>

      {cargando && <EstadoCarga mensaje="Cargando tu compra..." />}
      {error && <MensajeError mensaje={error} alReintentar={reintentar} />}

      {orden && (
        <div className="dos-columnas">
          <div className="columna-principal">
            <h2>Pedido {orden.id}</h2>
            {orden.items.map((item) => (
              <p className="texto-suave" key={item.eventoId + '-' + item.zonaId}>
                {item.nombreEvento} · {item.nombreZona} × {item.cantidad} · {formatearFechaCorta(item.fecha)}
              </p>
            ))}
          </div>
          <ResumenCompra titulo="Pagaste" items={orden.items}>
            <Boton completo={true} alHacerClic={() => navegar('/boletos')}>
              Ver mi boleto
            </Boton>
          </ResumenCompra>
        </div>
      )}
    </section>
  )
}

export default PaginaConfirmacion