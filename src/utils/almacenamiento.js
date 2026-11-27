// leer y guardar en localStorage
// localStorage solo guarda texto, por eso se usa JSON.parse al leer y JSON.stringify al guardar
// el try/catch evita que la app se caiga si el navegador bloquea el almacenamiento
export function leerGuardado(clave, valorPorDefecto) {
  try {
    const texto = localStorage.getItem(clave)
    if (texto === null) {
      return valorPorDefecto
    }
    return JSON.parse(texto)
  } catch (error) {
    console.error('No se pudo leer', clave, error)
    return valorPorDefecto
  }
}

export function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor))
  } catch (error) {
    console.error('No se pudo guardar', clave, error)
  }
}
