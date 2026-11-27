// descarga un archivo CSV con las filas que se le pasen
// filas es una lista de listas: la primera fila es el encabezado
export function descargarCsv(nombreArchivo, filas) {
  const texto = filas.map((fila) => fila.join(',')).join('\n')
  // el Blob es el "archivo" en memoria y el enlace falso lo descarga
  const archivo = new Blob([texto], { type: 'text/csv;charset=utf-8' })
  const enlace = document.createElement('a')
  enlace.href = URL.createObjectURL(archivo)
  enlace.download = nombreArchivo
  enlace.click()
  URL.revokeObjectURL(enlace.href)
}