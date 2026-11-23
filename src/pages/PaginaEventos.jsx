import { useState, useEffect } from 'react'
import BuscadorEventos from '../components/BuscadorEventos'
import FiltroCategorias from '../components/FiltroCategorias'
import ListaEventos from '../components/ListaEventos'
import EstadoCarga from '../components/EstadoCarga'
import MensajeError from '../components/MensajeError'
import { categorias } from '../data/eventos'
import { pedirEventos } from '../utils/api-simulada'

function PaginaEventos({ alVerDetalle }) {
  const [eventos, setEventos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('Todos')
  const [intento, setIntento] = useState(0)

  // pide los eventos; si se pulsa Reintentar, intento cambia y se vuelve a pedir
  useEffect(() => {
    let activo = true
    pedirEventos()
      .then((datos) => {
        if (activo) {
          setEventos(datos)
          setCargando(false)
        }
      })
      .catch((e) => {
        if (activo) {
          setError(e.message)
          setCargando(false)
        }
      })
    return () => {
      activo = false
    }
  }, [intento])

  function reintentar() {
    setCargando(true)
    setError('')
    setIntento(intento + 1)
  }

  function limpiarFiltros() {
    setBusqueda('')
    setCategoria('Todos')
  }

  const textoBuscado = busqueda.trim().toLowerCase()
  const eventosFiltrados = eventos.filter((evento) => {
    const coincideCategoria = categoria === 'Todos' || evento.categoria === categoria
    const coincideTexto =
      evento.nombre.toLowerCase().includes(textoBuscado) ||
      evento.lugar.toLowerCase().includes(textoBuscado) ||
      evento.categoria.toLowerCase().includes(textoBuscado)
    return coincideCategoria && coincideTexto
  })

  return (
    <section>
      <p className="kicker">San Salvador · Este fin de semana</p>
      <h1 className="titulo-hero">Esta noche hay plan</h1>
      <p className="subtitulo">Precio final desde el primer vistazo. Comprá en 4 pasos o menos.</p>

      <div className="barra-filtros">
        <BuscadorEventos texto={busqueda} alCambiar={setBusqueda} />
        <FiltroCategorias categorias={categorias} seleccionada={categoria} alElegir={setCategoria} />
      </div>

      {cargando && <EstadoCarga mensaje="Cargando eventos..." />}
      {error && <MensajeError mensaje={error} alReintentar={reintentar} />}
      {!cargando && !error && (
        <ListaEventos eventos={eventosFiltrados} alVerDetalle={alVerDetalle} alLimpiar={limpiarFiltros} />
      )}
    </section>
  )
}

export default PaginaEventos
