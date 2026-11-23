// simula una petición con espera para ver los estados de carga y error
import { eventos } from '../data/eventos'

export function pedirEventos(fallar = false) {
  return new Promise((resolver, rechazar) => {
    setTimeout(() => {
      if (fallar) {
        rechazar(new Error('No se pudieron cargar los eventos. Intenta de nuevo.'))
      } else {
        resolver(eventos)
      }
    }, 900)
  })
}
