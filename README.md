# Proyecto_GestionBoletos

## Segundo entregable
**Codificación del flujograma implementando estructuras de control de flujo: condicionales.**

## Descripción
Este proyecto implementa en C++ el flujograma de gestión de boletos para eventos. El programa permite seleccionar un evento, ingresar datos del comprador, validar el inventario disponible, calcular el total a pagar, aplicar descuentos y procesar el pago.

## Archivos
- `main.cc` — Código fuente del programa en C++
- `README.md` — Descripción del proyecto

## Estructura del programa
- **Entrada:** selección de evento, nombre del comprador, cantidad de boletos
- **Proceso:** validación de cantidad, verificación de inventario, cálculo de pago, aplicación de descuento
- **Salida:** total a pagar, confirmación de compra, inventario actualizado, estado de la transacción

## Estructuras de decisión implementadas
- Decisión simple: validar que la cantidad de boletos sea mayor a 0
- Decisión compuesta: verificar si el inventario es suficiente
- Decisión compuesta: determinar si aplica descuento
- Decisión compuesta: verificar si el pago fue exitoso

## Cómo compilar y ejecutar
```
g++ main.cc -o gestion_boletos
./gestion_boletos
```

## Autor
Xiomara Molina Amaya — 00220826  
Universidad Centroamericana José Simeón Cañas  
Administración de Sistemas Operativos
