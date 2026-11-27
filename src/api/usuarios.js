import { leer, mutar } from './base'

// el usuario que se devuelve no lleva la clave
function sinClave(usuario) {
  return { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol }
}

export function iniciarSesion(correo, clave) {
  return leer((base) => {
    const usuario = base.usuarios.find((u) => u.correo === correo.trim().toLowerCase())
    if (!usuario || usuario.clave !== clave) {
      throw new Error('Correo o contrasena incorrectos.')
    }
    return sinClave(usuario)
  })
}

export function registrarUsuario(datos) {
  return mutar((base) => {
    const correo = datos.correo.trim().toLowerCase()
    const repetido = base.usuarios.find((u) => u.correo === correo)
    if (repetido) {
      throw new Error('Ya existe una cuenta con ese correo.')
    }
    const nuevo = {
      id: base.usuarios.length + 1,
      nombre: datos.nombre.trim(),
      correo: correo,
      clave: datos.clave,
      rol: 'cliente',
    }
    base.usuarios.push(nuevo)
    return sinClave(nuevo)
  })
}