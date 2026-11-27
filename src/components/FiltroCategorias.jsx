// botones de categoria: el que coincide con "seleccionada" se ve activo
function FiltroCategorias({ categorias, seleccionada, alElegir }) {
  return (
    <div className="filtros" role="group" aria-label="Filtrar por categoría">
      {categorias.map((categoria) => (
        <button
          key={categoria}
          type="button"
          className={seleccionada === categoria ? 'filtro filtro-activo' : 'filtro'}
          // aria-pressed le dice al lector de pantalla cual boton esta activo
          aria-pressed={seleccionada === categoria}
          onClick={() => alElegir(categoria)}
        >
          {categoria}
        </button>
      ))}
    </div>
  )
}

export default FiltroCategorias
