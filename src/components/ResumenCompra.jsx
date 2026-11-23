import { formatearPrecio } from '../utils/formato'
import { calcularTotales } from '../utils/carrito'

// cuadro con subtotal, cargos y total; los botones llegan como children
function ResumenCompra({ titulo, items, children }) {
  const totales = calcularTotales(items)
  return (
    <aside className="resumen-compra" aria-label={titulo}>
      <h2>{titulo}</h2>
      <dl className="resumen-filas">
        <div>
          <dt>Subtotal</dt>
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
      {children}
    </aside>
  )
}

export default ResumenCompra
