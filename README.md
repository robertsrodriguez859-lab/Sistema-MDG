# Sistema de la Iglesia

Sistema con 4 módulos de registro:
- **Miembros** — feligreses de la congregación
- **Escuela Ministerial** — alumnos en formación
- **Visitantes** — personas que llegan por primera vez
- **Casas de Paz** — grupos que se reúnen en los hogares

Incluye:
- **Frontend**: página web (HTML/CSS/JS) en `public/index.html`
- **Backend**: servidor Node.js + Express (`server.js`)
- **Base de datos**: SQLite, usando el módulo integrado de Node.js (`node:sqlite`) — no requiere instalar nada aparte, ni compiladores. Se guarda en el archivo `iglesia.db` (se crea solo la primera vez que corres el servidor).

## Requisitos
- Tener [Node.js](https://nodejs.org) instalado (versión 18 o superior recomendada).

## Cómo correrlo en Visual Studio Code

1. Abre esta carpeta (`sistema-iglesia`) en Visual Studio Code.
2. Abre una terminal integrada (`Terminal` → `New Terminal`).
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Inicia el servidor:
   ```bash
   npm start
   ```
5. Abre tu navegador en:
   ```
   http://localhost:3000
   ```

Listo — ya puedes agregar, editar, buscar y eliminar miembros. Todo se guarda automáticamente en `iglesia.db`.

## Estructura del proyecto

```
sistema-iglesia/
├── server.js         → servidor Express + rutas de la API
├── package.json      → dependencias del proyecto
├── iglesia.db         → base de datos SQLite (se crea al iniciar)
└── public/
    └── index.html    → la interfaz web completa
```

## Rutas del API (por si quieres extenderlo)

Todas las rutas usan `:modulo`, que puede ser `miembros`, `escuela_ministerial`, `visitantes` o `casas_paz`.

| Método | Ruta                          | Qué hace                    |
|--------|-------------------------------|------------------------------|
| GET    | /api/registros/:modulo        | Devuelve todos los registros de ese módulo |
| POST   | /api/registros/:modulo        | Crea un registro nuevo       |
| PUT    | /api/registros/:modulo/:id    | Edita un registro existente  |
| DELETE | /api/registros/:modulo/:id    | Elimina un registro          |

## Ideas para seguir creciendo el sistema
- Control de asistencia a servicios
- Registro de diezmos/ofrendas
- Exportar cualquier módulo a Excel o PDF
- Login de usuarios para que solo el personal autorizado pueda entrar
- Agregar un quinto módulo (por ejemplo, seguimiento de nuevos convertidos) — solo hay que añadir un objeto nuevo al arreglo `MODULOS` en `public/index.html`
