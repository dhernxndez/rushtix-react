import { useState, useEffect } from 'react'
import BuscadorEventos from '../components/BuscadorEventos'
import FiltroCategorias from '../components/FiltroCategorias'
import ListaEventos from '../components/ListaEventos'
import EstadoCarga from '../components/EstadoCarga'
import MensajeError from '../components/MensajeError'
import { categorias } from '../data/eventos'
import { listarEventos } from '../api/eventos'

// listado de eventos con buscador y filtro por categoria
// los eventos vienen de la API falsa y el filtrado se hace aqui en la pagina
function PaginaEventos({ alVerDetalle }) {
  const [eventos, setEventos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('Todos')
  const [intento, setIntento] = useState(0)

  // pide los eventos a la API; si se pulsa Reintentar, intento cambia y se vuelve a pedir
  useEffect(() => {
    // el AbortController cancela la peticion si el usuario sale de la pantalla
    const control = new AbortController()
    listarEventos(control.signal)
      .then((datos) => {
        setEventos(datos)
        setCargando(false)
      })
      .catch((e) => {
        // si se cancelo a proposito, no es un error que haya que mostrar
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

  // vuelve a pedir los eventos despues de un error
  function reintentar() {
    setCargando(true)
    setError('')
    setIntento(intento + 1)
  }

  // deja el buscador vacio y la categoria en Todos
  function limpiarFiltros() {
    setBusqueda('')
    setCategoria('Todos')
  }

  // el buscador ignora mayusculas y espacios sobrantes
  const textoBuscado = busqueda.trim().toLowerCase()
  const eventosFiltrados = eventos.filter((evento) => {
    // los borradores y los eventos finalizados no se muestran en el sitio
    if (evento.estado === 'Borrador' || evento.estado === 'Finalizado') {
      return false
    }
    // cumple si coincide la categoria elegida y el texto aparece en nombre, lugar o categoria
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

      {/* solo uno de los tres se muestra: cargando, error o la lista */}
      {cargando && <EstadoCarga mensaje="Cargando eventos..." />}
      {error && <MensajeError mensaje={error} alReintentar={reintentar} />}
      {!cargando && !error && (
        <ListaEventos eventos={eventosFiltrados} alVerDetalle={alVerDetalle} alLimpiar={limpiarFiltros} />
      )}
    </section>
  )
}

export default PaginaEventos
