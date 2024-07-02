import { conexionDb } from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
  await conexionDb();
  const { id } = req.query;
 

  switch (req.method) {
    
  
    
    default:
     
      res.status(405).end(`Método ${req.method} no permitido`);
      break;
  }
}
