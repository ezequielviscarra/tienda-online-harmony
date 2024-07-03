// creame el codigo de un componente de reac para obtener datos de una base de datos en a una api /api/productos sin axios

import React, { useEffect, useState } from 'react';

const Productos = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/productos');
        if (!response.ok) {
          throw new Error('Error al obtener los productos');
        }
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Productos</h1>
      <ul>
        {productos.map((producto) => (
          <li key={producto._id}>{producto.Descripcion}</li>
        ))}
      </ul>
    </div>
  );
};

export default Productos;
