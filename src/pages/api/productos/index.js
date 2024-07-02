// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { conexionDb } from "../../../lib/mongodb";
import Producto from "../../../models/Producto";
import mongoose from "mongoose";

conexionDb();

export default async function handler(req, res) {
  const { method, body } = req;

  switch (method) {
    case "GET":
      try {
        if (req.body.length > 0) {
          // Si el body tiene elementos, se realiza la consulta con los IDs específicos
          const query = { $or: req.body.map((obj) => ({ _id: obj._id })) };
          const productos = await Producto.find(query).sort({
            Marca: 1,
            Rubro: 1,
            Descripcion: 1,
          });
          return res.status(200).json(productos);
        } else {
          // Si el body está vacío, se devuelve todos los productos
          const productos = await Producto.find().sort({
            Marca: 1,
            Rubro: 1,
            Descripcion: 1,
          });
          return res.status(200).json(productos);
        }
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }

    case "POST":
      try {
        let productos = Array.isArray(body) ? body : [body]; // Convertir a un array si es un objeto único
        console.log(productos);
        const startNumber = 10000000000000000n; // Número inicial para la generación autoincrementable

        const existingBarcodes = await Producto.aggregate([
          {
            $match: {
              $expr: {
                $gte: [
                  { $toLong: "$Codigo" }, // Convertir el campo Codigo a tipo Long
                  startNumber,
                ],
              },
            },
          },
          {
            $project: {
              Codigo: 1,
            },
          },
        ]);

        console.log(existingBarcodes);

        // Verificar si el campo Codigo está vacío y generar autoincrementable si es necesario
        for (let i = 0; i < productos.length; i++) {
          const producto = productos[i];
          if (producto.Codigo === "") {
            if (existingBarcodes.length === 0) {
              console.log("verdadero");
              const codigo = startNumber.toString();
              productos[i].Codigo = codigo;
            } else {
              const maxBarcode = existingBarcodes.reduce((max, current) => {
                const currentBarcode = BigInt(current.Codigo);
                return currentBarcode > max ? currentBarcode : max;
              }, 0n);

              const nextBarcode = maxBarcode + 1n;
              const codigo = nextBarcode.toString();
              productos[i].Codigo = codigo;
            }
          }
        }

        const resultado = await Producto.insertMany(productos);
        console.log(resultado);

        return res.status(201).json(resultado);
      } catch (error) {
        console.error("Error al guardar los productos:", error);

        if (error instanceof mongoose.Error.ValidationError) {
          // El error es de validación del esquema
          return res
            .status(400)
            .json({ error: "Error de validación del esquema" });
        } else {
          // Otro tipo de error
          return res.status(500).json({ error: "Error interno del servidor" });
        }
      }

    /*
      try {
        const productos = body;
        console.log(productos); // Suponiendo que los objetos a guardar se encuentran en el cuerpo de la solicitud

        const resultado = await Producto.insertMany(productos);
        console.log(resultado);

        return res.status(201).json(resultado);
      } catch (error) {
        console.error("Error al guardar los productos:", error);

        if (error instanceof mongoose.Error.ValidationError) {
          // El error es de validación del esquema
          return res
            .status(400)
            .json({ error: "Error de validación del esquema" });
        } else {
          // Otro tipo de error
          return res.status(500).json({ error: "Error interno del servidor" });
        }
      }
     */

    case "DELETE":
      try {
        await Producto.deleteMany({});
        return res
          .status(200)
          .json({ mensaje: "todos los productos se han eliminados" });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    case "PUT":
      try {
        console.log("voy sin id");
        const {
          Marca,
          Rubro,
          PrecioCompra,
          PrecioVenta,
          Lista2,
          Lista3,
          Lista4,
          Lista5,
        } = body;
        // Actualizar los precios de los productos en la marca y rubro especificados
        //console.log(body);
        console.log(Marca, Rubro);

        const productosEncontrados = await Producto.find({
          Marca: Marca,
          Rubro: Rubro,
        });
        console.log("productosEncontrados");
        console.log(productosEncontrados);

        const result = await Producto.updateMany(
          { Marca: Marca, Rubro: Rubro },
          {
            $set: {
              PrecioCompra: PrecioCompra,
              PrecioVenta: PrecioVenta,
              Lista2: Lista2,
              Lista3: Lista3,
              Lista4: Lista4,
              Lista5: Lista5,
              "FechasModif.PrecioVenta": new Date(),
              "FechasModif.PrecioCompra": new Date(),
              "FechasModif.Lista2": new Date(),
              "FechasModif.Lista3": new Date(),
              "FechasModif.Lista4": new Date(),
              "FechasModif.Lista5": new Date(),
            },
          }
        );
        //console.log(result);
        return res.status(200).json({ msg: result });
      } catch (error) {
        console.error("Error al actualizar los precios:", error.message);
        return res.status(400).json({ error: error.message });
      }
    default:
      return res.status(400).json({ msg: "el metodo no es soportado" });
  }

  return res.status(400).json({ msg: "Hola Mundo" });
}
