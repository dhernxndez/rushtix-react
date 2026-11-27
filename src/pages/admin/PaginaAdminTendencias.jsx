import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Boton from '../../components/Boton'
import MensajeError from '../../components/MensajeError'
import GraficaBarras from '../../components/GraficaBarras'
import { obtenerReportes } from '../../api/admin'
import { descargarCsv } from '../../utils/csv'

// R2: como evolucionan las ventas por semana y que zonas se venden mas
function PaginaAdminTendencias() {
  const navegar = useNavigate()
  const [reporte, setReporte] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)

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

  function exportar() {
    const csv = [['Zona', 'Boletos']]
    for (let i = 0; i < reporte.zonas.length; i++) {
      csv.push([reporte.zonas[i].nombre, reporte.zonas[i].boletos])
    }
    descargarCsv('tendencias-rushtix.csv', csv)
  }

  return (
    <section>
      <p className="kicker">Reportes</p>
      <h1 className="titulo-hero">Tendencias</h1>
      <p className="subtitulo">Cómo evolucionan las ventas y qué zonas se llenan primero.</p>

      {cargando && <p role="status">Cargando el reporte...</p>}
      {error && <MensajeError mensaje={error} alReintentar={reintentar} />}

      {!cargando && !error && (
        <>
          <GraficaBarras
            titulo="Boletos vendidos por semana"
            datos={reporte.semanas.map((s) => ({ etiqueta: s.nombre, valor: s.boletos }))}
          />
          <GraficaBarras
            titulo="Zonas más vendidas"
            datos={reporte.zonas.map((z) => ({ etiqueta: z.nombre, valor: z.boletos }))}
          />
          <div className="admin-barra-acciones">
            <Boton variante="borde" alHacerClic={() => navegar('/admin/reportes')}>
              Ver ventas
            </Boton>
            <Boton alHacerClic={exportar}>Exportar CSV</Boton>
          </div>
        </>
      )}
    </section>
  )
}

export default PaginaAdminTendencias