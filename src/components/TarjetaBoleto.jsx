import QRCode from 'react-qr-code'
import { formatearFechaCorta } from '../utils/formato'
import '../estilos/boletos.css'

// boleto con su QR (pantalla "Boleto con QR" del figma)
function TarjetaBoleto({ boleto }) {
  return (
    <article className="boleto">
      <h3>{boleto.nombreEvento}</h3>
      <p className="boleto-detalle">
        {boleto.nombreZona} × 1 · {formatearFechaCorta(boleto.fecha)}
      </p>
      {/* el QR solo lleva ids, nunca datos personales */}
      <div className="boleto-qr-caja" role="img" aria-label={'Código QR del boleto ' + boleto.codigo}>
        <QRCode value={boleto.qr} size={132} />
      </div>
      <p className="boleto-codigo">{boleto.codigo}</p>
      <small className="boleto-aviso">Presentá este QR en la entrada</small>
    </article>
  )
}

export default TarjetaBoleto