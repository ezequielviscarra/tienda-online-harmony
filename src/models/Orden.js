import mongoose from 'mongoose';

const { Schema } = mongoose;

// Esquema para los elementos del carrito
const itemSchema = new Schema({
  _id : {type: String, required: true },
  marca: { type: String, required: true },
  rubro: { type: String, required: true },
  descripcion: { type: String, required: true },
  cantidad: { type: Number, required: true },
  precio: { type: Number, required: true }
}, { _id: false });

// Esquema para el usuario
const userSchema = new Schema({
  id : {type: String, required: true },
  name: { type: String, required: true },
  apellido: { type: String, required: true },
  cuil: { type: String, required: true },
  email: { type: String, required: true },
  id: { type: Schema.Types.ObjectId, required: true }
}, { _id: false });

// Esquema para el pedido (orden)
const orderSchema = new Schema({

  user: { type: userSchema, required: true },
  items: { type: [itemSchema], required: true },
  total: { type: Number, required: true }
},{
  timestamps: true,
  versionKey: false,
});

// Exportación del modelo Orden
export default mongoose.models.Orden || mongoose.model('Orden', orderSchema);
