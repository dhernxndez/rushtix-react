import { leer } from './base'

// lista de eventos (signal sirve para cancelar la peticion)
export function listarEventos(signal) {
  return leer((base) => base.eventos, signal)
}

// busca un evento por id (el id de la url llega como texto, por eso Number)
export function obtenerEvento(id, signal) {
  return leer((base) => {
    const evento = base.eventos.find((e) => e.id === Number(id))
    if (!evento) {
      throw new Error('No encontramos ese evento.')
    }
    return evento
  }, signal)
}