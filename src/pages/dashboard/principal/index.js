import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";


export default function Home() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const [carrito, setCarrito] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false); // Flag para controlar la actualización
  const [saving, setSaving] = useState(false); // Flag para controlar el guardado del carrito
  const [search, setSearch] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([])
  const [banderaFiltrar, setBanderaFiltrar] = useState(false)

  const fetchCart = async () => {
    console.log("estoy procesando el fetchCart")
    if (session && session.user) {
      try {
        const response = await fetch(`/api/carts?userId=${session.user.id}`);
        if (response.ok) {
          const data = await response.json();
          setCarrito(data.items);
        } else {
          console.log("No hay carrito activo");
      
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    }
  };

  const fetchDataProductos = async () => {
    console.log(isUpdated);
    
    if (!isUpdated) {  // Simplificado para mejorar la legibilidad
       
        if (session && session.user) {
            try {
                const response = await fetch("/api/productos");
                if (!response.ok) {
                    throw new Error("No se pudo obtener los datos api productos");
                }
                const dataProductos = await response.json();
                console.log(dataProductos)

                const res = await fetch(`/api/carts?userId=${session.user.id}`);
                console.log("imprimiendo respuesta", res)
                if (!res.ok) {
                  console.log("El carrito está vacío.");
                  
                  
                }
                const dataCarrito = await res.json();
                
                // Asegúrate de que dataCarrito.items exista y tenga elementos
                if (dataCarrito.items && dataCarrito.items.length > 0) {
                    console.log("El carrito tiene elementos.");

                    const productosActualizados = dataProductos.map((producto) => {
                        const itemCarrito = dataCarrito.items.find((item) => item._id === producto._id);
                        return {
                            ...producto,
                            cantidad: itemCarrito ? itemCarrito.cantidad : 0,
                        };
                    });
                    console.log(productosActualizados);
                    setProductos(productosActualizados);
                    setProductosFiltrados(productosActualizados);
                  
                } else {
                    console.log("El carrito está vacío.");
                    alert("No hay carrito activo")
                    const productosConCantidad = dataProductos.map((producto) => ({
                        ...producto,
                        cantidad: 0, // Inicializa la cantidad a 0 para cada producto
                    }));
                    setProductos(productosConCantidad);
                    setProductosFiltrados(productosConCantidad);
                }

                setIsUpdated(true);
            } catch (error) {
                setError(error);
                console.error("Error en la carga de datos:", error);
            }
        }
    }
};

  const saveCart = async (productos) => {
    console.log("guardando carrito")
    console.log(productos)
    const itemsToSave = productos.filter(producto => producto.cantidad > 0);
    console.log("imprimiendo itemtoSave",itemsToSave)
    try {
      const response = await fetch("/api/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          items: itemsToSave,
        }),
      });
      if (!response.ok) {
        throw new Error("Error al guardar el carrito");
      }
      // Actualizar el estado del carrito
      setCarrito(itemsToSave);
    } catch (error) {
      console.error("Error al guardar el carrito:", error);
      setError(error);
    }
  };



  useEffect(() => {

    fetchDataProductos();
    fetchCart()

  }, [session]);

  const handleInputChange = (id,index, value) => {
    const newProductos = [...productos];
    const productIndex = newProductos.find((producto) => producto._id === id);
    for (let i = 0; i < newProductos.length; i++) {
      if (newProductos[i]._id === id) {
        console.log(newProductos[i])
        newProductos[i].cantidad = value
        console.log(newProductos[i])
        break;
      }
    }
    
  
    //setProductos(newProductos);
    console.log(id)
    console.log(newProductos)
    //setProductosFiltrados(newProductos)
    
    setSaving(true); // Marcar que estamos guardando
  };

  useEffect(() => {
    const saveCartInBackground = async () => {
      if (saving) {
        console.log(productos)
        await saveCart(productos);
        setSaving(false); // Resetear la bandera después de guardar
      }
    };

    saveCartInBackground();
  }, [saving]);

  
  const resetQuantities = () => {
    if (window.confirm("¿Seguro que desea resetear el pedido?")) {
      const productosReseteados = productos.map(producto => ({
        ...producto,
        cantidad: 0
      }));
      setProductos(productosReseteados);
      setProductosFiltrados(productosReseteados);
      setSaving(true); // Guardar el carrito reseteado
    } else {
      // Código a ejecutar si se cancela la acción (opcional)
    }
  };

  const searcher = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const searchKeywords = searchTerm.toLowerCase().split(" ");
    const filteredProductos = productos.filter((producto) => {
      const productAttributes = Object.values(producto).join(" ").toLowerCase();
      return searchKeywords.every((keyword) =>
        productAttributes.includes(keyword)
      );
    });
    const sortedProductos = filteredProductos.sort((a, b) => {
      const aKeywordsMatched = searchKeywords.filter((keyword) =>
        Object.values(a).join(" ").toLowerCase().includes(keyword)
      ).length;
      const bKeywordsMatched = searchKeywords.filter((keyword) =>
        Object.values(b).join(" ").toLowerCase().includes(keyword)
      ).length;
      return bKeywordsMatched - aKeywordsMatched;
    });
    console.log(sortedProductos)
    setProductosFiltrados(sortedProductos);
    setSearch(e.target.value);
  };


  const agruparPorMarcaYRubro = () => {
    const groupedProducts = {};
    productosFiltrados.forEach((producto) => {
      const key = `${producto.Marca}-${producto.Rubro}`;
      if (!groupedProducts[key]) {
        groupedProducts[key] = { ...producto, cantidadTotal: producto.cantidad };
      } else {
        groupedProducts[key].cantidadTotal += producto.cantidad;
      }
    });
    return Object.values(groupedProducts);
  };
 

  const groupedByMarca = productosFiltrados.reduce((acc, producto) => {
    const marca = producto.Marca;
    if (!acc[marca]) {
      acc[marca] = [];
    }
    acc[marca].push(producto);
    return acc;
  }, {});



  const filtroCantidad = () => {
    if(banderaFiltrar === false){
      setBanderaFiltrar(true)
    }else{
      setBanderaFiltrar(false)
    }

   
  };
  
  return (
    <div>
      <div className="container my-6">
        <h1 style={{color: '#ffffff'}} className="text-center mb-4"><strong>REALIZAR PEDIDO</strong></h1>
        {error && <p className="text-danger"><strong>Error:</strong> {error.message}</p>}
        <div className="table-responsive">
          <div className="text-danger">
            Al momento de realizar el pedido puede que tengamos diferencia con el stock que mustra la pagina! para finalizar la compra y ver el monto total ve al menu CARRITO    
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por descripción ej: saphirus aerosol"
              onChange={searcher}

            />
          </div>
          
          <button onClick={resetQuantities} className="btn btn-danger mt-3 px-4">Resetear Cantidades</button>
<button onClick={filtroCantidad} className="btn btn-dark mt-3 px-4">Mostrar solo lo pedido</button>

         
          <table className="table table-striped table-bordered table-hover">
            <thead className="thead-dark">
              <tr>
                <th><strong>Marca</strong></th>
                <th><strong>Rubro</strong></th>
                <th><strong>Descripción</strong></th>
                <th><strong>Precio Sugerido</strong></th>
                <th><strong>1u a 19u</strong></th>
                <th><strong>+19u</strong></th>
                <th><strong>Cantidad</strong></th>
              </tr>
            </thead>
            <tbody>
           
            {banderaFiltrar ? (
  productosFiltrados.filter(item => item.cantidad > 0).map((item, index) => (
    <tr key={index}>
      <td><strong>{item.Marca}</strong></td>
      <td><strong>{item.Rubro}</strong></td>
      <td><strong>{item.Descripcion}</strong></td>
      <td><strong>{item.PrecioVenta}</strong></td>
      <td><strong>{item.Lista3}</strong></td>
      <td><strong>{item.Lista4}</strong></td>
      <td>
        <input
          type="number"
          value={item.cantidad}
          onChange={(e) => handleInputChange(item._id, index, parseInt(e.target.value) || 0)}
          min="0"
          placeholder="Cantidad"
          className="form-control"
        />
      </td>
    </tr>
  ))
) : (
  productosFiltrados.map((item, index) => (
    <tr key={index}>
      <td><strong>{item.Marca}</strong></td>
      <td><strong>{item.Rubro}</strong></td>
      <td><strong>{item.Descripcion}</strong></td>
      <td><strong>{item.PrecioVenta}</strong></td>
      <td><strong>{item.Lista3}</strong></td>
      <td><strong>{item.Lista4}</strong></td>
      <td>
        {item.Stock > 0 ? (
          <input
            type="number"
            value={item.cantidad}
            onChange={(e) => handleInputChange(item._id, index, parseInt(e.target.value) || 0)}
            min="0"
            placeholder="Cantidad"
            className="form-control"
          />
        ) : (
          <span className="text-danger"><strong>SIN STOCK</strong></span>
        )}
      </td>
    </tr>
  ))
)}

              
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <h2 className="mb-3"><strong>Carrito de Compras</strong></h2>
          <ul className="list-group">
            {carrito.map((item, index) => (
              <li key={index} className="list-group-item">
                <strong>{item._id}</strong> - <strong>Cantidad:</strong> {item.cantidad}
              </li>
            ))}
          </ul>
        </div>
      </div>
     
      
      <div className="whatsapp-logo">
                <Link href="https://wa.me/3482645499" target="_blank" rel="noopener noreferrer">
                   Chatea con Nosotros <Image src="/whatsapp-logo.png" alt="Chatea con nosotros" width={50} height={50} />
                </Link>
            </div>
            <style jsx>{`
    .whatsapp-logo {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }
  `}</style>
    </div>
    
  );
}



