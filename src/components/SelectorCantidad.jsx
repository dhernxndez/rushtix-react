// cantidad con botones - y + (también se puede escribir el número)
function SelectorCantidad({ cantidad, maximo, alCambiar, id = 'cantidad', etiqueta = 'Cantidad' }) {
  return (
    <div className="campo-cantidad">
      <label htmlFor={id} className="etiqueta-campo">
        {etiqueta} (máximo {maximo})
      </label>
      <div className="cantidad">
        <button type="button" onClick={() => alCambiar(cantidad - 1)} disabled={cantidad <= 1} aria-label="Restar un boleto">
          −
        </button>
        <input
          id={id}
          type="number"
          min="1"
          max={maximo}
          value={cantidad}
          onChange={(e) => alCambiar(Number(e.target.value))}
        />
        <button type="button" onClick={() => alCambiar(cantidad + 1)} disabled={cantidad >= maximo} aria-label="Sumar un boleto">
          +
        </button>
      </div>
    </div>
  )
}

export default SelectorCantidad
