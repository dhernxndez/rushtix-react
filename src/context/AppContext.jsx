import { useReducer, useEffect } from 'react'
import { reductor, crearEstadoInicial } from './reductor'
import { guardar } from '../utils/almacenamiento'
import { AppContext } from './contexto'

// guarda el carrito y la sesion para todas las pantallas
export function AppProvider({ children }) {
  const [estado, dispatch] = useReducer(reductor, null, crearEstadoInicial)

  // guardar el carrito cada vez que cambia
  useEffect(() => {
    guardar('rushtix-carrito', estado.carrito)
  }, [estado.carrito])

  // guardar la sesion cada vez que cambia
  useEffect(() => {
    guardar('rushtix-sesion', estado.sesion)
  }, [estado.sesion])

  return <AppContext.Provider value={{ estado: estado, dispatch: dispatch }}>{children}</AppContext.Provider>
}