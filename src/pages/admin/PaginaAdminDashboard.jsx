import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Boton from '../../components/Boton'
import MensajeError from '../../components/MensajeError'
import EtiquetaEstado from '../../components/EtiquetaEstado'
import { obtenerResumenAdmin } from '../../api/admin'
import { formatearFechaCorta } from '../../utils/formato'

// A1: indicadores de ventas y los proximos eventos
function PaginaAdminDashboard() {
  const navegar = useNavigate()
  const [resumen, setResumen] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)

  // una sola peticion trae todo: el dashboard se pinta cuando llega completa
  useEffect(() => {
    const control = new AbortController()
    obtenerResumenAdmin(control.signal)
      .then((datos) => {
        setResumen(datos)
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

  function reintentar() {
    setCargando(true)
    setError('')
    setIntento(intento + 1)
  }

  // los 5 eventos mas proximos por fecha
  let recientes = []
  if (resumen) {
    recientes = resumen.eventos.slice().sort((a, b) => new Date(a.fecha) - new Date(b.fecha)).slice(0, 5)
  }

  return (
    <section>
      <p className="kicker">Panel admin</p>
      <h1 className="titulo-hero">Dashboard</h1>
      <p className="subtitulo">Ventas y ocupación de los eventos.</p>

      {cargando && <p role="status">Cargando el resumen...</p>}
      {error && <MensajeError mensaje={error} alReintentar={reintentar} />}

      {!cargando && !error && (
        <>
          <ul className="admin-indicadores">
            <li className="admin-indicador">
              <span className="kicker">Boletos vendidos</span>
              <strong>{resumen.boletosVendidos.toLocaleString('es-SV')}</strong>
            </li>
            <li className="admin-indicador">
              <span className="kicker">Ingresos</span>
              <strong>${resumen.ingresos.toLocaleString('es-SV', { maximumFractionDigits: 0 })}</strong>
            </li>
            <li className="admin-indicador">
              <span className="kicker">Eventos activos</span>
              <strong>{resumen.eventosActivos}</strong>
            </li>
            <li className="admin-indicador">
              <span className="kicker">Ocupación</span>
              <strong>{resumen.ocupacion}%</strong>
            </li>
          </ul>

          <div className="admin-acciones">
            <Boton alHacerClic={() => navegar('/admin/eventos/nuevo')}>Crear evento</Boton>
            <Boton variante="borde" alHacerClic={() => navegar('/admin/eventos')}>
              Ver eventos
            </Boton>
          </div>

          <h2 className="admin-subtitulo">Próximos eventos</h2>
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
                {recientes.map((evento) => (
                  <tr key={evento.id}>
                    <td className="admin-celda-nombre">{evento.nombre}</td>
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
        </>
      )}
    </section>
  )
}

export default PaginaAdminDashboard
