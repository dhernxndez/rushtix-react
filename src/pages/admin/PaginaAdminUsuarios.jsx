import { useState, useEffect } from 'react'
import Boton from '../../components/Boton'
import MensajeError from '../../components/MensajeError'
import { listarUsuarios, cambiarRolUsuario, alternarUsuarioActivo } from '../../api/admin'
import { useSesion } from '../../context/hooks'

// nombre del rol como se muestra en la tabla
const nombresRol = { cliente: 'Cliente', organizador: 'Organizador', admin: 'Admin' }

// A3: lista de usuarios, cambiar su rol y activar o desactivar la cuenta
function PaginaAdminUsuarios() {
  const sesion = useSesion()
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)
  const [busqueda, setBusqueda] = useState('')
  // id del usuario que se esta guardando (para no mandar dos cambios a la vez)
  const [guardandoId, setGuardandoId] = useState(null)

  useEffect(() => {
    const control = new AbortController()
    listarUsuarios(control.signal)
      .then((lista) => {
        setUsuarios(lista)
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

  function reintentar() {
    setCargando(true)
    setError('')
    setIntento(intento + 1)
  }

  // aplica un cambio y reemplaza solo la fila del usuario que cambio
  async function cambiar(accion, id) {
    if (guardandoId !== null) {
      return
    }
    setGuardandoId(id)
    try {
      const actualizado = await accion(id)
      setUsuarios(usuarios.map((u) => (u.id === id ? actualizado : u)))
    } catch (e) {
      setError(e.message)
    }
    setGuardandoId(null)
  }

  const texto = busqueda.trim().toLowerCase()
  const filas = usuarios.filter((u) => u.nombre.toLowerCase().includes(texto) || u.correo.toLowerCase().includes(texto))

  return (
    <section>
      <p className="kicker">Panel admin</p>
      <h1 className="titulo-hero">Usuarios</h1>
      <p className="subtitulo">Cambiá el rol o desactivá cuentas. Los cambios se aplican al instante.</p>

      {cargando && <p role="status">Cargando usuarios...</p>}
      {error && <MensajeError mensaje={error} alReintentar={reintentar} />}

      {!cargando && !error && (
        <>
          <div className="buscador admin-buscador">
            <label htmlFor="buscar-usuario" className="etiqueta-campo">
              Buscar usuario
            </label>
            <div className="buscador-campo">
              <input
                id="buscar-usuario"
                type="search"
                value={busqueda}
                placeholder="Buscar usuario por nombre o correo..."
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-tabla-marco">
            <table className="admin-tabla">
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Correo</th>
                  <th scope="col">Rol</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filas.map((u) => {
                  // no se deja cambiar la propia cuenta para no quedarse sin acceso
                  const esMia = sesion.usuario && sesion.usuario.id === u.id
                  return (
                    <tr key={u.id}>
                      <td className="admin-celda-nombre">{u.nombre}</td>
                      <td>{u.correo}</td>
                      <td>{nombresRol[u.rol]}</td>
                      <td>
                        <span className={u.activo ? 'estado-etiqueta estado-activo' : 'estado-etiqueta estado-inactivo'}>
                          {u.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-acciones-fila">
                          <Boton
                            variante="borde"
                            tamano="s"
                            deshabilitado={esMia || guardandoId !== null}
                            alHacerClic={() => cambiar(cambiarRolUsuario, u.id)}
                          >
                            Cambiar rol
                          </Boton>
                          <Boton
                            variante="borde"
                            tamano="s"
                            deshabilitado={esMia || guardandoId !== null}
                            alHacerClic={() => cambiar(alternarUsuarioActivo, u.id)}
                          >
                            {u.activo ? 'Desactivar' : 'Activar'}
                          </Boton>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {filas.length === 0 && <p className="texto-suave">No hay usuarios con ese nombre o correo.</p>}
        </>
      )}
    </section>
  )
}

export default PaginaAdminUsuarios