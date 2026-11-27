import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './estilos/variables.css'
import './estilos/global.css'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'

// punto de entrada: aqui se monta toda la app en el div #root del index.html
// OJO: el orden importa, el router va afuera y el provider adentro para que todo use el estado global
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
)