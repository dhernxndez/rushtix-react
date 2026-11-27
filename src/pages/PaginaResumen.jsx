import Boton from '../components/Boton'
import Pasos from '../components/Pasos'
import EstadoVacio from '../components/EstadoVacio'
import ResumenCompra from '../components/ResumenCompra'
import { formatearFechaCorta } from '../utils/formato'

// D6: resumen de la compra antes de pagar (solo se lee, no se edita nada)
function PaginaResumen({ items, alVolverAlCarrito, alIrAPagar, alVerEventos }) {
  // sin boletos no hay nada que resumir
  if (items.length === 0) {
    return (
      <section>
        <Pasos actual={2} />
        <EstadoVacio
          titulo="Tu carrito está vacío"
          mensaje="Elegí un evento para empezar."
          textoBoton="Ver eventos"
          alBoton={alVerEventos}
        />
      </section>
    )
  }

  return (
    <section>
      <Pasos actual={2} />
      <p className="kicker">Antes de pagar</p>
      <h1 className="titulo-hero">Resumen de tu compra</h1>
      <p className="subtitulo">Verificá todo. En el siguiente paso pagás y recibís tu boleto con QR.</p>

      <div className="dos-columnas">
        <div className="columna-principal">
          {items.map((item) => (
            <div key={item.eventoId + '-' + item.zonaId} className="resumen-evento">
              <h2>{item.nombreEvento}</h2>
              <p className="texto-suave">
                {item.nombreZona} × {item.cantidad}
                {item.fecha ? ' · ' + formatearFechaCorta(item.fecha) : ''}
              </p>
            </div>
          ))}
        </div>

        <ResumenCompra titulo="Resumen de compra" items={items}>
          <Boton completo={true} alHacerClic={alIrAPagar}>
            Ir a pagar
          </Boton>
          <Boton variante="borde" completo={true} alHacerClic={alVolverAlCarrito}>
            Volver al carrito
          </Boton>
        </ResumenCompra>
      </div>
    </section>
  )
}

export default PaginaResumen