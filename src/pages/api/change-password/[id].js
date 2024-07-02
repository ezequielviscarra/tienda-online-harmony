// creame un componente api [id]
import { conexionDb } from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
conexionDb();

export default async function handler(req, res) {

  
  const { method,query } = req;
  const {id} = query
 
  console.log("aca estoy")
 


  switch (method) {
   
    case 'PUT':
      
        const{body} = req
        const {password} = body
        console.log(password)
        const hashedPassword = await bcrypt.hash(password, 10);
        body.password = hashedPassword
        console.log(body)
    
      try {
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUser) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(updatedUser);
      } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario' });
      }
   
      break;
   
    default:
     
      res.status(405).end(`Método ${req.method} no permitido`);
      break;
  }
}
