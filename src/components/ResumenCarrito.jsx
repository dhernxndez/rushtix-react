import Boton from './Boton'
import EstadoVacio from './EstadoVacio'
import { formatearPrecio, formatearFechaCorta } from '../utils/formato'

// lista de boletos del carrito, con cantidad editable y botón Quitar
function ResumenCarrito({ items, alQuitar, alCambiarCantidad, alSeguirComprando }) {
  if (items.length === 0) {
    return (
      <EstadoVacio
        titulo="Tu carrito está vacío"
        mensaje="Elegí un evento para empezar."
        textoBoton="Ver eventos"
        alBoton={alSeguirComprando}
      />
    )
  }

  return (
    <ul className="carrito-lista">
      {items.map((item) => (
        <li key={item.eventoId + '-' + item.zonaId} className="carrito-item">
          <div className="carrito-info">
            <h3>{item.nombreEvento}</h3>
            <p className="carrito-detalle">
              {item.nombreZona}
              {item.fecha ? ' · ' + formatearFechaCorta(item.fecha) : ''}
            </p>
          </div>
          <div className="cantidad">
            <button
              type="button"
              onClick={() => alCambiarCantidad(item.eventoId, item.zonaId, item.cantidad - 1)}
              disabled={item.cantidad <= 1}
              aria-label={'Restar un boleto de ' + item.nombreEvento}
            >
              −
            </button>
            <span className="cantidad-valor" aria-live="polite">{item.cantidad}</span>
            <button
              type="button"
              onClick={() => alCambiarCantidad(item.eventoId, item.zonaId, item.cantidad + 1)}
              disabled={item.cantidad >= 8}
              aria-label={'Sumar un boleto de ' + item.nombreEvento}
            >
              +
            </button>
          </div>
          <span className="carrito-precio">{formatearPrecio(item.precio * item.cantidad)}</span>
          <Boton variante="texto" tamano="s" alHacerClic={() => alQuitar(item.eventoId, item.zonaId)}>
            Quitar
          </Boton>
        </li>
      ))}
    </ul>
  )
}

export default ResumenCarrito
