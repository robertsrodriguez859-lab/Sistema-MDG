const express = require('express');
const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const db = new DatabaseSync(path.join(__dirname, 'iglesia.db'));

// Módulos válidos actualizados con jóvenes y jóvenes invitados
const MODULOS_VALIDOS = ['miembros', 'jovenes', 'jovenes_invitados', 'escuela_ministerial', 'visitantes', 'casas_paz'];

// Tabla genérica: cada registro pertenece a un módulo y guarda sus campos como JSON
db.exec(`
  CREATE TABLE IF NOT EXISTS registros (
    id TEXT PRIMARY KEY,
    modulo TEXT NOT NULL,
    datos TEXT NOT NULL,
    creado TEXT DEFAULT (datetime('now'))
  )
`);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function validarModulo(req, res, next) {
  if (!MODULOS_VALIDOS.includes(req.params.modulo)) {
    return res.status(400).json({ error: 'Módulo no reconocido' });
  }
  next();
}

function filaAObjeto(fila) {
  return { id: fila.id, ...JSON.parse(fila.datos) };
}

// Listar todos los registros de un módulo
app.get('/api/registros/:modulo', validarModulo, (req, res) => {
  const filas = db.prepare('SELECT * FROM registros WHERE modulo = ? ORDER BY creado DESC').all(req.params.modulo);
  res.json(filas.map(filaAObjeto));
});

// Crear un registro nuevo en un módulo
app.post('/api/registros/:modulo', validarModulo, (req, res) => {
  const id = 'r_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
  db.prepare('INSERT INTO registros (id, modulo, datos) VALUES (?, ?, ?)')
    .run(id, req.params.modulo, JSON.stringify(req.body));
  const fila = db.prepare('SELECT * FROM registros WHERE id = ?').get(id);
  res.status(201).json(filaAObjeto(fila));
});

// Editar un registro existente
app.put('/api/registros/:modulo/:id', validarModulo, (req, res) => {
  const existente = db.prepare('SELECT * FROM registros WHERE id = ? AND modulo = ?').get(req.params.id, req.params.modulo);
  if (!existente) return res.status(404).json({ error: 'Registro no encontrado' });
  db.prepare('UPDATE registros SET datos = ? WHERE id = ?').run(JSON.stringify(req.body), req.params.id);
  const fila = db.prepare('SELECT * FROM registros WHERE id = ?').get(req.params.id);
  res.json(filaAObjeto(fila));
});

// Eliminar un registro
app.delete('/api/registros/:modulo/:id', validarModulo, (req, res) => {
  const info = db.prepare('DELETE FROM registros WHERE id = ? AND modulo = ?').run(req.params.id, req.params.modulo);
  if (info.changes === 0) return res.status(404).json({ error: 'Registro no encontrado' });
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Servidor del sistema de la iglesia corriendo en http://localhost:${PORT}`);
});