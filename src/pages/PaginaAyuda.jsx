import { useNavigate } from 'react-router-dom'
import Boton from '../components/Boton'

// preguntas frecuentes de la compra (pantalla simple)
function PaginaAyuda() {
  const navegar = useNavigate()
  return (
    <section className="pagina-estrecha">
      <p className="kicker">Ayuda</p>
      <h1 className="titulo-hero">¿Cómo comprar?</h1>
      <p className="subtitulo">Comprá en 4 pasos: elegí tu zona, revisá el carrito, pagá y mostrá tu QR en la entrada.</p>
      <h2>¿Dónde veo mi boleto?</h2>
      <p className="texto-suave">En Mis boletos, con el botón Ver QR de cada evento.</p>
      <h2>¿Se cobra de verdad?</h2>
      <p className="texto-suave">No, el pago es una simulación y no se guardan datos de la tarjeta.</p>
      <Boton alHacerClic={() => navegar('/eventos')}>Ver eventos</Boton>
    </section>
  )
}

export default PaginaAyuda