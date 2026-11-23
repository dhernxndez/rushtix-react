// variantes: principal, borde, peligro, agotado
// tamanos: s, m, l
function Boton({ children, variante = 'principal', tamano = 'm', completo = false, tipo = 'button', deshabilitado = false, alHacerClic }) {
  let clases = 'boton boton-' + variante + ' boton-' + tamano
  if (completo) {
    clases = clases + ' boton-completo'
  }
  return (
    <button type={tipo} className={clases} disabled={deshabilitado} onClick={alHacerClic}>
      {children}
    </button>
  )
}

export default Boton
