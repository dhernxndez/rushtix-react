import { useContext } from 'react'
import { AppContext } from './contexto'

// hook interno: lee el contexto y avisa si se usa fuera del provider
function useApp() {
  const valor = useContext(AppContext)
  if (valor === null) {
    throw new Error('Este hook se usa dentro de AppProvider')
  }
  return valor
}

// carrito: lista de items y las acciones para cambiarla
export function useCarrito() {
  const { estado, dispatch } = useApp()

  // total de boletos, es el numero que sale en el header
  let cantidadTotal = 0
  for (let i = 0; i < estado.carrito.length; i++) {
    cantidadTotal = cantidadTotal + estado.carrito[i].cantidad
  }

  // cada funcion solo manda una accion al reductor con dispatch
  function agregar(item) {
    dispatch({ tipo: 'carrito/agregar', item: item })
  }

  function cambiarCantidad(eventoId, zonaId, cantidad) {
    dispatch({ tipo: 'carrito/cambiar', eventoId: eventoId, zonaId: zonaId, cantidad: cantidad })
  }

  function quitar(eventoId, zonaId) {
    dispatch({ tipo: 'carrito/quitar', eventoId: eventoId, zonaId: zonaId })
  }

  function vaciar() {
    dispatch({ tipo: 'carrito/vaciar' })
  }

  return {
    items: estado.carrito,
    cantidadTotal: cantidadTotal,
    agregar: agregar,
    cambiarCantidad: cambiarCantidad,
    quitar: quitar,
    vaciar: vaciar,
  }
}

// sesion: usuario actual (null si no hay) y las acciones para entrar y salir
export function useSesion() {
  const { estado, dispatch } = useApp()

  function entrar(usuario) {
    dispatch({ tipo: 'sesion/entrar', usuario: usuario })
  }

  function salir() {
    dispatch({ tipo: 'sesion/salir' })
  }

  return { usuario: estado.sesion, entrar: entrar, salir: salir }
}