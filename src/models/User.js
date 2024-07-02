// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  cuil: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  celular: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  direccion: {
    type: String,
    required: true,
  },
  cp: {
    type: String,
    required: true,
  },
  localidad: {
    type: String,
    required: true,
  },
  provincia: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  estado:{
    type:Boolean,
    required:true,
  }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
