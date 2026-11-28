# RushTix (React)

Plataforma de venta de boletos para eventos de último minuto. Proyecto de Programación Orientada al Usuario (POU), UCA. Es la implementación en React del diseño que hicimos en Figma en la primera entrega.

Los datos son simulados: no hay backend ni pagos reales.

- Diseño en Figma: https://www.figma.com/design/GkhkrZUbTN4slR7PCa7cpj/RushTix-%E2%80%94-Primera-Entrega-POU

## Cómo correrlo

```
npm install
npm run dev
```

Se abre en http://localhost:5173

## Cuentas de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Cliente | cliente@rushtix.com | cliente123 |
| Organizador | organizador@rushtix.com | organizador123 |
| Administrador | admin@rushtix.com | admin123 |

También se puede crear una cuenta nueva en `/registro` (queda con rol cliente).

## Qué hace

- **Listado de eventos** con búsqueda por nombre, lugar o categoría, y filtro por categoría.
- **Detalle del evento**: elegir zona y cantidad (máximo 8 o lo que quede disponible), con validación y resumen de la selección.
- **Carrito** con cantidades editables, quitar, vaciar, subtotal, cargo de servicio del 5 % y total. Se guarda en `localStorage`.
- **Login, registro y perfil** con sesión simulada.
- **Pago simulado** con validación del formulario y sin doble envío.
- **Confirmación y boletos con código QR**: una compra crea la orden, descuenta los lugares y emite un boleto por cada entrada. Cada boleto tiene un código legible y un QR con solo identificadores (orden, boleto y evento), sin datos personales.
- **Resumen antes de pagar**, entre el carrito y el pago.
- **Estados de carga, error (con botón Reintentar) y vacío** en las pantallas que piden datos.
- **Panel de administración** (solo admin y organizador): dashboard con ventas y ocupación, eventos (crear, editar, eliminar con confirmación), inventario y precios por zona, usuarios, reportes de ventas con exportar CSV y tendencias, y verificación de boletos por código.
- **PWA**: se puede instalar como app (manifest con íconos 192, 512 y maskable) y tiene service worker.

## Rutas

| Ruta | Pantalla |
|---|---|
| `/` y `/eventos` | Listado de eventos |
| `/eventos/:id` | Detalle del evento y selección de zona |
| `/carrito` | Carrito |
| `/login` | Iniciar sesión |
| `/registro` | Crear cuenta |
| `/perfil` | Datos de la cuenta (pide sesión) |
| `/resumen` | Resumen antes de pagar |
| `/pago` | Pago simulado (pide sesión) |
| `/confirmacion/:ordenId` | Confirmación de la compra |
| `/boletos` | Mis boletos con QR |
| `/boletos/:boletoId` | Un boleto con su QR |
| `/ayuda` | Ayuda |
| `/admin` | Dashboard del panel admin |
| `/admin/eventos` | Gestión de eventos |
| `/admin/eventos/nuevo` y `/admin/eventos/:id` | Crear y editar evento (mismo formulario) |
| `/admin/inventario` | Inventario y precios por zona |
| `/admin/usuarios` | Usuarios |
| `/admin/reportes` y `/admin/reportes/tendencias` | Reportes de ventas y tendencias |
| `/admin/verificar` | Verificar un boleto por código |
| cualquier otra | Página no encontrada |

## Arquitectura

- **Estado global con Context + `useReducer`** (`src/context/`): el carrito y la sesión viven en un solo reductor. Las pantallas lo usan con los hooks `useCarrito()` y `useSesion()`, sin pasar props de pantalla en pantalla. El estado se guarda en `localStorage`.
- **API falsa** (`src/api/`): una capa aparte que las pantallas usan como si fuera un servidor. Tiene dos operaciones base: `leer` (espera, lee y devuelve una copia) y `mutar` (espera, aplica el cambio, guarda y devuelve una copia). Las pantallas nunca tocan `localStorage` directamente.
- **AbortController**: las lecturas aceptan un `signal`. Las pantallas crean un `AbortController` dentro del `useEffect` y lo cancelan al salir, para no actualizar una pantalla que ya no está.
- **Rutas por rol**: `RutaProtegida` deja entrar al panel solo a admin y organizador; sin sesión manda al login.
- **Formularios controlados**: cada campo guarda su valor en un `useState`, se valida antes de enviar y el botón se desactiva mientras se guarda.
- Para probar el estado de error: en la consola del navegador, `localStorage.setItem('rushtix-simular-error', 'true')` y recargar. Para quitarlo: `localStorage.removeItem('rushtix-simular-error')`.

