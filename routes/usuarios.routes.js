import express from 'express';
import usuarios from '../data/usuarios.js';

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

  res.json(usuarios[usuarioIndex]);
});


router.delete('/:id', (req, res) => {
  const usuarioIndex = usuarios.findIndex(u => u.id === parseInt(req.params.id));

  if (usuarioIndex === -1) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  // Eliminar todas las ventas asociadas al usuario.
  ventas = ventas.filter(venta => venta.id_usuario !== parseInt(req.params.id));

  usuarios.splice(usuarioIndex, 1);
  res.status(200).json({ message: 'Usuario eliminado correctamente' });
});

export default router;
