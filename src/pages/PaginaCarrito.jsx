import Boton from '../components/Boton'
import Pasos from '../components/Pasos'
import ResumenCarrito from '../components/ResumenCarrito'
import ResumenCompra from '../components/ResumenCompra'

function PaginaCarrito({ items, alQuitar, alCambiarCantidad, alVaciar, alSeguirComprando, alContinuar }) {
  return (
    <section>
      <Pasos actual={2} />
      <p className="kicker">Paso 2 de 4</p>
      <h1 className="titulo-hero">Tu carrito</h1>
      <p className="subtitulo">Revisá cantidades. Podés quitar un boleto antes de pagar.</p>

      <div className="dos-columnas">
        <div className="columna-principal">
          <ResumenCarrito
            items={items}
            alQuitar={alQuitar}
            alCambiarCantidad={alCambiarCantidad}
            alSeguirComprando={alSeguirComprando}
          />
        </div>

        {items.length > 0 && (
          <ResumenCompra titulo="Resumen de compra" items={items}>
            <Boton completo={true} alHacerClic={alContinuar}>
              Continuar al pago
            </Boton>
            <Boton variante="borde" completo={true} alHacerClic={alSeguirComprando}>
              Seguir comprando
            </Boton>
            <Boton variante="texto" completo={true} alHacerClic={alVaciar}>
              Vaciar carrito
            </Boton>
          </ResumenCompra>
        )}
      </div>
    </section>
  )
}

export default PaginaCarrito
