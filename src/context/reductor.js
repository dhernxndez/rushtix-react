// reductor del estado global: carrito y sesion
import { leerGuardado } from '../utils/almacenamiento'

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

export function reductor(estado, accion) {
  switch (accion.tipo) {
    case 'carrito/agregar': {
      const nuevo = accion.item
      let existe = false
      let copia = []
      for (let i = 0; i < estado.carrito.length; i++) {
        const actual = estado.carrito[i]
        if (actual.eventoId === nuevo.eventoId && actual.zonaId === nuevo.zonaId) {
          existe = true
          let cantidad = actual.cantidad + nuevo.cantidad
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
      const copia = estado.carrito.filter(
        (i) => !(i.eventoId === accion.eventoId && i.zonaId === accion.zonaId)
      )
      return { carrito: copia, sesion: estado.sesion }
    }

    case 'carrito/vaciar':
      return { carrito: [], sesion: estado.sesion }

    case 'sesion/entrar':
      return { carrito: estado.carrito, sesion: accion.usuario }

    case 'sesion/salir':
      return { carrito: estado.carrito, sesion: null }

    default:
      return estado
  }
}