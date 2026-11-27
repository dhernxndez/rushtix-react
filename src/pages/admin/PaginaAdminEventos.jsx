import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Boton from '../../components/Boton'
import MensajeError from '../../components/MensajeError'
import EstadoVacio from '../../components/EstadoVacio'
import EtiquetaEstado from '../../components/EtiquetaEstado'
import DialogoConfirmar from '../../components/DialogoConfirmar'
import { obtenerResumenAdmin } from '../../api/admin'
import { eliminarEvento } from '../../api/eventos'
import { formatearFechaCorta } from '../../utils/formato'

// A2: tabla de eventos con buscar, crear, editar y eliminar
function PaginaAdminEventos() {
  const navegar = useNavigate()
  const [eventos, setEventos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)
  const [busqueda, setBusqueda] = useState('')
  const [seleccionado, setSeleccionado] = useState(null)
  const [confirmando, setConfirmando] = useState(false)
  const [eliminando, setEliminando] = useState(false)
  const [errorEliminar, setErrorEliminar] = useState('')

  // pide la lista; intento cambia despues de eliminar o al pulsar Reintentar
  useEffect(() => {
    const control = new AbortController()
    obtenerResumenAdmin(control.signal)
      .then((datos) => {
        setEventos(datos.eventos)
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
  }, [intento])

  function recargar() {
    setCargando(true)
    setError('')
    setIntento(intento + 1)
  }

  const eventoSeleccionado = eventos.find((e) => e.id === seleccionado)
  const textoBuscado = busqueda.trim().toLowerCase()
  const eventosFiltrados = eventos.filter((e) => e.nombre.toLowerCase().includes(textoBuscado))

  async function confirmarEliminar() {
    // evita mandar el borrado dos veces
    if (eliminando) {
      return
    }
    setEliminando(true)
    setErrorEliminar('')
    try {
      await eliminarEvento(seleccionado)
      setConfirmando(false)
      setSeleccionado(null)
      recargar()
    } catch (e) {
      setErrorEliminar(e.message)
      setConfirmando(false)
    }
    setEliminando(false)
  }

  return (
    <section>
      <p className="kicker">Panel admin</p>
      <h1 className="titulo-hero">Eventos</h1>
      <p className="subtitulo">Crea, edita o elimina eventos. Los borradores no se ven en el sitio.</p>

      <div className="admin-acciones">
        <Boton alHacerClic={() => navegar('/admin/eventos/nuevo')}>Crear evento</Boton>
        <Boton variante="borde" deshabilitado={!eventoSeleccionado} alHacerClic={() => navegar('/admin/eventos/' + seleccionado)}>
          Editar seleccionado
        </Boton>
        <Boton variante="eliminar" deshabilitado={!eventoSeleccionado} alHacerClic={() => setConfirmando(true)}>
          Eliminar evento
        </Boton>
      </div>

      {errorEliminar && <MensajeError mensaje={errorEliminar} />}

      <div className="buscador admin-buscador">
        <label htmlFor="buscar-evento" className="solo-lectores">
          Buscar evento por nombre
        </label>
        <div className="buscador-campo">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" />
            <line x1="12.5" y1="12.5" x2="16" y2="16" stroke="currentColor" strokeWidth="2" />
          </svg>
          <input
            id="buscar-evento"
            type="search"
            value={busqueda}
            placeholder="Buscar evento por nombre..."
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {cargando && <p role="status">Cargando eventos...</p>}
      {error && <MensajeError mensaje={error} alReintentar={recargar} />}

      {!cargando && !error && eventosFiltrados.length === 0 && (
        <EstadoVacio
          titulo="No hay eventos"
          mensaje="No encontramos eventos con ese nombre."
          textoBoton="Limpiar búsqueda"
          alBoton={() => setBusqueda('')}
        />
      )}

      {!cargando && !error && eventosFiltrados.length > 0 && (
        <div className="admin-tabla-marco">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th scope="col">Evento</th>
                <th scope="col">Fecha</th>
                <th scope="col">Estado</th>
                <th scope="col">Vendidos</th>
              </tr>
            </thead>
            <tbody>
              {eventosFiltrados.map((evento) => (
                <tr
                  key={evento.id}
                  className={evento.id === seleccionado ? 'admin-fila-elegida' : ''}
                  onClick={() => setSeleccionado(evento.id)}
                >
                  <td className="admin-celda-nombre">
                    {/* el radio permite elegir la fila tambien con el teclado */}
                    <label className="admin-elegir">
                      <input
                        type="radio"
                        name="evento-elegido"
                        checked={evento.id === seleccionado}
                        onChange={() => setSeleccionado(evento.id)}
                      />
                      {evento.nombre}
                    </label>
                  </td>
                  <td>{formatearFechaCorta(evento.fecha)}</td>
                  <td>
                    <EtiquetaEstado estado={evento.estado} />
                  </td>
                  <td className="admin-celda-dato">
                    {evento.vendidos} / {evento.capacidad}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirmando && eventoSeleccionado && (
        <DialogoConfirmar
          titulo="¿Eliminar este evento?"
          mensaje={'Se borra "' + eventoSeleccionado.nombre + '" y todas sus zonas. Esta acción no se puede deshacer.'}
          textoConfirmar="Eliminar"
          ocupado={eliminando}
          alCancelar={() => setConfirmando(false)}
          alConfirmar={confirmarEliminar}
        />
      )}
    </section>
  )
}

export default PaginaAdminEventos
