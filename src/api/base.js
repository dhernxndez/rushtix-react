// "base de datos" falsa guardada en localStorage
// todas las pantallas piden los datos con leer() o mutar(), nunca tocan localStorage directo
import { eventos } from '../data/eventos'
import { usuarios } from '../data/usuarios'
import { leerGuardado, guardar } from '../utils/almacenamiento'

const CLAVE_BASE = 'rushtix-base'
const ESPERA_LECTURA = 500
const ESPERA_ESCRITURA = 700

function copiar(valor) {
  return JSON.parse(JSON.stringify(valor))
}

function errorCancelado() {
  return new DOMException('Peticion cancelada', 'AbortError')
}

// espera unos milisegundos y se puede cancelar con un AbortController
function esperar(ms, signal) {
  return new Promise((resolver, rechazar) => {
    if (signal && signal.aborted) {
      rechazar(errorCancelado())
      return
    }
    const temporizador = setTimeout(resolver, ms)
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(temporizador)
        rechazar(errorCancelado())
      })
    }
  })
}

// si no hay base guardada, se crea con los datos de ejemplo
function obtenerBase() {
  const guardada = leerGuardado(CLAVE_BASE, null)
  if (guardada !== null) {
    return guardada
  }
  const nueva = { eventos: copiar(eventos), usuarios: copiar(usuarios), ordenes: [], boletos: [] }
  guardar(CLAVE_BASE, nueva)
  return nueva
}

// para probar el estado de error: localStorage.setItem('rushtix-simular-error', 'true')
function revisarErrorSimulado() {
  if (leerGuardado('rushtix-simular-error', false) === true) {
    throw new Error('No se pudo conectar con el servidor. Intenta de nuevo.')
  }
}

// lectura: espera, lee y devuelve una copia (no guarda nada)
export async function leer(lector, signal) {
  await esperar(ESPERA_LECTURA, signal)
  revisarErrorSimulado()
  const base = obtenerBase()
  return copiar(lector(base))
}

// escritura: espera, cambia la base, la guarda y devuelve una copia
// si el mutador lanza un error, no se guarda nada
export async function mutar(mutador) {
  await esperar(ESPERA_ESCRITURA)
  revisarErrorSimulado()
  const base = obtenerBase()
  const resultado = mutador(base)
  guardar(CLAVE_BASE, base)
  return copiar(resultado)
}