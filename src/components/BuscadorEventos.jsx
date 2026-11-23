function BuscadorEventos({ texto, alCambiar }) {
  return (
    <div className="buscador">
      <label htmlFor="buscador" className="etiqueta-campo">
        Buscar eventos
      </label>
      <div className="buscador-campo">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" />
          <line x1="12.5" y1="12.5" x2="16" y2="16" stroke="currentColor" strokeWidth="2" />
        </svg>
        <input
          id="buscador"
          type="search"
          value={texto}
          placeholder="Nombre, lugar o categoría"
          onChange={(e) => alCambiar(e.target.value)}
        />
      </div>
    </div>
  )
}

export default BuscadorEventos
