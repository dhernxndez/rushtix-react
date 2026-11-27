// grafica de barras hecha con divs: la altura de cada barra es un porcentaje del valor mas grande
function GraficaBarras({ titulo, datos }) {
  let maximo = 1
  for (let i = 0; i < datos.length; i++) {
    if (datos[i].valor > maximo) {
      maximo = datos[i].valor
    }
  }

  return (
    <section className="grafica-marco">
      <h2 className="grafica-titulo">{titulo}</h2>
      {datos.length === 0 && <p className="texto-suave">Todavía no hay ventas para mostrar.</p>}
      <div className="grafica">
        {datos.map((dato) => (
          <div className="grafica-columna" key={dato.etiqueta}>
            <span className="grafica-valor">{dato.valor}</span>
            <div className="grafica-barra" style={{ height: (dato.valor / maximo) * 100 + '%' }} />
            <span className="grafica-etiqueta">{dato.etiqueta}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default GraficaBarras