import { useState } from 'react'
import Boton from '../components/Boton'
import CampoFormulario from '../components/CampoFormulario'
import MensajeError from '../components/MensajeError'
import { verificarBoleto } from '../api/ordenes'
import { formatearFechaCorta } from '../utils/formato'
import '../estilos/formularios.css'

// pantalla para organizadores y admins: revisa si un codigo de boleto existe y si ya se uso
function PaginaVerificar() {
  const [codigo, setCodigo] = useState('')
  const [errorCampo, setErrorCampo] = useState('')
  const [errorEnvio, setErrorEnvio] = useState('')
  const [resultado, setResultado] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function verificar(evento) {
    evento.preventDefault()
    // evita enviar dos veces seguidas
    if (enviando) {
      return
    }
    if (codigo.trim() === '') {
      setErrorCampo('Escribe el código del boleto.')
      return
    }
    setErrorCampo('')
    setErrorEnvio('')
    setResultado(null)
    setEnviando(true)
    try {
      const respuesta = await verificarBoleto(codigo)
      setResultado(respuesta)
    } catch (error) {
      setErrorEnvio(error.message)
    }
    setEnviando(false)
  }

  return (
    <section className="pagina-estrecha">
      <p className="kicker">Admin</p>
      <h1 className="titulo-hero">Verificar boleto</h1>
      <p className="subtitulo">Escribe el código que aparece debajo del QR, por ejemplo RT-O0001-T0001.</p>

      <form className="formulario formulario-plano" onSubmit={verificar} noValidate>
        {errorEnvio && <MensajeError mensaje={errorEnvio} />}
        <CampoFormulario
          id="codigo-boleto"
          etiqueta="Código del boleto"
          valor={codigo}
          alCambiar={setCodigo}
          error={errorCampo}
          placeholder="RT-O0001-T0001"
        />
        <Boton tipo="submit" completo={true} deshabilitado={enviando}>
          {enviando ? 'Verificando...' : 'Verificar'}
        </Boton>
      </form>

      {resultado && (
        <div className="formulario" role="status">
          <h2>{resultado.valido ? 'Boleto válido' : 'Boleto no válido'}</h2>
          <p className="texto-suave">{resultado.motivo}</p>
          {resultado.boleto && (
            <p>
              {resultado.boleto.nombreEvento} · {resultado.boleto.nombreZona} · {formatearFechaCorta(resultado.boleto.fecha)}
              <br />
              Titular: {resultado.boleto.titular}
            </p>
          )}
        </div>
      )}
    </section>
  )
}

export default PaginaVerificar