// models/cart.js

import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
      cantidad: { type: Number, required: true },
    },
  ],
});

export default mongoose.models.Cart || mongoose.model('Cart', CartSchema);
