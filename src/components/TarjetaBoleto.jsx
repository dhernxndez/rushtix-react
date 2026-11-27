import QRCode from 'react-qr-code'
import { formatearFechaCorta } from '../utils/formato'
import '../estilos/boletos.css'

// boleto electronico: datos del evento a la izquierda y el QR a la derecha
function TarjetaBoleto({ boleto }) {
  return (
    <article className="boleto">
      <div className="boleto-info">
        <p className="kicker">Boleto electrónico</p>
        <h3>{boleto.nombreEvento}</h3>
        <p className="texto-suave">{formatearFechaCorta(boleto.fecha)}</p>
        <p className="texto-suave">{boleto.lugar}</p>
        <dl className="boleto-datos">
          <div>
            <dt>Zona</dt>
            <dd>{boleto.nombreZona}</dd>
          </div>
          <div>
            <dt>Titular</dt>
            <dd>{boleto.titular}</dd>
          </div>
          <div>
            <dt>Código</dt>
            <dd>{boleto.codigo}</dd>
          </div>
        </dl>
      </div>
      <div className="boleto-qr">
        <div className="boleto-qr-caja" role="img" aria-label={'Código QR del boleto ' + boleto.codigo}>
          <QRCode value={boleto.qr} size={132} />
        </div>
        <small>Presenta este código en el acceso.</small>
      </div>
    </article>
  )
}

export default TarjetaBoleto