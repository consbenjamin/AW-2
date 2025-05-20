import fs from 'fs/promises';
import bcrypt from 'bcryptjs';

const usuariosFilePath = 'usuarios.json';
const data = await fs.readFile(usuariosFilePath, 'utf-8');
const usuarios = JSON.parse(data);

for (const u of usuarios) {
  if (!u.password.startsWith('$2a$')) {
    u.password = await bcrypt.hash(u.password, 10);
  }
}

await fs.writeFile(usuariosFilePath, JSON.stringify(usuarios, null, 2));
console.log("Usuarios actualizados con contraseñas hasheadas ✅");
