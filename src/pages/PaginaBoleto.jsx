import { useState, useEffect } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import Boton from '../components/Boton'
import EstadoCarga from '../components/EstadoCarga'
import MensajeError from '../components/MensajeError'
import TarjetaBoleto from '../components/TarjetaBoleto'
import { listarBoletosDeUsuario } from '../api/ordenes'
import { useSesion } from '../context/hooks'

// pantalla de un solo boleto con su QR (se llega desde Mis boletos con "Ver QR")
function PaginaBoleto() {
  const { boletoId } = useParams()
  const navegar = useNavigate()
  const sesion = useSesion()
  const [boleto, setBoleto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)

  let usuarioId = null
  if (sesion.usuario) {
    usuarioId = sesion.usuario.id
  }

  useEffect(() => {
    if (usuarioId === null) {
      return
    }
    const control = new AbortController()
    listarBoletosDeUsuario(usuarioId, control.signal)
      .then((boletos) => {
        // se busca el boleto por su id entre los del usuario
        const encontrado = boletos.find((b) => b.id === boletoId)
        if (!encontrado) {
          throw new Error('No encontramos ese boleto.')
        }
        setBoleto(encontrado)
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
  }, [boletoId, usuarioId, intento])

  function reintentar() {
    setCargando(true)
    setError('')
    setIntento(intento + 1)
  }

  if (!sesion.usuario) {
    return <Navigate to="/login" state={{ desde: '/boletos/' + boletoId }} replace />
  }

  return (
    <section>
      <p className="kicker">Mi boleto</p>
      <h1 className="titulo-hero">Tu boleto</h1>
      <p className="subtitulo">Guardá la pantalla o mostrá el QR desde tu correo.</p>

      {cargando && <EstadoCarga mensaje="Cargando tu boleto..." />}
      {error && <MensajeError mensaje={error} alReintentar={reintentar} />}
      {boleto && <TarjetaBoleto boleto={boleto} />}

      <div className="acciones-boleto">
        <Boton alHacerClic={() => navegar('/boletos')}>Ver mis boletos</Boton>
        <Boton variante="borde" alHacerClic={() => navegar('/')}>
          Volver al inicio
        </Boton>
      </div>
    </section>
  )
}

export default PaginaBoleto