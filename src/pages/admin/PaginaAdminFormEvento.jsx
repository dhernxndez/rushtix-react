import '../../estilos/formularios.css'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CampoFormulario from '../../components/CampoFormulario'
import Boton from '../../components/Boton'
import MensajeError from '../../components/MensajeError'
import { obtenerEvento, crearEvento, editarEvento, estadosEvento } from '../../api/eventos'
import { categorias } from '../../data/eventos'
import { hayErrores } from '../../utils/validaciones'

// A2b: el mismo formulario sirve para crear (/admin/eventos/nuevo) y editar (/admin/eventos/:id)
function PaginaAdminFormEvento() {
  const navegar = useNavigate()
  const { id } = useParams()
  const esNuevo = id === undefined

  const [nombre, setNombre] = useState('')
  const [fecha, setFecha] = useState('')
  const [lugar, setLugar] = useState('')
  const [categoria, setCategoria] = useState('')
  const [estado, setEstado] = useState('Borrador')
  const [errores, setErrores] = useState({})
  const [errorEnvio, setErrorEnvio] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [cargando, setCargando] = useState(!esNuevo)
  const [errorCarga, setErrorCarga] = useState('')

  // al editar, primero se pide el evento para llenar el formulario
  useEffect(() => {
    if (esNuevo) {
      return
    }
    const control = new AbortController()
    obtenerEvento(id, control.signal)
      .then((evento) => {
        setNombre(evento.nombre)
        // el campo datetime-local usa el formato AAAA-MM-DDTHH:MM
        setFecha(evento.fecha.slice(0, 16))
        setLugar(evento.lugar)
        setCategoria(evento.categoria)
        setEstado(evento.estado)
        setCargando(false)
      })
      .catch((e) => {
        if (e.name === 'AbortError') {
          return
        }
        setErrorCarga(e.message)
        setCargando(false)
      })
    return () => {
      control.abort()
    }
  }, [id, esNuevo])

  function validar() {
    const nuevos = { nombre: '', fecha: '', lugar: '', categoria: '' }
    if (nombre.trim().length < 3) {
      nuevos.nombre = 'Escribe el nombre del evento (al menos 3 letras).'
    }
    if (fecha === '') {
      nuevos.fecha = 'Elige la fecha y la hora.'
    }
    if (lugar.trim().length < 3) {
      nuevos.lugar = 'Escribe el lugar del evento.'
    }
    if (categoria === '') {
      nuevos.categoria = 'Elige una categoría.'
    }
    return nuevos
  }

  async function guardar(evento) {
    evento.preventDefault()
    // evita guardar dos veces
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
    const datos = { nombre: nombre, fecha: fecha, lugar: lugar, categoria: categoria, estado: estado }
    try {
      if (esNuevo) {
        await crearEvento(datos)
      } else {
        await editarEvento(id, datos)
      }
      navegar('/admin/eventos')
    } catch (e) {
      // si la API falla, lo escrito se queda en el formulario
      setErrorEnvio(e.message)
      setEnviando(false)
    }
  }

  if (cargando) {
    return <p role="status">Cargando el evento...</p>
  }
  if (errorCarga) {
    return (
      <section>
        <MensajeError mensaje={errorCarga} />
        <Boton variante="borde" alHacerClic={() => navegar('/admin/eventos')}>
          Volver a eventos
        </Boton>
      </section>
    )
  }

  return (
    <section>
      <p className="kicker">Panel admin · Eventos</p>
      <h1 className="titulo-hero">{esNuevo ? 'Nuevo evento' : 'Editar evento'}</h1>
      <p className="subtitulo">Completa los datos. Puedes guardarlo como borrador.</p>

      <form className="formulario admin-formulario" onSubmit={guardar} noValidate>
        {errorEnvio && <MensajeError mensaje={errorEnvio} />}
        <CampoFormulario id="nombre" etiqueta="Nombre del evento" valor={nombre} alCambiar={setNombre} error={errores.nombre} />
        <CampoFormulario id="fecha" etiqueta="Fecha y hora" tipo="datetime-local" valor={fecha} alCambiar={setFecha} error={errores.fecha} />
        <CampoFormulario id="lugar" etiqueta="Lugar" valor={lugar} alCambiar={setLugar} error={errores.lugar} />

        <div className={errores.categoria ? 'campo campo-con-error' : 'campo'}>
          <label htmlFor="categoria" className="etiqueta-campo">
            Categoría
          </label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            aria-invalid={errores.categoria ? 'true' : 'false'}
            aria-describedby={errores.categoria ? 'categoria-error' : undefined}
          >
            <option value="">Elige una categoría</option>
            {/* categorias empieza con 'Todos', que no es una categoria real */}
            {categorias.slice(1).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errores.categoria && (
            <p id="categoria-error" className="mensaje-error campo-error" role="alert">
              {errores.categoria}
            </p>
          )}
        </div>

        <div className="campo">
          <label htmlFor="estado" className="etiqueta-campo">
            Estado
          </label>
          <select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
            {estadosEvento.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-acciones">
          <Boton tipo="submit" deshabilitado={enviando}>
            {enviando ? 'Guardando...' : 'Guardar evento'}
          </Boton>
          <Boton variante="borde" alHacerClic={() => navegar('/admin/eventos')}>
            Cancelar
          </Boton>
        </div>
      </form>
    </section>
  )
}

export default PaginaAdminFormEvento