/*
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const [carrito, setCarrito] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false); // Flag para controlar la actualización
  const [saving, setSaving] = useState(false); // Flag para controlar el guardado del carrito

  const fetchCart = async () => {
    if (session && session.user) {
      try {
        const response = await fetch(`/api/carts?userId=${session.user.id}`);
        if (response.ok) {
          const data = await response.json();
          setCarrito(data.items);
        } else {
          console.log("No hay carrito activo");
          alert("No hay carrito activo");
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    }
  };

  const fetchDataProductos = async () => {
    if (session && session.user) {
      try {
        const response = await fetch("/api/productos");
        if (!response.ok) {
          throw new Error("No se pudo obtener los datos");
        }
        const dataProductos = await response.json();
        const productosConCantidad = dataProductos.map((producto) => {
          const itemEnCarrito = carrito.find((item) => item._id === producto._id);
          return {
            ...producto,
            cantidad: itemEnCarrito ? itemEnCarrito.cantidad : 0,
          };
        });
        setProductos(productosConCantidad);
      } catch (error) {
        setError(error);
      }
    }
  };

  const saveCart = async (productos) => {
    const itemsToSave = productos.filter(producto => producto.cantidad > 0);
    try {
      const response = await fetch("/api/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          items: itemsToSave,
        }),
      });
      if (!response.ok) {
        throw new Error("Error al guardar el carrito");
      }
      // Actualizar el estado del carrito
      setCarrito(itemsToSave);
    } catch (error) {
      console.error("Error al guardar el carrito:", error);
      setError(error);
    }
  };

  useEffect(() => {
    if (session && status === "authenticated") {
      fetchCart();
    }
  }, [session, status]);

  useEffect(() => {
    if (carrito.length > 0) {
      fetchDataProductos();
    }
  }, [carrito]);

  const handleInputChange = (index, value) => {
    const newProductos = [...productos];
    newProductos[index].cantidad = value;
    setProductos(newProductos);
    setSaving(true); // Marcar que estamos guardando
  };

  useEffect(() => {
    if (saving) {
      saveCart(productos);
      setSaving(false); // Resetear la bandera después de guardar
    }
  }, [saving]);

  return (
    <div>
      <h1>Realizar Pedido</h1>
      {error && <p>Error: {error.message}</p>}
      <div className="container">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Marca</th>
              <th>Rubro</th>
              <th>Descripción</th>
              <th>Precio Sugerido</th>
              <th>Lista 3</th>
              <th>Lista 4</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((item, index) => (
              <tr key={index}>
                <td>{item._id}</td>
                <td>{item.Marca}</td>
                <td>{item.Rubro}</td>
                <td>{item.Descripcion}</td>
                <td>{item.PrecioVenta}</td>
                <td>{item.Lista3}</td>
                <td>{item.Lista4}</td>
                <td>
                  {item.Stock > 0 ? (
                    <input
                      type="number"
                      value={item.cantidad}
                      onChange={(e) => handleInputChange(index, parseInt(e.target.value) || 0)}
                      min="0"
                      placeholder="Cantidad"
                      className="form-control"
                    />
                  ) : (
                    "SIN STOCK"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2>Carrito de Compras</h2>
        <ul>
          {carrito.map((item, index) => (
            <li key={index}>
              {item._id} - Cantidad: {item.cantidad}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
*/
/*
import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";


export default function Home() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const [carrito, setCarrito] = useState([]);
  
  

  const fetchData = async () => {
    try {
      const response = await fetch("/api/productos");
      if (!response.ok) {
        throw new Error("No se pudo obtener los datos");
      }
      const data = await response.json();
      const productosConCantidad = data.map(producto => {
        const itemEnCarrito = carrito.find(item => item._id === producto._id);
        return {
          ...producto,
          cantidad: itemEnCarrito ? itemEnCarrito.cantidad : 0
        };
      });
      setProductos(productosConCantidad);
    } catch (error) {
      setError(error);
    }
  };

  const fetchCart = async () => {
    if (session && session.user) {
      try {
        const response = await fetch(`/api/carts?userId=${session.user.id}`);
        if (response.ok) {
          const data = await response.json();
          setCarrito(data.items);
          if (!data.items || data.items.length === 0) {
            alert("No hay carrito activo");
          }
        } else {
          alert("No hay carrito activo");
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    }
  };



 

  



  const saveCart = async (updatedCarrito) => {
    if (session && session.user) {
      try {
        const response = await fetch("/api/carts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.user.id,
            items: updatedCarrito,
          }),
        });
        if (!response.ok) {
          throw new Error("Error saving cart");
        }
      } catch (error) {
        console.error("Error saving cart:", error);
      }
    }
  };


  const handleSaveCart = async () => {
    const updatedCarrito = productos.filter((item) => item.cantidad > 0);
 
    await saveCart(updatedCarrito);

    await fetchCart()

  };

  const handleInputChange = async (index, value) => {
   
    const newProductos = [...productos];
    newProductos[index].cantidad = value;
   
    setProductos(newProductos);
    await handleSaveCart()
  };



  useEffect(() => {

    
    const initFetch = async () => {
      await fetchData();
      await fetchCart();
    };
  
    initFetch();
  

    console.log(productos)
    console.log(carrito)

  }, [session]);

  return (
    <div>
      <h1>Realizar Pedido</h1>
      <div className="container">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Marca</th>
              <th>Rubro</th>
              <th>Descripción</th>
              <th>Precio Sugerido</th>
              <th>Lista 3</th>
              <th>Lista 4</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((item, index) => (
              <tr key={index}>
                <td>{item._id}</td>
                <td>{item.Marca}</td>
                <td>{item.Rubro}</td>
                <td>{item.Descripcion}</td>
                <td>{item.PrecioVenta}</td>
                <td>{item.Lista3}</td>
                <td>{item.Lista4}</td>
                <td>
                  {item.Stock > 0 ? 
                      <input
                        type="number"
                        value={item.cantidad || ""}
                        onChange={(e) => handleInputChange(index, parseInt(e.target.value))}
                        min="0"
                        placeholder="Cantidad"
                        className="form-control"
                      />
                    
                  : (
                    "SIN STOCK"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2>Carrito de Compras</h2>
        <ul>
          {carrito.map((item, index) => (
            <li key={index}>
              {item._id} - Cantidad: {item.cantidad}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
*/
/*import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { TailSpin } from 'react-loader-spinner';
import debounce from 'lodash.debounce';

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const [carrito, setCarrito] = useState([]);
  const [loadingIndices, setLoadingIndices] = useState([]); // Array of loading indices

  const fetchData = async () => {
    try {
      const response = await fetch("/api/productos");
      if (!response.ok) {
        throw new Error("No se pudo obtener los datos");
      }
      const data = await response.json();
      const productosConCantidad = data.map(producto => {
        const itemEnCarrito = carrito.find(item => item._id === producto._id);
        return {
          ...producto,
          cantidad: itemEnCarrito ? itemEnCarrito.cantidad : 0
        };
      });
      setProductos(productosConCantidad);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [carrito]);

  const fetchCart = async () => {
    if (session && session.user) {
      try {
        const response = await fetch(`/api/carts?userId=${session.user.id}`);
        if (response.ok) {
          const data = await response.json();
          setCarrito(data.items);
          if (!data.items || data.items.length === 0) {
            alert("No hay carrito activo");
          }
        } else {
          alert("No hay carrito activo");
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    }
  };

  useEffect(() => {
    fetchCart();
  }, [session]);

  const saveCart = async (updatedCarrito) => {
    if (session && session.user) {
      try {
        const response = await fetch("/api/carts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.user.id,
            items: updatedCarrito,
          }),
        });
        if (!response.ok) {
          throw new Error("Error saving cart");
        }
      } catch (error) {
        console.error("Error saving cart:", error);
      }
    }
  };

  const debouncedSaveCart = debounce(async () => {
    const updatedCarrito = productos.filter((item) => item.cantidad > 0);
    await saveCart(updatedCarrito);
    fetchCart();
  }, 500); // Adjust the debounce delay as needed

  const handleSaveCart = () => {
    return new Promise((resolve) => {
      debouncedSaveCart();
      resolve();
    });
  };

  const handleInputChange = (index, value) => {
    setLoadingIndices((prev) => [...prev, index]);
    const newProductos = [...productos];
    newProductos[index].cantidad = value;
    setProductos(newProductos);
    handleSaveCart().finally(() => {
      setLoadingIndices((prev) => prev.filter((i) => i !== index));
    });
  };

  return (
    <div>
      <h1>Realizar Pedido</h1>
      <div className="container">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Marca</th>
              <th>Rubro</th>
              <th>Descripción</th>
              <th>Precio Sugerido</th>
              <th>Lista 3</th>
              <th>Lista 4</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((item, index) => (
              <tr key={index}>
                <td>{item._id}</td>
                <td>{item.Marca}</td>
                <td>{item.Rubro}</td>
                <td>{item.Descripcion}</td>
                <td>{item.PrecioVenta}</td>
                <td>{item.Lista3}</td>
                <td>{item.Lista4}</td>
                <td>
                  {item.Stock > 0 ? (
                    loadingIndices.includes(index) ? (
                      <TailSpin color="#00BFFF" height={30} width={30} />
                    ) : (
                      <input
                        type="number"
                        value={item.cantidad || ""}
                        onChange={(e) => handleInputChange(index, parseInt(e.target.value))}
                        min="0"
                        placeholder="Cantidad"
                        className="form-control"
                      />
                    )
                  ) : (
                    "SIN STOCK"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2>Carrito de Compras</h2>
        <ul>
          {carrito.map((item, index) => (
            <li key={index}>
              {item._id} - Cantidad: {item.cantidad}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
*/


