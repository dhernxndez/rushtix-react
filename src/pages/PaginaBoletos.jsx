import { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import EstadoCarga from '../components/EstadoCarga'
import EstadoVacio from '../components/EstadoVacio'
import MensajeError from '../components/MensajeError'
import TarjetaBoleto from '../components/TarjetaBoleto'
import { listarBoletosDeUsuario } from '../api/ordenes'
import { useSesion } from '../context/hooks'

// lista de todos los boletos del usuario con sesion iniciada
function PaginaBoletos() {
  const navegar = useNavigate()
  const sesion = useSesion()
  const [boletos, setBoletos] = useState([])
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
      .then((datos) => {
        setBoletos(datos)
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
  }, [usuarioId, intento])

  function reintentar() {
    setCargando(true)
    setError('')
    setIntento(intento + 1)
  }

  if (!sesion.usuario) {
    return <Navigate to="/login" state={{ desde: '/boletos' }} replace />
  }

  return (
    <section>
      <p className="kicker">Tu cuenta</p>
      <h1 className="titulo-hero">Mis boletos</h1>

      {cargando && <EstadoCarga mensaje="Cargando tus boletos..." />}
      {error && <MensajeError mensaje={error} alReintentar={reintentar} />}

      {!cargando && !error && boletos.length === 0 && (
        <EstadoVacio
          titulo="Aún no tienes boletos"
          mensaje="Cuando compres entradas aparecerán aquí con su código QR."
          textoBoton="Ver eventos"
          alBoton={() => navegar('/eventos')}
        />
      )}

      <div className="lista-boletos">
        {boletos.map((boleto) => (
          <TarjetaBoleto key={boleto.id} boleto={boleto} />
        ))}
      </div>
    </section>
  )
}

export default PaginaBoletos