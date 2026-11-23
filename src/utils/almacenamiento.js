// leer y guardar en localStorage
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
