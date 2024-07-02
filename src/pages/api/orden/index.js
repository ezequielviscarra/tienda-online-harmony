import { conexionDb } from '../../../lib/mongodb';
import Orden from "../../../models/Orden";
import nodemailer from 'nodemailer';
import Cart from '../../../models/Cart';


conexionDb();

export default async function handler(req, res) {
    const { method, body } = req;



    switch (method) {
        case 'GET':
            try {
                // Lógica para obtener datos del carrito
                res.status(200).json("get"); // Cambiar por la lógica adecuada
            } catch (error) {
                res.status(500).json({ error: "Error al obtener datos del carrito" });
            }
            break;
        case 'POST':
            try {
                // Verificar si los datos requeridos están presentes en el cuerpo de la solicitud
                console.log(method)
                const { compra } = body;
                const { user, items, total, idCarrito } = compra;
                console.log("imprimo id compra: ",idCarrito)

                if (!user || !items || total === undefined) {
                    return res.status(400).json({ error: "Datos incompletos para crear la orden" });
                }

                console.log(items)

                const nuevaOrden = new Orden({
                    user,
                    items,
                    total
                });

                // Guardar la nueva orden en la base de datos
                const ordenGuardada = await nuevaOrden.save();
                console.log("aqui imprimo orden guardada", ordenGuardada)
                console.log(ordenGuardada._id)

                const transporter = nodemailer.createTransport({
                    service: 'hotmail', // o cualquier servicio de correo que utilices
                    auth: {
                        user: 'ezequielviscarra@hotmail.com', // asegúrate de usar variables de entorno para las credenciales
                        pass: 'alciDES1987viscarra', // asegúrate de usar variables de entorno para las credenciales
                    },
                });

                const mailOptions = {
                    from: 'ezequielviscarra@hotmail.com',
                    to: `ezequielviscarra@hotmail.com, ${user.email}`, // Cambia esto al correo del destinatario
                    subject: 'Nuevo Pedido',
                    html: `
        <h1>Nuevo Pedido Registrado</h1>
        <h2><strong>Identificador de orden:</strong> ${ordenGuardada._id.toString()} </h2>

        <h2>Usuario:</h2>
        <ul>
          <li><strong>ID:</strong> ${user.id}</li>
          <li><strong>Nombre:</strong> ${user.name}</li>
          <li><strong>Apellido:</strong> ${user.apellido}</li>
          <li><strong>dni:</strong> ${user.cuil}</li>
          <li><strong>Email:</strong> ${user.email}</li>
          <li><strong>Celular:</strong> ${user.celular}</li>
          
        </ul>
        <h2>Items:</h2>
        <table border="1" cellspacing="0" cellpadding="5">
          <thead>
            <tr>
              <th>Marca</th>
              <th>Rubro</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
            <tr>
              <td>${item.marca}</td>
              <td>${item.rubro}</td>
              <td>${item.descripcion}</td>
              <td>${item.cantidad}</td>
              <td>${item.precio}</td>
              <td>${(item.cantidad * item.precio).toFixed(2)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
        <h2>Total de la Orden: $${total.toFixed(2)}</h2>
        <p>Por favor, revisa los detalles y procesa el pedido en consecuencia.</p>
        `,
                };

                // Enviar el correo
                await transporter.sendMail(mailOptions);

                const deletedCart = await Cart.findByIdAndDelete(idCarrito);
                // Respuesta de éxito con el obj const deletedCart = await Cart.findByIdAndDelete(id);
                if (!deletedCart) {
                    return res.status(404).json({ success: false, message: 'Carrito no encontrado' });
                }
                res.status(200).json({ success: true, message: 'Carrito eliminado correctamente',orden:ordenGuardada });
                
            } catch (error) {
                console.error("Error al guardar la orden:", error);
                res.status(500).json({ error: "Error al guardar la orden en la base de datos", error });
            }


            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Método ${method} no permitido`);
            break;
    }
}
