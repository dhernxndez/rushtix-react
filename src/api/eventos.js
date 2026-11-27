import { leer, mutar } from './base'

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
// ---- administracion de eventos (panel admin) ----

// estados que puede tener un evento; los borradores y finalizados no se ven en el sitio
export const estadosEvento = ['Disponible', 'Últimas entradas', 'Agotado', 'Borrador', 'Finalizado']

// al crear un evento se le ponen tres zonas por defecto (precio y cupo se cambian en inventario)
function zonasPorDefecto() {
  return [
    { id: 'gen', nombre: 'General', precio: 15, disponibles: 100 },
    { id: 'pre', nombre: 'Preferente', precio: 30, disponibles: 50 },
    { id: 'vip', nombre: 'VIP', precio: 60, disponibles: 20 },
  ]
}

// crea un evento nuevo con el id siguiente y las zonas por defecto
export function crearEvento(datos) {
  return mutar((base) => {
    let mayorId = 0
    for (let i = 0; i < base.eventos.length; i++) {
      if (base.eventos[i].id > mayorId) {
        mayorId = base.eventos[i].id
      }
    }
    const nuevo = {
      id: mayorId + 1,
      nombre: datos.nombre.trim(),
      titulo: datos.nombre.trim(),
      categoria: datos.categoria,
      fecha: datos.fecha,
      lugar: datos.lugar.trim(),
      estado: datos.estado,
      color: '#5e35ff',
      colorTexto: '#ffffff',
      descripcion: '',
      zonas: zonasPorDefecto(),
    }
    base.eventos.push(nuevo)
    return nuevo
  })
}

// cambia los datos generales de un evento (las zonas no se tocan aqui)
export function editarEvento(id, datos) {
  return mutar((base) => {
    const evento = base.eventos.find((e) => e.id === Number(id))
    if (!evento) {
      throw new Error('No encontramos ese evento.')
    }
    evento.nombre = datos.nombre.trim()
    evento.titulo = datos.nombre.trim()
    evento.categoria = datos.categoria
    evento.fecha = datos.fecha
    evento.lugar = datos.lugar.trim()
    evento.estado = datos.estado
    return evento
  })
}

// borra un evento y sus zonas
export function eliminarEvento(id) {
  return mutar((base) => {
    const posicion = base.eventos.findIndex((e) => e.id === Number(id))
    if (posicion === -1) {
      throw new Error('No encontramos ese evento.')
    }
    base.eventos.splice(posicion, 1)
    return { id: Number(id) }
  })
}
