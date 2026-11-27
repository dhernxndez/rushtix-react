// etiqueta de color con el estado de un evento (se usa en las tablas del admin)
function EtiquetaEstado({ estado }) {
  let clase = 'estado-etiqueta estado-publicado'
  if (estado === 'Agotado') {
    clase = 'estado-etiqueta estado-agotado'
  } else if (estado === 'Últimas entradas') {
    clase = 'estado-etiqueta estado-ultimas'
  } else if (estado === 'Borrador') {
    clase = 'estado-etiqueta estado-borrador'
  } else if (estado === 'Finalizado') {
    clase = 'estado-etiqueta estado-finalizado'
  }
  return <span className={clase}>{estado}</span>
}

export default EtiquetaEstado
