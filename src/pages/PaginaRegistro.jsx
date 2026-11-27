import '../estilos/formularios.css'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import CampoFormulario from '../components/CampoFormulario'
import Boton from '../components/Boton'
import MensajeError from '../components/MensajeError'
import { registrarUsuario } from '../api/usuarios'
import { useSesion } from '../context/hooks'
import { validarCorreo, hayErrores } from '../utils/validaciones'

// registro de una cuenta nueva (siempre con rol cliente)
function PaginaRegistro() {
  const navegar = useNavigate()
  const sesion = useSesion()
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [confirmacion, setConfirmacion] = useState('')
  const [errores, setErrores] = useState({})
  const [errorEnvio, setErrorEnvio] = useState('')
  const [enviando, setEnviando] = useState(false)

  // revisa cada campo y devuelve los mensajes de error ('' si esta bien)
  function validar() {
    const nuevos = { nombre: '', correo: validarCorreo(correo), clave: '', confirmacion: '' }
    if (nombre.trim().length < 3) {
      nuevos.nombre = 'Escribe tu nombre (al menos 3 letras).'
    }
    if (clave.length < 6) {
      nuevos.clave = 'La contraseña debe tener al menos 6 caracteres.'
    }
    if (confirmacion !== clave) {
      nuevos.confirmacion = 'Las contraseñas no coinciden.'
    }
    return nuevos
  }

  async function enviar(evento) {
    evento.preventDefault()
    // evita enviar dos veces seguidas
    if (enviando) {
      return
    }
    const nuevos = validar()
    setErrores(nuevos)
    if (hayErrores(nuevos)) {
      return
    }
    setEnviando(true)
    setErrorEnvio('')
    try {
      const usuario = await registrarUsuario({ nombre: nombre, correo: correo, clave: clave })
      // al registrarse queda con la sesion iniciada
      sesion.entrar(usuario)
      navegar('/eventos')
    } catch (error) {
      // si falla (por ejemplo, correo repetido) se conserva lo escrito
      setErrorEnvio(error.message)
      setEnviando(false)
    }
  }

  return (
    <section className="pagina-estrecha">
      <p className="kicker">Tu cuenta</p>
      <h1 className="titulo-hero">Crear cuenta</h1>
      <p className="subtitulo">Regístrate para comprar y guardar tus boletos.</p>

      <form className="formulario" onSubmit={enviar} noValidate>
        {errorEnvio && <MensajeError mensaje={errorEnvio} />}
        <CampoFormulario
          id="nombre"
          etiqueta="Nombre completo"
          valor={nombre}
          alCambiar={setNombre}
          error={errores.nombre}
          autoComplete="name"
        />
        <CampoFormulario
          id="correo"
          etiqueta="Correo"
          tipo="email"
          valor={correo}
          alCambiar={setCorreo}
          error={errores.correo}
          autoComplete="email"
          placeholder="nombre@correo.com"
        />
        <CampoFormulario
          id="clave"
          etiqueta="Contraseña"
          tipo="password"
          valor={clave}
          alCambiar={setClave}
          error={errores.clave}
          autoComplete="new-password"
          ayuda="Mínimo 6 caracteres."
        />
        <CampoFormulario
          id="confirmacion"
          etiqueta="Repite la contraseña"
          tipo="password"
          valor={confirmacion}
          alCambiar={setConfirmacion}
          error={errores.confirmacion}
          autoComplete="new-password"
        />
        <Boton tipo="submit" completo={true} deshabilitado={enviando}>
          {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
        </Boton>
        <p className="texto-suave">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </section>
  )
}

export default PaginaRegistro