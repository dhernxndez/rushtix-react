// tarjetas "esqueleto" mientras llegan los datos
function EstadoCarga({ mensaje = 'Cargando...' }) {
  return (
    <div role="status" aria-live="polite">
      <span className="solo-lectores">{mensaje}</span>
      <div className="lista-eventos" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <div key={n} className="esqueleto">
            <div className="esqueleto-barra esqueleto-imagen"></div>
            <div className="esqueleto-barra esqueleto-titulo"></div>
            <div className="esqueleto-barra esqueleto-linea"></div>
            <div className="esqueleto-barra esqueleto-boton"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EstadoCarga
