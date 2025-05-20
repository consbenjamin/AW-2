import express from 'express';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
  res.json(usuarios.map(({ password, ...rest }) => rest)); // ocultar passwords
});

router.get('/:id', (req, res) => {
  const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
  if (usuario) {
    const { password, ...data } = usuario;
    res.json(data);
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' });
  }
});

// Registro
router.post('/', async (req, res) => {
  const { nombre, apellido, email, password } = req.body;

  const usuarioExistente = usuarios.find(u => u.email === email);
  if (usuarioExistente) {
    return res.status(400).json({ message: 'Ya existe un usuario con ese email' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const nuevoUsuario = {
    id: usuarios.length + 1,
    nombre,
    apellido,
    email,
    password: hashedPassword
  };

  usuarios.push(nuevoUsuario);
  fs.writeFileSync(usuariosFilePath, JSON.stringify(usuarios, null, 2));

  res.status(201).json({ message: 'Usuario registrado correctamente' });
});

// Login
router.post('/auth', async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const { email, password } = req.body;
  
  const usuario = usuarios.find(u => u.email === email);
  if (!usuario) {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }
  
  const match = await bcrypt.compare(password, usuario.password);
  if (!match) {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }

  const token = jwt.sign(
    { id: usuario.id, nombre: usuario.nombre, apellido: usuario.apellido },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ message: 'Autenticación exitosa', 
    token,
    user: { 
      id: usuario.id, 
      nombre: usuario.nombre, 
      apellido: usuario.apellido, 
      email: usuario.email }
  });
});

// Modificar usuario
router.put('/:id', async (req, res) => {
  const { nombre, apellido, email, password } = req.body;
  const usuarioIndex = usuarios.findIndex(u => u.id === parseInt(req.params.id));

  if (usuarioIndex === -1) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  usuarios[usuarioIndex] = {
    id: parseInt(req.params.id),
    nombre,
    apellido,
    email,
    password: hashedPassword
  };

  fs.writeFileSync(usuariosFilePath, JSON.stringify(usuarios, null, 2));
  res.json({ message: 'Usuario actualizado correctamente' });
});

// Eliminar usuario (y sus ventas asociadas)
router.delete('/:id', (req, res) => {
  const usuarioIndex = usuarios.findIndex(u => u.id === parseInt(req.params.id));
  if (usuarioIndex === -1) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  const id_usuario = parseInt(req.params.id);
  ventas = ventas.filter(venta => venta.id_usuario !== id_usuario);
  fs.writeFileSync(ventasFilePath, JSON.stringify(ventas, null, 2));

  usuarios.splice(usuarioIndex, 1);
  fs.writeFileSync(usuariosFilePath, JSON.stringify(usuarios, null, 2));

  res.status(200).json({ message: 'Usuario y ventas asociadas eliminadas correctamente' });
});

export default router;
