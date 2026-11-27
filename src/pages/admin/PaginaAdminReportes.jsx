import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Boton from '../../components/Boton'
import MensajeError from '../../components/MensajeError'
import FiltroCategorias from '../../components/FiltroCategorias'
import GraficaBarras from '../../components/GraficaBarras'
import { obtenerReportes } from '../../api/admin'
import { descargarCsv } from '../../utils/csv'
import { formatearPrecio } from '../../utils/formato'

const TODOS = 'Todos los eventos'

// R1: ventas por evento (tabla y grafica) y R3: estado "exportando" al bajar el CSV
function PaginaAdminReportes() {
  const navegar = useNavigate()
  const [reporte, setReporte] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)
  const [filtro, setFiltro] = useState(TODOS)
  const [busqueda, setBusqueda] = useState('')
  const [exportando, setExportando] = useState(false)

  useEffect(() => {
    const control = new AbortController()
    obtenerReportes(control.signal)
      .then((datos) => {
        setReporte(datos)
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

  // filas que se ven: primero el chip elegido y despues lo que se escribio en el buscador
  let filas = []
  let chips = [TODOS]
  if (reporte) {
    chips = chips.concat(reporte.eventos.map((e) => e.titulo))
    filas = reporte.eventos.filter((evento) => {
      const coincideChip = filtro === TODOS || evento.titulo === filtro
      const coincideTexto = evento.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())
      return coincideChip && coincideTexto
    })
  }

  // la espera de 1 segundo simula que el reporte tarda en generarse
  function exportar() {
    if (exportando) {
      return
    }
    setExportando(true)
    setTimeout(() => {
      const csv = [['Evento', 'Boletos', 'Ingresos', 'Ocupacion']]
      for (let i = 0; i < filas.length; i++) {
        csv.push(['"' + filas[i].nombre + '"', filas[i].boletos, filas[i].ingresos.toFixed(2), filas[i].ocupacion + '%'])
      }
      descargarCsv('ventas-rushtix.csv', csv)
      setExportando(false)
    }, 1000)
  }

  return (
    <section>
      <p className="kicker">Reportes</p>
      <h1 className="titulo-hero">Ventas</h1>
      <p className="subtitulo">Boletos e ingresos por evento en el periodo elegido.</p>

      {cargando && <p role="status">Cargando el reporte...</p>}
      {error && <MensajeError mensaje={error} alReintentar={reintentar} />}

      {!cargando && !error && (
        <>
          <div className="admin-pastillas">
            <FiltroCategorias categorias={chips} seleccionada={filtro} alElegir={setFiltro} />
          </div>

          <div className="admin-barra-acciones">
            <Boton alHacerClic={exportar} deshabilitado={exportando}>
              {exportando ? 'Exportando...' : 'Exportar CSV'}
            </Boton>
            <Boton variante="borde" alHacerClic={() => navegar('/admin/reportes/tendencias')}>
              Ver tendencias
            </Boton>
          </div>
          {exportando && <p role="status">Exportando reporte, un momento...</p>}

          <div className="buscador admin-buscador">
            <label htmlFor="buscar-reporte" className="etiqueta-campo">
              Buscar evento en la tabla
            </label>
            <div className="buscador-campo">
              <input
                id="buscar-reporte"
                type="search"
                value={busqueda}
                placeholder="Buscar evento en la tabla..."
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-tabla-marco">
            <table className="admin-tabla">
              <thead>
                <tr>
                  <th scope="col">Evento</th>
                  <th scope="col">Boletos</th>
                  <th scope="col">Ingresos</th>
                  <th scope="col">Ocupación</th>
                </tr>
              </thead>
              <tbody>
                {filas.map((evento) => (
                  <tr key={evento.id}>
                    <td className="admin-celda-nombre">{evento.nombre}</td>
                    <td className="admin-celda-dato">{evento.boletos}</td>
                    <td className="admin-celda-dato">{formatearPrecio(evento.ingresos)}</td>
                    <td className="admin-celda-dato">{evento.ocupacion}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filas.length === 0 && <p className="texto-suave">No hay eventos con ese filtro.</p>}

          <GraficaBarras
            titulo="Boletos vendidos por evento"
            datos={filas.map((evento) => ({ etiqueta: evento.titulo, valor: evento.boletos }))}
          />
        </>
      )}
    </section>
  )
}

export default PaginaAdminReportes