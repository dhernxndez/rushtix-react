import '../estilos/formularios.css'
import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import Pasos from '../components/Pasos'
import Boton from '../components/Boton'
import CampoFormulario from '../components/CampoFormulario'
import MensajeError from '../components/MensajeError'
import EstadoVacio from '../components/EstadoVacio'
import ResumenCompra from '../components/ResumenCompra'
import { crearOrden } from '../api/ordenes'
import { useCarrito, useSesion } from '../context/hooks'
import {
  validarNombreTarjeta,
  validarNumeroTarjeta,
  validarVencimiento,
  validarCvv,
  hayErrores,
} from '../utils/validaciones'

// paso 3: pago simulado, no se cobra nada ni se guardan los datos de la tarjeta
function PaginaPago() {
  const navegar = useNavigate()
  const carrito = useCarrito()
  const sesion = useSesion()
  const [nombre, setNombre] = useState('')
  const [numero, setNumero] = useState('')
  const [vencimiento, setVencimiento] = useState('')
  const [cvv, setCvv] = useState('')
  const [errores, setErrores] = useState({})
  const [errorEnvio, setErrorEnvio] = useState('')
  const [enviando, setEnviando] = useState(false)

  // para pagar hay que haber iniciado sesion
  if (!sesion.usuario) {
    return <Navigate to="/login" state={{ desde: '/pago' }} replace />
  }

  // sin boletos en el carrito no hay nada que pagar
  // (si se esta enviando, el carrito se vacia justo al terminar y no se debe mostrar esto)
  if (carrito.items.length === 0 && !enviando) {
    return (
      <section>
        <Pasos actual={3} />
        <EstadoVacio
          titulo="Tu carrito está vacío"
          mensaje="Agrega boletos antes de pagar."
          textoBoton="Ver eventos"
          alBoton={() => navegar('/eventos')}
        />
      </section>
    )
  }

  async function pagar(evento) {
    evento.preventDefault()
    // evita cobrar dos veces si se pulsa dos veces seguidas
    if (enviando) {
      return
    }
    const nuevos = {
      nombre: validarNombreTarjeta(nombre),
      numero: validarNumeroTarjeta(numero),
      vencimiento: validarVencimiento(vencimiento),
      cvv: validarCvv(cvv),
    }
    setErrores(nuevos)
    if (hayErrores(nuevos)) {
      return
    }
    setEnviando(true)
    setErrorEnvio('')
    try {
      const resultado = await crearOrden(sesion.usuario.id, carrito.items, 'tarjeta')
      navegar('/confirmacion/' + resultado.orden.id)
      carrito.vaciar()
    } catch (error) {
      setErrorEnvio(error.message)
      setEnviando(false)
    }
  }

  return (
    <section>
      <Pasos actual={3} />
      <p className="kicker">Paso 3 de 4</p>
      <h1 className="titulo-hero">Pago</h1>
      <p className="subtitulo">Pago simulado: no se cobra nada ni se guardan los datos de la tarjeta.</p>

      <div className="dos-columnas">
        <form className="formulario" onSubmit={pagar} noValidate>
          <h2>Datos de la tarjeta</h2>
          {errorEnvio && <MensajeError mensaje={errorEnvio} />}
          <CampoFormulario
            id="nombre-tarjeta"
            etiqueta="Nombre en la tarjeta"
            valor={nombre}
            alCambiar={setNombre}
            error={errores.nombre}
            autoComplete="cc-name"
          />
          <CampoFormulario
            id="numero-tarjeta"
            etiqueta="Número de tarjeta"
            valor={numero}
            alCambiar={setNumero}
            error={errores.numero}
            autoComplete="cc-number"
            modo="numeric"
            largoMaximo={19}
            placeholder="4242 4242 4242 4242"
          />
          <div className="formulario-fila">
            <CampoFormulario
              id="vencimiento"
              etiqueta="Vencimiento"
              valor={vencimiento}
              alCambiar={setVencimiento}
              error={errores.vencimiento}
              autoComplete="cc-exp"
              largoMaximo={5}
              placeholder="MM/AA"
            />
            <CampoFormulario
              id="cvv"
              etiqueta="Código de seguridad"
              valor={cvv}
              alCambiar={setCvv}
              error={errores.cvv}
              autoComplete="cc-csc"
              modo="numeric"
              largoMaximo={4}
              placeholder="123"
            />
          </div>
          <Boton tipo="submit" tamano="l" completo={true} deshabilitado={enviando}>
            {enviando ? 'Procesando pago...' : 'Pagar'}
          </Boton>
          {enviando && (
            <p className="texto-suave" role="status">
              Estamos procesando tu pago, no cierres esta página.
            </p>
          )}
        </form>

        <ResumenCompra titulo="Resumen de compra" items={carrito.items}>
          <Boton variante="borde" completo={true} deshabilitado={enviando} alHacerClic={() => navegar('/carrito')}>
            Volver al carrito
          </Boton>
        </ResumenCompra>
      </div>
    </section>
  )
}

export default PaginaPago