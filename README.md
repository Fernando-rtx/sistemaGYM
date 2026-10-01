# sistemaGYM · Demo web

**[Abrir demo interactiva](https://fernando-rtx.github.io/sistemaGYM/)**

Esta rama conserva las vistas, componentes, tipografía y estilos originales de sistemaGYM. El nombre visible es **sistemaGYM** y se entra directamente como visitante de la demo.

Incluye Panel General, Socios, Check-in, Ventas del Día, Reportes y Configuración. Los socios, transacciones, asistencias y productos son ficticios. Los cambios se guardan en el navegador; no se usa ninguna base de datos ni se realizan cobros reales.

El control del perfil en la barra lateral permite restablecer los datos de ejemplo.

## Publicación

GitHub Pages sirve la rama `demo-github-pages` desde `/(root)`. No requiere compilación ni variables de entorno.

## Desarrollo local

Desde esta carpeta ejecuta `python3 -m http.server 8000` y abre `http://localhost:8000`. Los módulos se deben servir por HTTP.

`src/styles/main.css` y las vistas se reutilizan desde la aplicación original. `src/js/demoStore.js` sustituye las operaciones de datos por almacenamiento local y `src/js/demoSeed.js` genera registros ficticios con fechas relativas a la primera visita.
