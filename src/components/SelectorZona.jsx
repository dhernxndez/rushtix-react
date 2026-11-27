import { formatearPrecio } from '../utils/formato'

// zonas como botones de radio: solo se puede elegir una y las agotadas quedan deshabilitadas
function SelectorZona({ zonas, zonaElegida, alElegir }) {
  return (
    <fieldset className="zonas">
      <legend className="etiqueta-campo">Zona</legend>
      {zonas.map((zona) => {
        // una zona sin lugares disponibles no se puede elegir
        const agotada = zona.disponibles === 0
        // la clase cambia segun si la zona esta elegida o agotada
        let clase = 'zona'
        if (zonaElegida === zona.id) {
          clase = 'zona zona-elegida'
        } else if (agotada) {
          clase = 'zona zona-agotada'
        }
        return (
          <label key={zona.id} className={clase}>
            <input
              type="radio"
              name="zona"
              value={zona.id}
              checked={zonaElegida === zona.id}
              disabled={agotada}
              onChange={() => alElegir(zona.id)}
            />
            <span className="zona-info">
              <span className="zona-nombre">{zona.nombre}</span>
              <span className="zona-disponibles">
                {agotada ? 'Sin disponibilidad' : 'Quedan ' + zona.disponibles + ' boletos'}
              </span>
            </span>
            {agotada && <span className="sticker sticker-agotado">Agotada</span>}
            <span className="zona-precio">{formatearPrecio(zona.precio)}</span>
          </label>
        )
      })}
    </fieldset>
  )
}

export default SelectorZona
