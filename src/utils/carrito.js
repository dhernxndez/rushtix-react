// totales del carrito: subtotal, cargos de servicio (5 %) y total
export function calcularTotales(items) {
  let subtotal = 0
  for (let i = 0; i < items.length; i++) {
    subtotal = subtotal + items[i].precio * items[i].cantidad
  }
  const cargos = subtotal * 0.05
  return { subtotal: subtotal, cargos: cargos, total: subtotal + cargos }
}
