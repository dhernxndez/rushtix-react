import { leer, mutar } from './base'

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

// reportes de ventas: ventas por evento, boletos por zona y boletos por semana
// solo cuentan las ordenes pagadas
export function obtenerReportes(signal) {
  return leer((base) => {
    const eventos = []
    for (let i = 0; i < base.eventos.length; i++) {
      const evento = base.eventos[i]
      let boletos = 0
      let ingresos = 0
      // se suman los items de cada orden que sean de este evento
      for (let o = 0; o < base.ordenes.length; o++) {
        const orden = base.ordenes[o]
        if (orden.estado !== 'pagada') {
          continue
        }
        for (let j = 0; j < orden.items.length; j++) {
          if (orden.items[j].eventoId === evento.id) {
            boletos = boletos + orden.items[j].cantidad
            ingresos = ingresos + orden.items[j].precio * orden.items[j].cantidad
          }
        }
      }
      // capacidad = lo que queda + lo que ya se vendio
      let disponibles = 0
      for (let z = 0; z < evento.zonas.length; z++) {
        disponibles = disponibles + evento.zonas[z].disponibles
      }
      const capacidad = disponibles + boletos
      let ocupacion = 0
      if (capacidad > 0) {
        ocupacion = Math.round((boletos / capacidad) * 100)
      }
      eventos.push({
        id: evento.id,
        nombre: evento.nombre,
        titulo: evento.titulo,
        boletos: boletos,
        ingresos: ingresos,
        ocupacion: ocupacion,
      })
    }

    // boletos vendidos por zona (se cuentan los boletos emitidos)
    const zonas = []
    for (let b = 0; b < base.boletos.length; b++) {
      const nombreZona = base.boletos[b].nombreZona
      const existente = zonas.find((z) => z.nombre === nombreZona)
      if (existente) {
        existente.boletos = existente.boletos + 1
      } else {
        zonas.push({ nombre: nombreZona, boletos: 1 })
      }
    }

    // boletos por semana: la semana 1 empieza con la primera orden
    const semanas = []
    if (base.ordenes.length > 0) {
      const inicio = new Date(base.ordenes[0].fecha).getTime()
      const semanaEnMs = 7 * 24 * 60 * 60 * 1000
      for (let o = 0; o < base.ordenes.length; o++) {
        const numero = Math.floor((new Date(base.ordenes[o].fecha).getTime() - inicio) / semanaEnMs)
        // si faltan semanas intermedias se rellenan con 0
        while (semanas.length <= numero) {
          semanas.push({ nombre: 'S' + (semanas.length + 1), boletos: 0 })
        }
        for (let j = 0; j < base.ordenes[o].items.length; j++) {
          semanas[numero].boletos = semanas[numero].boletos + base.ordenes[o].items[j].cantidad
        }
      }
    }

    return { eventos: eventos, zonas: zonas, semanas: semanas }
  }, signal)
}

// el usuario que se muestra en la tabla no lleva la clave
function usuarioParaTabla(usuario) {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    rol: usuario.rol,
    // los usuarios de ejemplo no traen "activo": se toman como activos
    activo: usuario.activo !== false,
  }
}

export function listarUsuarios(signal) {
  return leer((base) => base.usuarios.map(usuarioParaTabla), signal)
}

// cambia el rol en este orden: cliente -> organizador -> admin -> cliente
export function cambiarRolUsuario(id) {
  return mutar((base) => {
    const usuario = base.usuarios.find((u) => u.id === id)
    if (!usuario) {
      throw new Error('No existe ese usuario.')
    }
    const roles = ['cliente', 'organizador', 'admin']
    const siguiente = (roles.indexOf(usuario.rol) + 1) % roles.length
    usuario.rol = roles[siguiente]
    return usuarioParaTabla(usuario)
  })
}

// activa o desactiva la cuenta (una cuenta desactivada no puede iniciar sesion)
export function alternarUsuarioActivo(id) {
  return mutar((base) => {
    const usuario = base.usuarios.find((u) => u.id === id)
    if (!usuario) {
      throw new Error('No existe ese usuario.')
    }
    usuario.activo = usuario.activo === false
    return usuarioParaTabla(usuario)
  })
}