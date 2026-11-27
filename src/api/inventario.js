import { leer, mutar } from './base'

// cuantos boletos se vendieron de una zona de un evento
function contarVendidos(base, eventoId, zonaId) {
  let vendidos = 0
  for (let i = 0; i < base.boletos.length; i++) {
    if (base.boletos[i].eventoId === eventoId && base.boletos[i].zonaId === zonaId) {
      vendidos = vendidos + 1
    }
  }
  return vendidos
}

// eventos con sus zonas: cupo, vendidos y precio de cada una
export function obtenerInventario(signal) {
  return leer((base) => {
    const lista = []
    for (let i = 0; i < base.eventos.length; i++) {
      const evento = base.eventos[i]
      const zonas = []
      for (let z = 0; z < evento.zonas.length; z++) {
        const zona = evento.zonas[z]
        const vendidos = contarVendidos(base, evento.id, zona.id)
        // cupo = lo que queda + lo que ya se vendio
        zonas.push({ id: zona.id, nombre: zona.nombre, precio: zona.precio, vendidos: vendidos, cupo: zona.disponibles + vendidos })
      }
      lista.push({ id: evento.id, nombre: evento.nombre, zonas: zonas })
    }
    return lista
  }, signal)
}

// guarda precio y cupo de las zonas de un evento
// el cupo no puede ser menor que lo ya vendido; si una zona falla, no se guarda nada
export function actualizarZonas(eventoId, cambios) {
  return mutar((base) => {
    const evento = base.eventos.find((e) => e.id === eventoId)
    if (!evento) {
      throw new Error('No encontramos ese evento.')
    }
    // primero se revisa todo
    for (let i = 0; i < cambios.length; i++) {
      const vendidos = contarVendidos(base, eventoId, cambios[i].id)
      if (cambios[i].cupo < vendidos) {
        throw new Error('El cupo de ' + cambios[i].nombre + ' no puede ser menor que lo vendido (' + vendidos + ').')
      }
    }
    // despues se aplica
    for (let i = 0; i < cambios.length; i++) {
      const zona = evento.zonas.find((z) => z.id === cambios[i].id)
      const vendidos = contarVendidos(base, eventoId, cambios[i].id)
      zona.precio = cambios[i].precio
      zona.disponibles = cambios[i].cupo - vendidos
    }
    return { id: eventoId }
  })
}
