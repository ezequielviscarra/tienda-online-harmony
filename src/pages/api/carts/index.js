// pages/api/cart.js

import {conexionDb} from '../../../lib/mongodb';
import Cart from '../../../models/Cart';
import Producto from "../../../models/Producto";


conexionDb();

export default async function handler(req, res) {
  const { method,query } = req;

console.log(method)

console.log(query)

  switch (method) {
    case 'GET':
      try {
        console.log("estoy en el get")
        const { userId } = req.query;
        console.log(userId)
        if (!userId) {
          return res.status(400).json({ message: 'Falta el userId en la solicitud' });
        }
        const cart = await Cart.findOne({ userId: userId });
        
        console.log("option: ", cart)
        
        if (!cart) {
          console.log("esto es por aca")
          return res.status(404).json({ message: 'No se encontró un carrito para este usuario' });
        }
        res.status(200).json(cart);
      } catch (error) {
        console.error('Error al buscar el carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
      }
      break;
    case 'POST':
      try {
        console.log("console Post",req.body)

        const cart = await Cart.findOneAndUpdate(
          { userId: req.body.userId },
          { $set: { items: req.body.items } },
          { new: true, upsert: true }
        );

        res.status(201).json(cart);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
