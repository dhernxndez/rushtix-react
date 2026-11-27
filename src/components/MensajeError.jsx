import Boton from './Boton'

// aviso de error con boton opcional para reintentar; role=alert hace que el lector de pantalla lo anuncie
function MensajeError({ mensaje, alReintentar }) {
  return (
    <div className="aviso-error" role="alert">
      <span className="aviso-punto" aria-hidden="true"></span>
      <p>{mensaje}</p>
      {alReintentar && (
        <Boton variante="borde" tamano="s" alHacerClic={alReintentar}>
          Reintentar
        </Boton>
      )}
    </div>
  )
}

export default MensajeError
