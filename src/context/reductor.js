// reductor del estado global: carrito y sesion
import { leerGuardado } from '../utils/almacenamiento'

// maximo de boletos que se pueden comprar por zona
const MAXIMO_POR_ZONA = 8

// el estado inicial se lee de localStorage
export function crearEstadoInicial() {
  return {
    carrito: leerGuardado('rushtix-carrito', []),
    sesion: leerGuardado('rushtix-sesion', null),
  }
}

// copia un item del carrito cambiando solo la cantidad
function copiarConCantidad(item, cantidad) {
  return {
    eventoId: item.eventoId,
    zonaId: item.zonaId,
    nombreEvento: item.nombreEvento,
    nombreZona: item.nombreZona,
    fecha: item.fecha,
    precio: item.precio,
    cantidad: cantidad,
  }
}

// recibe el estado actual y una accion, y devuelve el estado nuevo
// OJO: nunca se modifica el estado directo, siempre se devuelve una copia
export function reductor(estado, accion) {
  // el tipo de la accion dice que cambio hacer
  switch (accion.tipo) {
    case 'carrito/agregar': {
      // si la zona ya esta en el carrito se suma la cantidad, si no se agrega como item nuevo
      const nuevo = accion.item
      let existe = false
      let copia = []
      for (let i = 0; i < estado.carrito.length; i++) {
        const actual = estado.carrito[i]
        if (actual.eventoId === nuevo.eventoId && actual.zonaId === nuevo.zonaId) {
          existe = true
          let cantidad = actual.cantidad + nuevo.cantidad
          // no se deja pasar del maximo
          if (cantidad > MAXIMO_POR_ZONA) {
            cantidad = MAXIMO_POR_ZONA
          }
          copia = copia.concat([copiarConCantidad(actual, cantidad)])
        } else {
          copia = copia.concat([actual])
        }
      }
      if (!existe) {
        copia = copia.concat([nuevo])
      }
      return { carrito: copia, sesion: estado.sesion }
    }

    case 'carrito/cambiar': {
      // cambia la cantidad de un item (la del selector + y -)
      if (accion.cantidad < 1 || accion.cantidad > MAXIMO_POR_ZONA) {
        return estado
      }
      let copia = []
      for (let i = 0; i < estado.carrito.length; i++) {
        const actual = estado.carrito[i]
        if (actual.eventoId === accion.eventoId && actual.zonaId === accion.zonaId) {
          copia = copia.concat([copiarConCantidad(actual, accion.cantidad)])
        } else {
          copia = copia.concat([actual])
        }
      }
      return { carrito: copia, sesion: estado.sesion }
    }

    case 'carrito/quitar': {
      // filter deja todos los items menos el que coincide con evento y zona
      const copia = estado.carrito.filter(
        (i) => !(i.eventoId === accion.eventoId && i.zonaId === accion.zonaId)
      )
      return { carrito: copia, sesion: estado.sesion }
    }

    case 'carrito/vaciar':
      // lo usa el boton Vaciar carrito y tambien se llama despues de pagar
      return { carrito: [], sesion: estado.sesion }

    case 'sesion/entrar':
      // guarda el usuario que devolvio el login
      return { carrito: estado.carrito, sesion: accion.usuario }

    case 'sesion/salir':
      return { carrito: estado.carrito, sesion: null }

    // si la accion no existe no pasa nada
    default:
      return estado
  }
}