// pages/api/auth/register.js
import { useState } from 'react';
import { conexionDb } from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';


conexionDb();

export default async function handler(req, res) {
 
  const { email, password, localidad, cp, provincia, cuil, celular, direccion, nombre, apellido } = req.body;

  // Validación para asegurarse de que todos los campos requeridos estén presentes
  if (!email || !password || !localidad || !cp || !provincia || !cuil || !celular || !direccion || !nombre || !apellido) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'Usuario ya existente' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      localidad,
      cp,
      provincia,
      cuil,
      celular,
      direccion,
      nombre,
      apellido,
      estado: false,
    });

    console.log(user)
    

    // Configurar el transportador de nodemailer
    const transporter = nodemailer.createTransport({
      service: 'hotmail', // o cualquier servicio de correo que utilices
      auth: {
        user: 'ezequielviscarra@hotmail.com', // asegúrate de usar variables de entorno para las credenciales
        pass: 'alciDES1987viscarra', // asegúrate de usar variables de entorno para las credenciales
      },
    });

    // Configurar los detalles del correo
    const mailOptions = {
      from: 'ezequielviscarra@hotmail.com',
      to: 'ezequielviscarra@hotmail.com',
      subject: 'Nuevo registro de usuario',
      text: `Se ha registrado un nuevo usuario con los siguientes datos:
      idUsuario :  ${user._id}
      Nombre: ${user.nombre}
        Apellido: ${user.apellido}
        Email: ${user.email}
        Localidad: ${user.localidad}
        Código Postal: ${user.cp}
        Provincia: ${user.provincia}
        CUIL: ${user.cuil}
        Celular: ${user.celular}
        Dirección: ${user.direccion}
      `,
    };

    // Enviar el correo
 await transporter.sendMail(mailOptions);


    res.status(201).json({ message: 'Usuario credo con exito, Se envio un correo al proveedor lo analizara y te dara de alta, la confirmacion se te avisara via email', user });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
