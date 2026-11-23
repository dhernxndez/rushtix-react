import Boton from './Boton'
import { formatearFechaCorta } from '../utils/formato'

function TarjetaEvento({ evento, alVerDetalle }) {
  let precioDesde = evento.zonas[0].precio
  for (let i = 1; i < evento.zonas.length; i++) {
    if (evento.zonas[i].precio < precioDesde) {
      precioDesde = evento.zonas[i].precio
    }
  }
  const agotado = evento.estado === 'Agotado'

  // el color del sticker depende del estado del evento
  let claseSticker = 'sticker'
  if (agotado) {
    claseSticker = 'sticker sticker-agotado'
  } else if (evento.estado === 'Últimas entradas') {
    claseSticker = 'sticker sticker-ultimas'
  }

  return (
    <article className={agotado ? 'tarjeta tarjeta-agotada' : 'tarjeta'}>
      <div
        className="tarjeta-imagen"
        style={{ backgroundColor: evento.color, color: evento.colorTexto }}
        role="img"
        aria-label={'Ilustración del evento ' + evento.nombre}
      >
        <span className={claseSticker}>{evento.estado}</span>
        <span className="tarjeta-titulo-grande">{evento.titulo}</span>
      </div>
      <div className="tarjeta-cuerpo">
        <p className="tarjeta-categoria">
          {evento.categoria} · {evento.lugar}
        </p>
        <h3>{evento.nombre}</h3>
        <div className="tarjeta-datos">
          <span className="tarjeta-fecha">{formatearFechaCorta(evento.fecha)}</span>
          <span className="tarjeta-precio">${precioDesde}</span>
        </div>
        {agotado ? (
          <Boton variante="agotado" completo={true} deshabilitado={true}>
            Agotado
          </Boton>
        ) : (
          <Boton completo={true} alHacerClic={() => alVerDetalle(evento.id)}>
            Comprar — ${precioDesde}
          </Boton>
        )}
      </div>
    </article>
  )
}

export default TarjetaEvento