/*import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { TailSpin } from 'react-loader-spinner';

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(false); // Estado de carga


  const fetchData = async () => {
    try {
      const response = await fetch("/api/productos");
      if (!response.ok) {
        throw new Error("No se pudo obtener los datos");
      }
      const data = await response.json();
      // Asumiendo que data es un array de productos
      const productosConCantidad = data.map(producto => {
        const itemEnCarrito = carrito.find(item => item._id === producto._id);
        return {
          ...producto,
          cantidad: itemEnCarrito ? itemEnCarrito.cantidad : 0
        };
      });
      setProductos(productosConCantidad);
      console.log("aca termino")
      setLoading(false)
      
    } catch (error) {
      setError(error);
    }
  };

  // Fetch products data
  useEffect(() => {

    fetchData();
  }, [carrito]);

  const fetchCart = async () => {
    if (session && session.user) {
      try {
        const response = await fetch(`/api/carts?userId=${session.user.id}`);
        if (response.ok) {
          const data = await response.json();
          setCarrito(data.items);
          console.log("imprimoProductos", productos)

          console.log("imprimo carrito", data.items)
          if (!data.items || data.items.length === 0){
            console.log("data no existe")
            alert("No hay carrito activo")
          }

        } else {
          console.log("No hay carrito activo");
          alert("No hay carrito activo")
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    }
  };

  // Fetch cart data
  useEffect(() => {
    fetchCart();
  }, [session]);

  // Save cart data
  const saveCart = async (updatedCarrito) => {
    console.log(updatedCarrito)

    if (session && session.user) {
      try {
        const response = await fetch("/api/carts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.user.id,
            items: updatedCarrito,
          }),
        });
        if (!response.ok) {
          throw new Error("Error saving cart");
        }
      } catch (error) {
        console.error("Error saving cart:", error);
      }
    }

  };

  const handleSaveCart = async () => {
    const updatedCarrito = productos.filter((item) => item.cantidad > 0);
    console.log("Guardando carrito:", updatedCarrito);
    await saveCart(updatedCarrito);

    fetchCart()

  };

  // Handle input change for quantity
  const handleInputChange = async (index, value) => {
    console.log("aca empiezo")
   
    setLoading(true)
    const newProductos = [...productos];
    newProductos[index].cantidad = value;

    setProductos(newProductos);

    handleSaveCart();

  };

  const handleInputBlurOrEnter = async (index) => {
    setLoadingIndices((prev) => [...prev, index]); // Mostrar spinner
    await handleSaveCart(index);
    setLoadingIndices((prev) => prev.filter((i) => i !== index)); // Ocultar spinner
  };


  return (
    <div>
      <h1>Realizar Pedido</h1>
      <div className="container">
      
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Marca</th>
              <th>Rubro</th>
              <th>Descripción</th>
              <th>Precio Sugerido</th>
              <th>Lista 3</th>
              <th>Lista 4</th>

              <th>Cantidad</th>
            
            </tr>
          </thead>
          <tbody>
            {productos.map((item, index) => (
              <tr key={index}>
                <td>{item._id}</td>
                <td>{item.Marca}</td>
                <td>{item.Rubro}</td>
                <td>{item.Descripcion}</td>
                <td>{item.PrecioVenta}</td>
                <td>{item.Lista3}</td>
                <td>{item.Lista4}</td>

                <td>
                  {item.Stock > 0 ? (
                    loading ? (
                      <TailSpin color="#00BFFF" height={30} width={30} />
                    ) : (
                      <input
                        type="number"
                        value={item.cantidad || ""}
                        onChange={(e) => handleInputChange(index, parseInt(e.target.value))}
                        onBlur={(e) => handleInputChange(index, parseInt(e.target.value))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleInputChange(index, parseInt(e.target.value));
                          }
                        }
                        }
                        min="0"
                        placeholder="Cantidad"
                        className="form-control"
                      />
                    )
                  ) : (
                    "SIN STOCK"
                  )}
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>

      </div>
      <div>
        <h2>Carrito de Compras</h2>
        <ul>
          {carrito.map((item, index) => (
            <li key={index}>
              {item._id} - Cantidad: {item.cantidad}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
*/