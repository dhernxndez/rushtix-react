import Logo from './Logo'

// pie de pagina, es el mismo en todas las pantallas
function PiePagina() {
  return (
    <footer className="pie">
      <Logo />
      <p>Precio final desde el primer vistazo.</p>
      <p className="pie-nota">Proyecto de Programación Orientada al Usuario, UCA. Los datos son simulados.</p>
    </footer>
  )
}

export default PiePagina
