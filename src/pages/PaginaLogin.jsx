import '../estilos/formularios.css'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import CampoFormulario from '../components/CampoFormulario'
import Boton from '../components/Boton'
import MensajeError from '../components/MensajeError'
import { iniciarSesion } from '../api/usuarios'
import { useSesion } from '../context/hooks'
import { validarCorreo, validarClave, hayErrores } from '../utils/validaciones'

// inicio de sesion simulado: los usuarios salen de src/data/usuarios.js
function PaginaLogin() {
  const navegar = useNavigate()
  const ubicacion = useLocation()
  const sesion = useSesion()
  const [correo, setCorreo] = useState('')
  const [clave, setClave] = useState('')
  const [errores, setErrores] = useState({})
  const [errorEnvio, setErrorEnvio] = useState('')
  const [enviando, setEnviando] = useState(false)

  // si venia de otra pantalla (por ejemplo el pago), vuelve ahi despues de entrar
  let destino = '/eventos'
  if (ubicacion.state && ubicacion.state.desde) {
    destino = ubicacion.state.desde
  }

  async function enviar(evento) {
    evento.preventDefault()
    // evita enviar dos veces seguidas
    if (enviando) {
      return
    }
    const nuevos = { correo: validarCorreo(correo), clave: validarClave(clave) }
    setErrores(nuevos)
    if (hayErrores(nuevos)) {
      return
    }
    setEnviando(true)
    setErrorEnvio('')
    try {
      const usuario = await iniciarSesion(correo, clave)
      sesion.entrar(usuario)
      navegar(destino)
    } catch (error) {
      setErrorEnvio(error.message)
      setEnviando(false)
    }
  }

  // si ya hay sesion, se muestra quien es y se puede salir
  if (sesion.usuario) {
    return (
      <section className="pagina-estrecha">
        <p className="kicker">Tu cuenta</p>
        <h1 className="titulo-hero">Hola, {sesion.usuario.nombre}</h1>
        <p className="subtitulo">Entraste como {sesion.usuario.rol}.</p>
        <Boton variante="borde" alHacerClic={() => navegar('/eventos')}>
          Ver eventos
        </Boton>
        <Boton variante="texto" alHacerClic={sesion.salir}>
          Cerrar sesión
        </Boton>
      </section>
    )
  }

  return (
    <section className="pagina-estrecha">
      <p className="kicker">Tu cuenta</p>
      <h1 className="titulo-hero">Iniciar sesión</h1>
      <p className="subtitulo">Entra para pagar y ver tus boletos.</p>

      <form className="formulario" onSubmit={enviar} noValidate>
        {errorEnvio && <MensajeError mensaje={errorEnvio} />}
        <CampoFormulario
          id="correo"
          etiqueta="Correo"
          tipo="email"
          valor={correo}
          alCambiar={setCorreo}
          error={errores.correo}
          autoComplete="email"
          placeholder="cliente@rushtix.com"
        />
        <CampoFormulario
          id="clave"
          etiqueta="Contraseña"
          tipo="password"
          valor={clave}
          alCambiar={setClave}
          error={errores.clave}
          autoComplete="current-password"
        />
        <Boton tipo="submit" completo={true} deshabilitado={enviando}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </Boton>
        <p className="texto-suave">Cuenta de prueba: cliente@rushtix.com con la contraseña cliente123.</p>
      </form>
    </section>
  )
}

export default PaginaLogin