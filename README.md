# RushTix (React)

Plataforma de venta de boletos para eventos de último minuto. Proyecto de Programación Orientada al Usuario (POU), UCA. Esta es la implementación en React del diseño que hicimos en Figma en la primera entrega.

Estado: en progreso. Los datos son simulados, no hay backend ni pagos reales.

## Cómo correrlo

```
npm install
npm run dev
```

Se abre en http://localhost:5173

## Qué ya funciona

- Rutas con React Router: `/` y `/eventos` (listado), `/eventos/:id` (detalle), `/carrito`, y una pantalla para rutas que no existen.
- Listado de eventos con búsqueda y filtro por categoría.
- Estados de carga, error (con botón de reintentar) y vacío.
- Detalle del evento: elegir zona y cantidad, con validación y resumen de la selección.
- Carrito con cantidades editables, subtotal, cargos de servicio (5 %), quitar y vaciar. Se guarda en `localStorage`.

## Qué falta

- Login, registro y perfil con sesión simulada.
- Pago simulado, confirmación y boleto con código QR.
- Panel de administración, inventario y reportes.
- Capturas en 375, 768 y 1440 px y documento de arquitectura.

## Estructura

```
src/
  components/   componentes reutilizables
  pages/        vistas (eventos, detalle, carrito)
  data/         datos simulados
  utils/        funciones de apoyo (formato, carrito, localStorage, API simulada)
  estilos/      variables y estilos globales
```

## Inventario de componentes

| Componente | Para qué sirve |
|---|---|
| Logo | Marca RushTix |
| Boton | Botón con variantes (principal, borde, peligro, agotado, texto) y tamaños |
| EncabezadoSitio | Barra superior y menú con enlaces |
| PiePagina | Pie de página |
| Pasos | Indicador de los 4 pasos de compra |
| BuscadorEventos | Campo de búsqueda |
| FiltroCategorias | Chips de categoría |
| TarjetaEvento | Resumen de un evento con sticker de estado |
| ListaEventos | Lista de tarjetas, o estado vacío |
| EstadoCarga | Tarjetas esqueleto mientras se cargan datos |
| EstadoVacio | Mensaje cuando no hay resultados |
| MensajeError | Error con opción de reintentar |
| SelectorZona | Elegir zona del evento |
| SelectorCantidad | Elegir cuántos boletos |
| ResumenCarrito | Lista de boletos del carrito con cantidad editable |
| ResumenCompra | Subtotal, cargos de servicio y total |

## Estado y persistencia

- `App` guarda el carrito y define las rutas. El evento elegido sale de la ruta (`useParams`).
- El carrito se guarda en `localStorage` (clave `rushtix-carrito`) con `useEffect`.
- `PaginaEventos` pide los eventos a una API simulada con `useEffect` y maneja carga y error.
- Los formularios usan estado controlado.

## Datos simulados

`src/data/eventos.js` tiene 8 eventos en 4 categorías, con 3 zonas cada uno (precio y disponibilidad). Un evento está agotado.

## Diseño

Colores, tipografías (Big Shoulders Display, IBM Plex Sans y JetBrains Mono), radios y componentes salen del Design System de Figma. Una decisión propia: los textos pequeños usan el gris `#b8b8b8` y no `#6e6e6e` para tener mejor contraste.


https://www.figma.com/design/GkhkrZUbTN4slR7PCa7cpj/RushTix-%E2%80%94-Primera-Entrega-POU

## Integrantes

- Xiomara Molina Amaya
- Daniel Eduardo García Hernández
