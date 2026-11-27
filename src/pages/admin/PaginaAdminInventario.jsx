import '../../estilos/inventario.css'
import { useState, useEffect } from 'react'
import Boton from '../../components/Boton'
import MensajeError from '../../components/MensajeError'
import { obtenerInventario, actualizarZonas } from '../../api/inventario'

// X6: precio y cupo por zona de cada evento
function PaginaAdminInventario() {
  const [eventos, setEventos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)
  const [eventoId, setEventoId] = useState(null)
  // borrador: copia de las zonas que se edita; no se tocan los datos que llegaron de la API
  const [borrador, setBorrador] = useState([])
  const [guardando, setGuardando] = useState(false)
  const [errorGuardar, setErrorGuardar] = useState('')
  const [mensajeOk, setMensajeOk] = useState('')

  useEffect(() => {
    const control = new AbortController()
    obtenerInventario(control.signal)
      .then((datos) => {
        setEventos(datos)
        setCargando(false)
      })
      .catch((e) => {
        if (e.name === 'AbortError') {
          return
        }
        setError(e.message)
        setCargando(false)
      })
    return () => {
      control.abort()
    }
  }, [intento])

  // al elegir un evento se copia su lista de zonas al borrador
  function elegirEvento(evento) {
    setEventoId(evento.id)
    setBorrador(evento.zonas.map((z) => ({ ...z, precio: String(z.precio), cupo: String(z.cupo) })))
    setErrorGuardar('')
    setMensajeOk('')
  }

  // cuando llegan los datos, se elige el primer evento
  useEffect(() => {
    if (eventos.length > 0 && eventoId === null) {
      elegirEvento(eventos[0])
    }
  }, [eventos, eventoId])

  function cambiarCampo(zonaId, campo, valor) {
    setMensajeOk('')
    setBorrador(borrador.map((z) => (z.id === zonaId ? { ...z, [campo]: valor } : z)))
  }

  async function guardar() {
    if (guardando) {
      return
    }
    // validacion: precio mayor que 0 y cupo entero
    for (let i = 0; i < borrador.length; i++) {
      const precio = Number(borrador[i].precio)
      const cupo = Number(borrador[i].cupo)
      if (!(precio > 0)) {
        setErrorGuardar('El precio de ' + borrador[i].nombre + ' debe ser mayor que 0.')
        return
      }
      if (!Number.isInteger(cupo) || cupo < 0) {
        setErrorGuardar('El cupo de ' + borrador[i].nombre + ' debe ser un número entero.')
        return
      }
    }
    setGuardando(true)
    setErrorGuardar('')
    try {
      const cambios = borrador.map((z) => ({ id: z.id, nombre: z.nombre, precio: Number(z.precio), cupo: Number(z.cupo) }))
      await actualizarZonas(eventoId, cambios)
      setMensajeOk('Cambios guardados.')
      // se actualiza la lista sin perder el evento elegido
      setEventos(eventos.map((e) => (e.id === eventoId ? { ...e, zonas: cambios.map((c, i) => ({ ...borrador[i], precio: c.precio, cupo: c.cupo })) } : e)))
    } catch (e) {
      setErrorGuardar(e.message)
    }
    setGuardando(false)
  }

  return (
    <section>
      <p className="kicker">Panel admin</p>
      <h1 className="titulo-hero">Inventario y precios</h1>
      <p className="subtitulo">Zonas, cupos y precio por evento. Lo que cambies aquí se ve en la selección de zona.</p>

      {cargando && <p role="status">Cargando inventario...</p>}
      {error && <MensajeError mensaje={error} alReintentar={() => { setCargando(true); setError(''); setIntento(intento + 1) }} />}

      {!cargando && !error && (
        <>
          <div className="filtros admin-chips" role="group" aria-label="Elegir evento">
            {eventos.map((evento) => (
              <button
                key={evento.id}
                type="button"
                className={evento.id === eventoId ? 'filtro filtro-activo' : 'filtro'}
                aria-pressed={evento.id === eventoId}
                onClick={() => elegirEvento(evento)}
              >
                {evento.nombre}
              </button>
            ))}
          </div>

          {errorGuardar && <MensajeError mensaje={errorGuardar} />}
          {mensajeOk && <p className="admin-ok" role="status">{mensajeOk}</p>}

          <div className="admin-tabla-marco">
            <table className="admin-tabla admin-tabla-fija">
              <thead>
                <tr>
                  <th scope="col">Zona</th>
                  <th scope="col">Cupo</th>
                  <th scope="col">Vendidos</th>
                  <th scope="col">Precio ($)</th>
                  <th scope="col">Estado</th>
                </tr>
              </thead>
              <tbody>
                {borrador.map((zona) => (
                  <tr key={zona.id}>
                    <td className="admin-celda-nombre">{zona.nombre}</td>
                    <td>
                      <label className="solo-lectores" htmlFor={'cupo-' + zona.id}>Cupo de {zona.nombre}</label>
                      <input id={'cupo-' + zona.id} className="admin-celda-input" type="number" min="0" value={zona.cupo} onChange={(e) => cambiarCampo(zona.id, 'cupo', e.target.value)} />
                    </td>
                    <td className="admin-celda-dato">{zona.vendidos}</td>
                    <td>
                      <label className="solo-lectores" htmlFor={'precio-' + zona.id}>Precio de {zona.nombre}</label>
                      <input id={'precio-' + zona.id} className="admin-celda-input" type="number" min="1" step="0.5" value={zona.precio} onChange={(e) => cambiarCampo(zona.id, 'precio', e.target.value)} />
                    </td>
                    <td>
                      {Number(zona.cupo) - zona.vendidos <= 0 ? (
                        <span className="estado-etiqueta estado-agotado">Agotado</span>
                      ) : (
                        <span className="estado-etiqueta estado-publicado">Publicado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-acciones">
            <Boton alHacerClic={guardar} deshabilitado={guardando}>
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </Boton>
          </div>
        </>
      )}
    </section>
  )
}

export default PaginaAdminInventario
