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
import { calcularTotales } from '../utils/carrito'
import { formatearPrecio } from '../utils/formato'
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
  // forma de pago elegida (las tres salen en el figma)
  const [metodo, setMetodo] = useState('Tarjeta')
  const [nombre, setNombre] = useState('')
  const [numero, setNumero] = useState('')
  const [vencimiento, setVencimiento] = useState('')
  const [cvv, setCvv] = useState('')
  const [errores, setErrores] = useState({})
  const [errorEnvio, setErrorEnvio] = useState('')
  const [enviando, setEnviando] = useState(false)

  // total que se muestra en el boton de pagar
  const totales = calcularTotales(carrito.items)

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

  // pone la diagonal sola: el usuario solo escribe los numeros (1230 -> 12/30)
  function cambiarVencimiento(texto) {
    // dejamos solo los digitos y maximo 4
    const digitos = texto.replace(/\D/g, '').slice(0, 4)
    if (digitos.length > 2) {
      setVencimiento(digitos.slice(0, 2) + '/' + digitos.slice(2))
    } else {
      setVencimiento(digitos)
    }
  }

  async function pagar(evento) {
    evento.preventDefault()
    // evita cobrar dos veces si se pulsa dos veces seguidas
    if (enviando) {
      return
    }
    // los datos de tarjeta solo se validan si se paga con tarjeta
    let nuevos = {}
    if (metodo === 'Tarjeta') {
      nuevos = {
        nombre: validarNombreTarjeta(nombre),
        numero: validarNumeroTarjeta(numero),
        vencimiento: validarVencimiento(vencimiento),
        cvv: validarCvv(cvv),
      }
    }
    setErrores(nuevos)
    if (hayErrores(nuevos)) {
      return
    }
    setEnviando(true)
    setErrorEnvio('')
    try {
      const resultado = await crearOrden(sesion.usuario.id, carrito.items, metodo.toLowerCase())
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
      <h1 className="titulo-hero">Pagar</h1>
      <p className="subtitulo">Elegí cómo pagar. El total ya incluye los cargos de servicio.</p>
      <p className="texto-suave">Pago simulado: no se cobra nada ni se guardan los datos de la tarjeta.</p>

      <div className="dos-columnas">
        <form className="formulario formulario-plano" onSubmit={pagar} noValidate>
          {/* pestañas de forma de pago */}
          <div className="filtros" role="group" aria-label="Forma de pago">
            {['Tarjeta', 'Transferencia', 'Punto Xpress'].map((forma) => (
              <button
                key={forma}
                type="button"
                className={metodo === forma ? 'filtro filtro-activo' : 'filtro'}
                aria-pressed={metodo === forma}
                onClick={() => setMetodo(forma)}
              >
                {forma}
              </button>
            ))}
          </div>
          {errorEnvio && <MensajeError mensaje={errorEnvio} />}
          {metodo !== 'Tarjeta' && (
            <p className="texto-suave">
              Con {metodo} recibirás las instrucciones después de confirmar. Es una simulación.
            </p>
          )}
          {metodo === 'Tarjeta' && (
            <>
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
              etiqueta="Vence"
              valor={vencimiento}
              alCambiar={cambiarVencimiento}
              error={errores.vencimiento}
              autoComplete="cc-exp"
              largoMaximo={5}
              placeholder="MM/AA"
            />
            <CampoFormulario
              id="cvv"
              etiqueta="CVV"
              valor={cvv}
              alCambiar={setCvv}
              error={errores.cvv}
              autoComplete="cc-csc"
              modo="numeric"
              largoMaximo={4}
              placeholder="123"
            />
          </div>
            </>
          )}
          {enviando && (
            <p className="texto-suave" role="status">
              Estamos procesando tu pago, no cierres esta página.
            </p>
          )}
        </form>

        <ResumenCompra titulo="Resumen de compra" items={carrito.items}>
          {/* el boton de pagar va dentro del resumen, como en el figma */}
          <Boton tamano="l" completo={true} deshabilitado={enviando} alHacerClic={pagar}>
            {enviando ? 'Procesando pago...' : 'Pagar ' + formatearPrecio(totales.total)}
          </Boton>
          <Boton variante="texto" completo={true} deshabilitado={enviando} alHacerClic={() => navegar('/resumen')}>
            Volver al resumen
          </Boton>
        </ResumenCompra>
      </div>
    </section>
  )
}

export default PaginaPago