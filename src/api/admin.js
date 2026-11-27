import { leer } from './base'

// resumen para el panel admin: cada evento con sus vendidos y los totales
// todo sale de una sola lectura, asi el dashboard espera una sola respuesta
export function obtenerResumenAdmin(signal) {
  return leer((base) => {
    let boletosVendidos = 0
    let capacidadTotal = 0
    let ingresos = 0
    let eventosActivos = 0

    // solo cuentan las ordenes pagadas
    for (let i = 0; i < base.ordenes.length; i++) {
      if (base.ordenes[i].estado === 'pagada') {
        ingresos = ingresos + base.ordenes[i].total
      }
    }

    const eventos = []
    for (let i = 0; i < base.eventos.length; i++) {
      const evento = base.eventos[i]
      // vendidos = boletos emitidos para este evento
      let vendidos = 0
      for (let b = 0; b < base.boletos.length; b++) {
        if (base.boletos[b].eventoId === evento.id) {
          vendidos = vendidos + 1
        }
      }
      // capacidad = lo que queda + lo que ya se vendio
      let disponibles = 0
      for (let z = 0; z < evento.zonas.length; z++) {
        disponibles = disponibles + evento.zonas[z].disponibles
      }
      const capacidad = disponibles + vendidos

      boletosVendidos = boletosVendidos + vendidos
      capacidadTotal = capacidadTotal + capacidad
      if (evento.estado !== 'Borrador' && evento.estado !== 'Finalizado') {
        eventosActivos = eventosActivos + 1
      }
      eventos.push({ ...evento, vendidos: vendidos, capacidad: capacidad })
    }

    let ocupacion = 0
    if (capacidadTotal > 0) {
      ocupacion = Math.round((boletosVendidos / capacidadTotal) * 100)
    }

    return {
      eventos: eventos,
      boletosVendidos: boletosVendidos,
      ingresos: ingresos,
      eventosActivos: eventosActivos,
      ocupacion: ocupacion,
    }
  }, signal)
}
