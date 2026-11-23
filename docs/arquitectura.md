# Arquitectura de componentes y flujo de estado

Documento breve del avance de RushTix en React. Los datos son simulados.

## Carpetas

```
src/
  components/   piezas reutilizables (botón, tarjeta, selectores, estados)
  pages/        una vista por pantalla (eventos, detalle, carrito)
  data/         eventos de prueba
  utils/        formato de precios y fechas, totales del carrito, localStorage, API simulada
  estilos/      variables.css (tokens del Design System) y global.css
```

## Rutas

La navegación usa React Router. `App` define las rutas y las páginas reciben funciones por props para moverse.

| Ruta | Página |
|---|---|
| `/` y `/eventos` | PaginaEventos |
| `/eventos/:id` | PaginaDetalle (el id se lee con `useParams`) |
| `/carrito` | PaginaCarrito |
| cualquier otra | mensaje de página no encontrada |

## Árbol de componentes

```
App
├── EncabezadoSitio (Logo, enlaces)
├── Routes
│   ├── PaginaEventos
│   │   ├── BuscadorEventos
│   │   ├── FiltroCategorias
│   │   ├── EstadoCarga / MensajeError
│   │   └── ListaEventos
│   │       ├── TarjetaEvento (Boton)
│   │       └── EstadoVacio
│   ├── PaginaDetalle
│   │   ├── Pasos
│   │   ├── SelectorZona
│   │   ├── SelectorCantidad
│   │   └── Boton
│   └── PaginaCarrito
│       ├── Pasos
│       ├── ResumenCarrito (EstadoVacio)
│       └── ResumenCompra
└── PiePagina
```

## Dónde vive cada estado

| Estado | Dónde | Por qué |
|---|---|---|
| `carrito` | `App` | lo usan el encabezado (contador), el detalle (agregar) y el carrito |
| eventos, cargando, error, búsqueda, categoría | `PaginaEventos` | solo se usan en esa pantalla |
| zona elegida, cantidad, mensajes | `PaginaDetalle` | son del formulario de esa pantalla |

Los valores que se pueden calcular no se guardan en estado: la lista filtrada, el contador del carrito y los totales (subtotal, cargos de servicio del 5 % y total) se calculan en cada render.

## Flujo de datos

1. `PaginaEventos` pide los eventos con `pedirEventos()` dentro de un `useEffect`. La función simula una espera de 900 ms y puede fallar, así se ven los estados de carga y de error.
2. El usuario busca o filtra y la lista se vuelve a calcular.
3. En el detalle elige una zona y una cantidad. El formulario valida y llama a `agregarAlCarrito` (prop que viene de `App`).
4. `App` actualiza `carrito`. Si ya existía la misma zona del mismo evento, suma la cantidad (máximo 8).
5. Un `useEffect` en `App` guarda el carrito en `localStorage` cada vez que cambia. Al abrir la app se lee con `leerGuardado`.
6. En el carrito se cambia la cantidad, se quita un boleto o se vacía.

## Decisiones

- Las props con nombre `al...` son funciones que el padre pasa para avisar de un evento (por ejemplo `alVerDetalle`).
- Los colores, fuentes y radios salen del Design System de Figma y están como variables CSS en `variables.css`.
- Los textos pequeños usan `#b8b8b8` en vez de `#6e6e6e` para tener mejor contraste.
- No se usa Context ni librerías de estado: con tres pantallas, subir el estado a `App` alcanza.

## Pendiente

Inicio de sesión y perfil, pago simulado, boleto con QR, panel de administración y reportes.
