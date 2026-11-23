import { formatearPrecio } from '../utils/formato'

function SelectorZona({ zonas, zonaElegida, alElegir }) {
  return (
    <fieldset className="zonas">
      <legend className="etiqueta-campo">Zona</legend>
      {zonas.map((zona) => {
        const agotada = zona.disponibles === 0
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
