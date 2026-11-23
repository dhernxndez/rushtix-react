const pasos = ['Selección', 'Carrito', 'Pago', 'Confirmación']

// indicador de los 4 pasos de compra; actual va de 1 a 4
function Pasos({ actual }) {
  return (
    <nav aria-label="Pasos de la compra">
      <ol className="pasos">
        {pasos.map((nombre, indice) => {
          const numero = indice + 1
          let clase = 'paso'
          if (numero < actual) {
            clase = 'paso paso-hecho'
          } else if (numero === actual) {
            clase = 'paso paso-actual'
          }
          return (
            <li key={nombre} className={clase} aria-current={numero === actual ? 'step' : undefined}>
              <span className="paso-numero">{numero}</span>
              <span className="paso-nombre">{nombre}</span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Pasos
