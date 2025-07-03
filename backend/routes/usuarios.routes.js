import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
import Venta from '../models/Venta.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Obtener todos los usuarios (sin contraseña)
router.get('/', verificarToken, async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});


router.get('/:id', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-password');
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
});

// Registro
router.post('/register', async (req, res) => {
  const { nombre, apellido, email, password } = req.body;

  try {
    const existente = await Usuario.findOne({ email });
    if (existente) return res.status(400).json({ message: 'Ya existe un usuario con ese email' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      nombre,
      apellido,
      email,
      password: hashedPassword
    });

    await nuevoUsuario.save();
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// Login
router.post('/auth', async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const match = await bcrypt.compare(password, usuario.password);
    if (!match) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.nombre, apellido: usuario.apellido },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Autenticación exitosa',
      token,
      user: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al autenticar usuario' });
  }
});


router.put('/:id', verificarToken, async (req, res) => {
  
  const { nombre, apellido, email, password } = req.body;

  if (req.user.id !== req.params.id) {
    return res.status(403).json({ message: 'No autorizado para modificar este usuario' });
  }

  try {
    const updateFields = { nombre, apellido, email };

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    const actualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!actualizado) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
});



router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const eliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ message: 'Usuario no encontrado' });

    await Venta.deleteMany({ id_usuario: req.params.id });

    res.json({ message: 'Usuario y ventas asociadas eliminadas correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
});

export default router;
