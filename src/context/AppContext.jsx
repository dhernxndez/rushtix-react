import { useReducer, useEffect } from 'react'
import { reductor, crearEstadoInicial } from './reductor'
import { guardar } from '../utils/almacenamiento'
import { AppContext } from './contexto'

// guarda el carrito y la sesion para todas las pantallas
export function AppProvider({ children }) {
  // useReducer: estado global + dispatch para mandar acciones
  // crearEstadoInicial solo se corre la primera vez y lee localStorage
  const [estado, dispatch] = useReducer(reductor, null, crearEstadoInicial)

  // guardar el carrito cada vez que cambia
  // OJO: el arreglo [estado.carrito] hace que solo corra cuando el carrito cambia
  useEffect(() => {
    guardar('rushtix-carrito', estado.carrito)
  }, [estado.carrito])

  // guardar la sesion cada vez que cambia
  useEffect(() => {
    guardar('rushtix-sesion', estado.sesion)
  }, [estado.sesion])

  // todo lo que este dentro del provider puede usar el estado con los hooks de hooks.js
  return <AppContext.Provider value={{ estado: estado, dispatch: dispatch }}>{children}</AppContext.Provider>
}