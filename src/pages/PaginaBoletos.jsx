import { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import Boton from '../components/Boton'
import EstadoCarga from '../components/EstadoCarga'
import EstadoVacio from '../components/EstadoVacio'
import MensajeError from '../components/MensajeError'
import { listarBoletosDeUsuario } from '../api/ordenes'
import { useSesion } from '../context/hooks'
import { formatearFechaCorta } from '../utils/formato'
import '../estilos/formularios.css'
import '../estilos/boletos.css'

// lista de todos los boletos del usuario con sesion iniciada
function PaginaBoletos() {
  const navegar = useNavigate()
  const sesion = useSesion()
  const [boletos, setBoletos] = useState([])
  const [busqueda, setBusqueda] = useState('')
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

  // el buscador filtra por nombre del evento o por la fecha
  const texto = busqueda.trim().toLowerCase()
  const visibles = boletos.filter((b) => {
    const dato = (b.nombreEvento + ' ' + formatearFechaCorta(b.fecha)).toLowerCase()
    return dato.includes(texto)
  })

  return (
    <section>
      <p className="kicker">Mi cuenta</p>
      <h1 className="titulo-hero">Mis boletos</h1>
      <p className="subtitulo">Los que tenés para próximos eventos y los que ya usaste.</p>

      <div className="campo buscador-boletos">
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por evento o fecha..."
          aria-label="Buscar por evento o fecha"
        />
      </div>

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
        {visibles.map((boleto) => (
          <div className="fila-boleto" key={boleto.id}>
            <div>
              <h3>{boleto.nombreEvento}</h3>
              <p>
                {boleto.nombreZona} × 1 · {formatearFechaCorta(boleto.fecha)}
                {boleto.estado !== 'valido' && ' · Usado'}
              </p>
            </div>
            <Boton variante="borde" tamano="s" alHacerClic={() => navegar('/boletos/' + boleto.id)}>
              Ver QR
            </Boton>
          </div>
        ))}
      </div>

      <Boton variante="texto" alHacerClic={() => navegar('/perfil')}>
        Ver mi perfil
      </Boton>
    </section>
  )
}

export default PaginaBoletos