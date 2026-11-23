// formato de precios y fechas
export function formatearPrecio(valor) {
  return '$' + valor.toFixed(2)
}

export function formatearFecha(texto) {
  const fecha = new Date(texto)
  return fecha.toLocaleDateString('es-SV', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatearHora(texto) {
  const fecha = new Date(texto)
  return fecha.toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit' })
}

const dias = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']
const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

// ejemplo: SÁB 25 OCT · 8PM
export function formatearFechaCorta(texto) {
  const fecha = new Date(texto)
  let hora = fecha.getHours() % 12
  if (hora === 0) {
    hora = 12
  }
  let minutos = ''
  if (fecha.getMinutes() !== 0) {
    minutos = ':' + String(fecha.getMinutes()).padStart(2, '0')
  }
  const sufijo = fecha.getHours() < 12 ? 'AM' : 'PM'
  return dias[fecha.getDay()] + ' ' + fecha.getDate() + ' ' + meses[fecha.getMonth()] + ' · ' + hora + minutos + sufijo
}