Más detalle en [docs/arquitectura.md](docs/arquitectura.md).

### Funciones de la API

| Archivo | Funciones |
|---|---|
| `src/api/eventos.js` | `listarEventos(signal)`, `obtenerEvento(id, signal)` |
| `src/api/usuarios.js` | `iniciarSesion(correo, clave)`, `registrarUsuario(datos)` |
| `src/api/eventos.js` (admin) | `crearEvento(datos)`, `editarEvento(id, datos)`, `eliminarEvento(id)` |
| `src/api/inventario.js` | `obtenerInventario(signal)`, `actualizarZonas(eventoId, cambios)` |
| `src/api/ordenes.js` | `crearOrden(usuarioId, items, metodoPago)`, `listarBoletosDeUsuario(usuarioId, signal)`, `obtenerOrden(ordenId, signal)`, `verificarBoleto(codigo, signal)` |
| `src/api/admin.js` | Resumen del dashboard y reportes |

## Estructura

```
src/
  api/          API falsa (eventos, usuarios, órdenes y boletos)
  context/      estado global: Context, reductor y hooks
  components/   componentes reutilizables
  pages/        una vista por pantalla
  pages/admin/  panel de administración
  data/         datos de ejemplo (8 eventos, 3 usuarios)
  utils/        formato, totales del carrito, validaciones, localStorage
  estilos/      variables del Design System, estilos globales y uno por pantalla
```

## Componentes

| Componente | Para qué sirve |
|---|---|
| Logo | Marca RushTix |
| Boton | Botón con variantes (principal, borde, peligro, agotado, texto) y tamaños |
| EncabezadoSitio | Barra superior; el menú cambia si hay sesión |
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
| SelectorCantidad | Elegir cuántos boletos, con botones − y + |
| ResumenCarrito | Boletos del carrito con cantidad editable |
| ResumenCompra | Subtotal, cargo de servicio y total |
| CampoFormulario | Campo con etiqueta, ayuda y mensaje de error |
| TarjetaBoleto | Boleto con su código y QR |
| RutaProtegida | Deja pasar solo a los roles indicados |
| EtiquetaEstado | Etiqueta de color con el estado de un evento |
| DialogoConfirmar | Ventana para confirmar una acción que no se puede deshacer |
| GraficaBarras | Gráfica de barras de los reportes |

## Diseño

Colores, tipografías (Big Shoulders Display, IBM Plex Sans y JetBrains Mono), radios y componentes salen del Design System de Figma. Una decisión propia: los textos pequeños usan el gris `#b8b8b8` y no `#6e6e6e` para tener mejor contraste.

## Capturas

Pantallas en los tres tamaños (móvil 375, tablet 768 y escritorio 1440 px), en `docs/capturas/`.

| Pantalla | 375 | 768 | 1440 |
|---|---|---|---|
| Listado de eventos | [ver](docs/capturas/01-listado-375.png) | [ver](docs/capturas/01-listado-768.png) | [ver](docs/capturas/01-listado-1440.png) |
| Detalle y selección de zona | [ver](docs/capturas/02-detalle-375.png) | [ver](docs/capturas/02-detalle-768.png) | [ver](docs/capturas/02-detalle-1440.png) |
| Carrito | [ver](docs/capturas/03-carrito-375.png) | [ver](docs/capturas/03-carrito-768.png) | [ver](docs/capturas/03-carrito-1440.png) |

## Pendiente

- Router en modo datos (`createBrowserRouter` + `RouterProvider`).
- Publicación en GitHub Pages.

## Integrantes

- Xiomara Molina Amaya (@Xio7w7): listado, búsqueda y filtros, detalle, carrito, registro, perfil, panel admin (dashboard, eventos e inventario) y conexión de esas pantallas con la API.
- Daniel Eduardo García Hernández (@dhernxndez): estado global, API falsa, login, resumen, pago, confirmación, boletos con QR, rutas por rol, verificar boletos, usuarios, reportes, PWA y despliegue.
