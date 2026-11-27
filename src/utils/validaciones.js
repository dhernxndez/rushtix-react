// validaciones de los formularios: cada una devuelve '' si esta bien o el mensaje de error

export function validarCorreo(correo) {
  const texto = correo.trim()
  if (texto === '') {
    return 'Escribe tu correo.'
  }
  const formato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formato.test(texto)) {
    return 'Escribe un correo válido, por ejemplo nombre@correo.com.'
  }
  return ''
}

export function validarClave(clave) {
  if (clave === '') {
    return 'Escribe tu contraseña.'
  }
  return ''
}

export function validarNombreTarjeta(nombre) {
  if (nombre.trim().length < 3) {
    return 'Escribe el nombre como aparece en la tarjeta.'
  }
  return ''
}

// el numero puede llevar espacios, se quitan antes de revisar
export function validarNumeroTarjeta(numero) {
  const limpio = numero.replace(/\s/g, '')
  if (!/^\d{16}$/.test(limpio)) {
    return 'El número de tarjeta debe tener 16 dígitos.'
  }
  return ''
}

// formato MM/AA y que no este vencida
export function validarVencimiento(texto) {
  const partes = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(texto.trim())
  if (!partes) {
    return 'Escribe el vencimiento como MM/AA, por ejemplo 08/29.'
  }
  const mes = Number(partes[1])
  const anio = 2000 + Number(partes[2])
  const hoy = new Date()
  if (anio < hoy.getFullYear() || (anio === hoy.getFullYear() && mes < hoy.getMonth() + 1)) {
    return 'La tarjeta está vencida.'
  }
  return ''
}

export function validarCvv(cvv) {
  if (!/^\d{3,4}$/.test(cvv)) {
    return 'El código de seguridad tiene 3 o 4 dígitos.'
  }
  return ''
}

// true si algun campo tiene mensaje de error
export function hayErrores(errores) {
  const claves = Object.keys(errores)
  for (let i = 0; i < claves.length; i++) {
    if (errores[claves[i]] !== '') {
      return true
    }
  }
  return false
}