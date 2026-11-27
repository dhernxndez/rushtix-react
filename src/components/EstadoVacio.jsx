import Boton from './Boton'

// mensaje para cuando no hay nada que mostrar (carrito vacio, sin resultados); el boton es opcional
function EstadoVacio({ titulo, mensaje, textoBoton, alBoton }) {
  return (
    <div className="vacio" role="status">
      <span className="vacio-cero" aria-hidden="true">0</span>
      <h2>{titulo}</h2>
      <p>{mensaje}</p>
      {/* el boton solo aparece si la pagina manda la funcion alBoton */}
      {alBoton && (
        <Boton variante="borde" alHacerClic={alBoton}>
          {textoBoton}
        </Boton>
      )}
    </div>
  )
}

export default EstadoVacio
