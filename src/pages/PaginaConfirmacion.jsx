import { useState, useEffect } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import Pasos from '../components/Pasos'
import Boton from '../components/Boton'
import EstadoCarga from '../components/EstadoCarga'
import MensajeError from '../components/MensajeError'
import TarjetaBoleto from '../components/TarjetaBoleto'
import { obtenerOrden, listarBoletosDeUsuario } from '../api/ordenes'
import { useSesion } from '../context/hooks'
import { formatearPrecio } from '../utils/formato'

// paso 4: confirmacion de la compra y boletos con su QR
function PaginaConfirmacion() {
  const { ordenId } = useParams()
  const navegar = useNavigate()
  const sesion = useSesion()
  const [orden, setOrden] = useState(null)
  const [boletos, setBoletos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)

  let usuarioId = null
  if (sesion.usuario) {
    usuarioId = sesion.usuario.id
  }

  // pide la orden y sus boletos; el AbortController cancela si se sale de la pagina
  useEffect(() => {
    if (usuarioId === null) {
      return
    }
    const control = new AbortController()
    Promise.all([obtenerOrden(ordenId, control.signal), listarBoletosDeUsuario(usuarioId, control.signal)])
      .then((resultados) => {
        const ordenPedida = resultados[0]
        if (ordenPedida.usuarioId !== usuarioId) {
          throw new Error('No encontramos esa orden.')
        }
        // de todos los boletos del usuario, solo los de esta orden
        const deEstaOrden = resultados[1].filter((b) => b.ordenId === ordenId)
        setOrden(ordenPedida)
        setBoletos(deEstaOrden)
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
      <h1 className="titulo-hero">Pago confirmado</h1>

      {cargando && <EstadoCarga mensaje="Cargando tu compra..." />}
      {error && <MensajeError mensaje={error} alReintentar={reintentar} />}

      {orden && (
        <>
          <p className="subtitulo">
            Orden {orden.id} por {formatearPrecio(orden.total)}. Aquí están tus boletos.
          </p>
          <div className="lista-boletos">
            {boletos.map((boleto) => (
              <TarjetaBoleto key={boleto.id} boleto={boleto} />
            ))}
          </div>
          <div className="lista-boletos">
            <Boton alHacerClic={() => navegar('/boletos')}>Ver todos mis boletos</Boton>
            <Boton variante="borde" alHacerClic={() => navegar('/eventos')}>
              Seguir comprando
            </Boton>
          </div>
        </>
      )}
    </section>
  )
}

export default PaginaConfirmacion