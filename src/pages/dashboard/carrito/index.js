import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";



export default function Home() {
    const [productos, setProductos] = useState([]);
    const [error, setError] = useState(null);
    const { data: session, status } = useSession();
    const [carrito, setCarrito] = useState([]);
    const [carritoFinal, setCarritoFinal] = useState([])
    const [idCarrito, setIdCarrito] = useState()
    const [hiddenButton, setHiddenButton] = useState(true)
    const { query, push } = useRouter();


    const fetchCart = async () => {
        if (session && session.user) {
            try {
                const response = await fetch(`/api/carts?userId=${session.user.id}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
                    setCarrito(data.items);
                    setIdCarrito(data._id)
                } else {
                    console.log("No hay carrito activo");
                    alert("No hay carrito activo");
                }
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        }
    };

    const fetchProductos = async () => {
        if (session && session.user) {
            try {
                const response = await fetch(`/api/productos`);
                if (response.ok) {
                    const data = await response.json();
                    setProductos(data);
                } else {
                    alert("No hay productos");
                    push("/dashboard/principal");
                }
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        }
    };

    useEffect(() => {
        fetchCart();
        fetchProductos();
    }, [session]);

    useEffect(() => {
        console.log('Productos:', productos);
        console.log('Carrito:', carrito);

        let productosArray = [];
        productos.forEach(producto => {
            carrito.forEach(item => {

                if (item._id === producto._id) {
                    const productoInfo = {
                        _id: producto._id,
                        marca: producto.Marca,
                        rubro: producto.Rubro,
                        descripcion: producto.Descripcion,
                        precio1: producto.Lista3,
                        precio2: producto.Lista4,
                        cantidad: item.cantidad
                    };
                    productosArray.push(productoInfo);
                }
            });
        });


        setCarritoFinal(productosArray);
    }, [productos, carrito]);

    const handlePurchase = async () => {
        setHiddenButton(false)
        // agregale un react-loader-spinner al proceso de hnadle purchase
        const purchaseData = carritoFinal.map(item => {
            const key = `${item.marca}-${item.rubro}`;
            const totalCantidad = groupedProducts[key].totalCantidad;
            const precio = totalCantidad >= 19 ? item.precio2 : item.precio1;
            return {
                _id: item._id,
                marca: item.marca,
                rubro: item.rubro,
                descripcion: item.descripcion,
                cantidad: item.cantidad,
                precio: precio
            };
        });

        const total = carritoFinal.reduce((sum, item) => {
            const key = `${item.marca}-${item.rubro}`;
            const totalCantidad = groupedProducts[key].totalCantidad;
            const precio = totalCantidad >= 19 ? item.precio2 : item.precio1;
            return sum + (precio * item.cantidad);
        }, 0);


        const compra = {
            idCarrito: idCarrito,
            user: session.user,
            items: purchaseData,
            total: Number(total.toFixed(2)) // Add total here
        }

        console.log(compra)

        try {
            const response = await fetch("/api/orden", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    compra
                }),
            });
            if (response.ok) {

                alert("Compra realizada con éxito");
               console.log('/dashboard/principal')
            
               push("/dashboard/principal");
            } else {
                throw new Error("Error al realizar la compra");
            }
        } catch (error) {
            console.error("Error al realizar la compra:", error);
            setError(error);
        }

    };

    const groupedProducts = carritoFinal.reduce((acc, item) => {
        const key = `${item.marca}-${item.rubro}`;
        if (!acc[key]) {
            acc[key] = {
                ...item,
                totalCantidad: 0,
            };
        }
        acc[key].totalCantidad += item.cantidad;
        return acc;
    }, {});

    let totalSum = 0;

    return (
        <div style={{
            backgroundImage: 'url(/Fondo.png)',
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '900px',
            width: '100%',
        }}>
            <div className="mt-4">
                <h2 className="mb-3"><strong>Carrito de Compras</strong></h2>
                <div className="table-responsive">
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th><strong>ID</strong></th>
                                <th><strong>Marca</strong></th>
                                <th><strong>Rubro</strong></th>
                                <th><strong>Descripción</strong></th>
                                <th><strong>Cantidad</strong></th>
                                <th><strong>Precio</strong></th>
                                <th><strong>Sub Total</strong></th>
                            </tr>
                        </thead>
                        <tbody>
                            {carritoFinal.map((item, index) => {
                                const key = `${item.marca}-${item.rubro}`;
                                const totalCantidad = groupedProducts[key].totalCantidad;
                                const precio = totalCantidad >= 19 ? item.precio2 : item.precio1;
                                const subtotal = precio * item.cantidad;
                                totalSum += subtotal;
                                return (
                                    <tr key={index}>
                                        <td><strong>{item._id}</strong></td>
                                        <td><strong>{item.marca}</strong></td>
                                        <td><strong>{item.rubro}</strong></td>
                                        <td><strong>{item.descripcion}</strong></td>
                                        <td><strong>{item.cantidad}</strong></td>
                                        <td><strong>{precio.toFixed(2)}</strong></td>
                                        <td><strong>{subtotal.toFixed(2)}</strong></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="6" className="text-right"><strong>Total:</strong></td>
                                <td><strong>{totalSum.toFixed(2)}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                {hiddenButton && (
                    // agregale el if para ocultar el botton
                    <div className="d-flex justify-content-center">
                    <button className="btn btn-primary mt-3" onClick={handlePurchase}>
                      REALIZAR PEDIDO
                    </button>
                  </div>
                )}
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



const saveCart = async (productos) => {
        console.log("guardando carrito")
        console.log(productos)
        const itemsToSave = productos.filter(producto => producto.cantidad > 0);
        console.log("imprimiendo itemtoSave", itemsToSave)
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


*/