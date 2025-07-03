import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';


const JWT_SECRET = process.env.JWT_SECRET;

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token requerido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

export const esAdmin = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.user.id);

    if (!usuario || usuario.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Solo administradores.' });
    }

    next();
  } catch (error) {
    console.error('Error al verificar rol de admin:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};
