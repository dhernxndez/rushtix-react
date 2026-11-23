import TarjetaEvento from './TarjetaEvento'
import EstadoVacio from './EstadoVacio'

function ListaEventos({ eventos, alVerDetalle, alLimpiar }) {
  if (eventos.length === 0) {
    return (
      <EstadoVacio
        titulo="No encontramos eventos con esos filtros"
        mensaje="Probá con otra búsqueda o categoría."
        textoBoton="Limpiar filtros"
        alBoton={alLimpiar}
      />
    )
  }

  return (
    <div className="lista-eventos">
      {eventos.map((evento) => (
        <TarjetaEvento key={evento.id} evento={evento} alVerDetalle={alVerDetalle} />
      ))}
    </div>
  )
}

export default ListaEventos
