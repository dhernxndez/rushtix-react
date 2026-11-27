import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Boton from '../components/Boton'
import Pasos from '../components/Pasos'
import SelectorZona from '../components/SelectorZona'
import SelectorCantidad from '../components/SelectorCantidad'
import EstadoCarga from '../components/EstadoCarga'
import MensajeError from '../components/MensajeError'
import { obtenerEvento } from '../api/eventos'
import { formatearFechaCorta, formatearPrecio } from '../utils/formato'
import { calcularTotales } from '../utils/carrito'

function PaginaDetalle({ alVolver, alAgregar, alIrAlCarrito }) {
  // el id viene de la ruta /eventos/:id
  const { id } = useParams()
  const [evento, setEvento] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState('')
  const [intento, setIntento] = useState(0)
  const [zonaElegida, setZonaElegida] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [mensajeError, setMensajeError] = useState('')
  const [mensajeOk, setMensajeOk] = useState('')

  // pide el evento a la API cada vez que cambia el id o se pulsa Reintentar
  useEffect(() => {
    // el AbortController cancela la peticion si el usuario sale de la pantalla
    const control = new AbortController()
    obtenerEvento(id, control.signal)
      .then((datos) => {
        setEvento(datos)
        setCargando(false)
      })
      .catch((e) => {
        if (e.name === 'AbortError') {
          return
        }
        setErrorCarga(e.message)
        setCargando(false)
      })
    return () => {
      control.abort()
    }
  }, [id, intento])

  function reintentar() {
    setCargando(true)
    setErrorCarga('')
    setIntento(intento + 1)
  }

  if (cargando) {
    return <EstadoCarga mensaje="Cargando el evento..." />
  }
  if (errorCarga) {
    return (
      <section>
        <MensajeError mensaje={errorCarga} alReintentar={reintentar} />
        <Boton variante="borde" alHacerClic={alVolver}>
          Volver a los eventos
        </Boton>
      </section>
    )
  }

    const zona = evento.zonas.find((z) => z.id === zonaElegida)
  const maximo = zona ? Math.min(zona.disponibles, 8) : 8
  const agotado = evento.estado === 'Agotado'

  // resumen "Tu selección" (solo se calcula cuando hay zona)
  let items = []
  if (zona) {
    items = [{ precio: zona.precio, cantidad: cantidad }]
  }
  const totales = calcularTotales(items)

  function cambiarCantidad(nueva) {
    if (nueva < 1) {
      setCantidad(1)
    } else if (nueva > maximo) {
      setCantidad(maximo)
    } else {
      setCantidad(nueva)
    }
  }

  function elegirZona(idZona) {
    setZonaElegida(idZona)
    setCantidad(1)
    setMensajeError('')
    setMensajeOk('')
  }

  function agregar(e) {
    e.preventDefault()
    setMensajeOk('')
    if (!zona) {
      setMensajeError('Elegí una zona antes de agregar al carrito.')
      return
    }
    if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > maximo) {
      setMensajeError('La cantidad debe estar entre 1 y ' + maximo + '.')
      return
    }
    setMensajeError('')
    alAgregar({
      eventoId: evento.id,
      nombreEvento: evento.nombre,
      zonaId: zona.id,
      nombreZona: zona.nombre,
      fecha: evento.fecha,
      precio: zona.precio,
      cantidad: cantidad,
    })
    setMensajeOk('Agregaste ' + cantidad + ' boleto(s) al carrito.')
  }

  return (
    <section>
      <Pasos actual={1} />
      <p className="kicker">Paso 1 de 4</p>
      <h1 className="titulo-hero">Elegí tu zona</h1>
      <p className="subtitulo">
        {evento.nombre} · {formatearFechaCorta(evento.fecha)} · {evento.lugar}
      </p>
      <p className="descripcion">{evento.descripcion}</p>

      <form onSubmit={agregar} className="dos-columnas" noValidate>
        <div className="columna-principal">
          <SelectorZona zonas={evento.zonas} zonaElegida={zonaElegida} alElegir={elegirZona} />
          <SelectorCantidad cantidad={cantidad} maximo={maximo} alCambiar={cambiarCantidad} />
        </div>

        <aside className="resumen-compra" aria-label="Tu selección">
          <h2>Tu selección</h2>
          {zona ? (
            <dl className="resumen-filas">
              <div>
                <dt>
                  {zona.nombre} × {cantidad}
                </dt>
                <dd>{formatearPrecio(totales.subtotal)}</dd>
              </div>
              <div>
                <dt>Cargos de servicio</dt>
                <dd>{formatearPrecio(totales.cargos)}</dd>
              </div>
              <div className="resumen-total">
                <dt>Total</dt>
                <dd>{formatearPrecio(totales.total)}</dd>
              </div>
            </dl>
          ) : (
            <p className="texto-suave">Elegí una zona para ver el total.</p>
          )}
          {mensajeError && <p className="mensaje-error" role="alert">{mensajeError}</p>}
          {mensajeOk && <p className="mensaje-ok" role="status">{mensajeOk}</p>}
          <Boton tipo="submit" completo={true} variante={agotado ? 'agotado' : 'principal'} deshabilitado={agotado}>
            {agotado ? 'Agotado' : 'Agregar al carrito'}
          </Boton>
          {mensajeOk && (
            <Boton variante="borde" completo={true} alHacerClic={alIrAlCarrito}>
              Ver carrito
            </Boton>
          )}
          <Boton variante="texto" completo={true} alHacerClic={alVolver}>
            Volver a los eventos
          </Boton>
        </aside>
      </form>
    </section>
  )
}

export default PaginaDetalle
