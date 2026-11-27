import { leer } from './base'

// lista de eventos (signal sirve para cancelar la peticion)
export function listarEventos(signal) {
  return leer((base) => base.eventos, signal)
}

export function obtenerEvento(id, signal) {
  return leer((base) => {
    const evento = base.eventos.find((e) => e.id === Number(id))
    if (!evento) {
      throw new Error('No encontramos ese evento.')
    }
    return evento
  }, signal)
}