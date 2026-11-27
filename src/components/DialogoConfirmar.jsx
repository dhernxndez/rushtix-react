import Boton from './Boton'

// ventana para confirmar una accion que no se puede deshacer
function DialogoConfirmar({ titulo, mensaje, textoConfirmar, ocupado, alCancelar, alConfirmar }) {
  return (
    <div className="dialogo-fondo">
      <div className="dialogo" role="alertdialog" aria-modal="true" aria-labelledby="dialogo-titulo" aria-describedby="dialogo-mensaje">
        <h2 id="dialogo-titulo">{titulo}</h2>
        <p id="dialogo-mensaje">{mensaje}</p>
        <div className="dialogo-acciones">
          <Boton variante="borde" alHacerClic={alCancelar} deshabilitado={ocupado}>
            Cancelar
          </Boton>
          <Boton variante="eliminar" alHacerClic={alConfirmar} deshabilitado={ocupado}>
            {ocupado ? 'Eliminando...' : textoConfirmar}
          </Boton>
        </div>
      </div>
    </div>
  )
}

export default DialogoConfirmar
