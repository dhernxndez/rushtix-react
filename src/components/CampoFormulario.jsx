import '../estilos/formularios.css'

// campo con etiqueta, ayuda y mensaje de error (sirve para todos los formularios)
function CampoFormulario({ id, etiqueta, valor, alCambiar, error = '', tipo = 'text', autoComplete, placeholder, ayuda, modo, largoMaximo }) {
  const idError = id + '-error'
  const idAyuda = id + '-ayuda'

  // aria-describedby une el campo con su ayuda y su error para los lectores de pantalla
  let descripcion = ''
  if (ayuda) {
    descripcion = idAyuda
  }
  if (error) {
    descripcion = (descripcion + ' ' + idError).trim()
  }

  return (
    <div className={error ? 'campo campo-con-error' : 'campo'}>
      <label htmlFor={id} className="etiqueta-campo">
        {etiqueta}
      </label>
      <input
        id={id}
        name={id}
        type={tipo}
        value={valor}
        onChange={(e) => alCambiar(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={modo}
        maxLength={largoMaximo}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={descripcion === '' ? undefined : descripcion}
      />
      {ayuda && (
        <p id={idAyuda} className="texto-suave">
          {ayuda}
        </p>
      )}
      {error && (
        <p id={idError} className="mensaje-error campo-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default CampoFormulario