import Boton from './Boton'

function EstadoVacio({ titulo, mensaje, textoBoton, alBoton }) {
  return (
    <div className="vacio" role="status">
      <span className="vacio-cero" aria-hidden="true">0</span>
      <h2>{titulo}</h2>
      <p>{mensaje}</p>
      {alBoton && (
        <Boton variante="borde" alHacerClic={alBoton}>
          {textoBoton}
        </Boton>
      )}
    </div>
  )
}

export default EstadoVacio
