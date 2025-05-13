import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar el archivo usuarios.json
const usuariosFilePath = path.join(__dirname, '../data/usuarios.json');
let usuarios = JSON.parse(fs.readFileSync(usuariosFilePath, 'utf-8'));

// Cargar el archivo ventas.json
const ventasFilePath = path.join(__dirname, '../data/ventas.json');
let ventas = JSON.parse(fs.readFileSync(ventasFilePath, 'utf-8'));

const router = express.Router();

router.get('/', (req, res) => {
  res.json(usuarios);
});

router.get('/:id', (req, res) => {
  const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
  if (usuario) {
    res.json(usuario);
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' });
  }
});

router.post('/', (req, res) => {
  const { nombre, apellido, email, contraseña } = req.body;
  const nuevoUsuario = {
    id: usuarios.length + 1,
    nombre,
    apellido,
    email,
    contraseña
  };
  usuarios.push(nuevoUsuario);
  
  // Guardar los usuarios actualizados en el archivo
  fs.writeFileSync(usuariosFilePath, JSON.stringify(usuarios, null, 2));

  res.status(201).json(nuevoUsuario);
});

// POST - Autenticar un usuario
router.post('/auth', (req, res) => {
  const { email, contraseña } = req.body;
  const usuario = usuarios.find(u => u.email === email && u.contraseña === contraseña);
  if (usuario) {
    res.json({ message: 'Usuario autenticado correctamente', usuario });
  } else {
    res.status(401).json({ message: 'Credenciales incorrectas' });
  }
});

router.put('/:id', (req, res) => {
  const { nombre, apellido, email, contraseña } = req.body;
  const usuarioIndex = usuarios.findIndex(u => u.id === parseInt(req.params.id));

  if (usuarioIndex === -1) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  usuarios[usuarioIndex] = {
    id: parseInt(req.params.id),
    nombre,
    apellido,
    email,
    contraseña
  };

  // Guardar los usuarios actualizados en el archivo
  fs.writeFileSync(usuariosFilePath, JSON.stringify(usuarios, null, 2));

  res.json(usuarios[usuarioIndex]);
});

router.delete('/:id', (req, res) => {
  const usuarioIndex = usuarios.findIndex(u => u.id === parseInt(req.params.id));

  if (usuarioIndex === -1) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  // Buscar las ventas asociadas al usuario
  const ventasAsociadas = ventas.filter(venta => venta.id_usuario === parseInt(req.params.id));

  if (ventasAsociadas.length > 0) {
    // Eliminar todas las ventas asociadas al usuario
    ventas = ventas.filter(venta => venta.id_usuario !== parseInt(req.params.id));
    
    // Guardar las ventas actualizadas en el archivo
    fs.writeFileSync(ventasFilePath, JSON.stringify(ventas, null, 2));
  }

  // Eliminar el usuario
  usuarios.splice(usuarioIndex, 1);
  
  // Guardar los usuarios actualizados en el archivo
  fs.writeFileSync(usuariosFilePath, JSON.stringify(usuarios, null, 2));

  res.status(200).json({ message: 'Usuario eliminado correctamente' });
});

export default router;
