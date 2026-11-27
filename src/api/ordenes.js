import { leer, mutar } from './base'
import { calcularTotales } from '../utils/carrito'

// crea la orden, descuenta los lugares y emite un boleto por cada entrada
// si algo falla, no se guarda nada
export function crearOrden(usuarioId, items, metodoPago) {
  return mutar((base) => {
    if (items.length === 0) {
      throw new Error('El carrito esta vacio.')
    }
    const usuario = base.usuarios.find((u) => u.id === usuarioId)
    if (!usuario) {
      throw new Error('Debes iniciar sesion para comprar.')
    }

    // OJO: primero se revisa todo y despues se cambia, asi nunca queda una compra a medias
    // primero se revisa que alcance para todo
    for (let i = 0; i < items.length; i++) {
      const evento = base.eventos.find((e) => e.id === items[i].eventoId)
      const zona = evento ? evento.zonas.find((z) => z.id === items[i].zonaId) : null
      if (!zona) {
        throw new Error('Una de las entradas ya no existe.')
      }
      if (zona.disponibles < items[i].cantidad) {
        throw new Error('Ya no quedan suficientes entradas en ' + items[i].nombreEvento + ' (' + items[i].nombreZona + ').')
      }
    }

    const totales = calcularTotales(items)
    // el id de la orden sale de cuantas ordenes hay (O0001, O0002...)
    const ordenId = 'O' + String(base.ordenes.length + 1).padStart(4, '0')
    const boletos = []

    for (let i = 0; i < items.length; i++) {
      const evento = base.eventos.find((e) => e.id === items[i].eventoId)
      const zona = evento.zonas.find((z) => z.id === items[i].zonaId)
      // se descuentan los boletos disponibles de la zona
      zona.disponibles = zona.disponibles - items[i].cantidad
      // un boleto por cada unidad comprada
      for (let n = 0; n < items[i].cantidad; n++) {
        const boletoId = 'T' + String(base.boletos.length + boletos.length + 1).padStart(4, '0')
        boletos.push({
          id: boletoId,
          ordenId: ordenId,
          eventoId: evento.id,
          zonaId: zona.id,
          nombreZona: zona.nombre,
          titular: usuario.nombre,
          codigo: 'RT-' + ordenId + '-' + boletoId,
          // el QR solo lleva ids, nunca datos personales
          qr: 'RUSHTIX|ORDEN:' + ordenId + '|BOLETO:' + boletoId + '|EVENTO:' + evento.id,
          estado: 'valido',
        })
      }
    }

    const orden = {
      id: ordenId,
      usuarioId: usuarioId,
      items: items,
      subtotal: totales.subtotal,
      cargos: totales.cargos,
      total: totales.total,
      estado: 'pagada',
      metodoPago: metodoPago,
      fecha: new Date().toISOString(),
    }
    base.ordenes.push(orden)
    for (let i = 0; i < boletos.length; i++) {
      base.boletos.push(boletos[i])
    }
    return { orden: orden, boletos: boletos }
  })
}

// agrega al boleto los datos del evento para mostrarlo completo
function completarBoleto(base, boleto) {
  const evento = base.eventos.find((e) => e.id === boleto.eventoId)
  return {
    id: boleto.id,
    ordenId: boleto.ordenId,
    eventoId: boleto.eventoId,
    nombreZona: boleto.nombreZona,
    titular: boleto.titular,
    codigo: boleto.codigo,
    qr: boleto.qr,
    estado: boleto.estado,
    nombreEvento: evento ? evento.nombre : '',
    fecha: evento ? evento.fecha : '',
    lugar: evento ? evento.lugar : '',
  }
}

// boletos de un usuario (se buscan por la orden, no por el correo)
export function listarBoletosDeUsuario(usuarioId, signal) {
  return leer((base) => {
    const resultado = []
    for (let i = 0; i < base.boletos.length; i++) {
      const orden = base.ordenes.find((o) => o.id === base.boletos[i].ordenId)
      if (orden && orden.usuarioId === usuarioId) {
        resultado.push(completarBoleto(base, base.boletos[i]))
      }
    }
    return resultado
  }, signal)
}

// busca una orden por su id
export function obtenerOrden(ordenId, signal) {
  return leer((base) => {
    const orden = base.ordenes.find((o) => o.id === ordenId)
    if (!orden) {
      throw new Error('No encontramos esa orden.')
    }
    return orden
  }, signal)
}

// para la pantalla del admin: dice si un codigo existe y si ya se uso
export function verificarBoleto(codigo, signal) {
  return leer((base) => {
    const boleto = base.boletos.find((b) => b.codigo === codigo.trim() || b.qr === codigo.trim())
    if (!boleto) {
      return { valido: false, motivo: 'No existe ningun boleto con ese codigo.', boleto: null }
    }
    const completo = completarBoleto(base, boleto)
    if (boleto.estado !== 'valido') {
      return { valido: false, motivo: 'Este boleto ya fue usado.', boleto: completo }
    }
    return { valido: true, motivo: 'Boleto valido.', boleto: completo }
  }, signal)
}