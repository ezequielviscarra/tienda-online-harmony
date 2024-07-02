

import React, { useRef, useState, useEffect } from "react";
import Layout from "../components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";







export default function Home() {

    const CSV_URL = process.env.NEXT_PUBLIC_CSV_URL ;
    const { data: session, status } = useSession();
    const [excelData, setExcelData] = useState([]);
    const [mes, setMes] = useState("");
    const [year, setYear] = useState(0);
    const [search, setSearch] = useState("");


async function fetchCsv(url) {
    try {
        console.log('Fetching CSV data...');
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching CSV: ${response.statusText}`);
        }
        const text = await response.text();
        console.log('CSV data fetched successfully:', text);
        return text;
    } catch (error) {
        console.error('Failed to fetch CSV:', error);
        throw error;
    }
}


function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }

    values.push(current); // Agregar el último valor
    return values;
}
// Función para procesar el contenido del CSV
function parseCSV(text) {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());

    // Imprimir los nombres de los atributos
    console.log("Atributos:", headers);

    // Crear un array para almacenar los objetos
    const data = [];

    // Iterar sobre las líneas del CSV a partir de la segunda
    for (let i = 1; i < lines.length; i++) {

        const values = parseCSVLine(lines[i]);
        const obj = {};

        // Crear un objeto para cada línea y mapear los valores con los nombres de los atributos
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = values[j].trim();
        }

        // Agregar el objeto al array
        data.push(obj);
    }

    // Imprimir los objetos
    console.log("Objetos:", data);

    return data;
}


    const capturarMesActual = () => {
        const meses = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
        ];

        const fechaActual = new Date();
        const year = fechaActual.getUTCFullYear(); // Obtén el año de la fecha actual
        setYear(year)
        const nombreMes = meses[fechaActual.getMonth()]; // Obtén el nombre del mes
        const mesEnMayuscula = nombreMes.toUpperCase();
        console.log(mesEnMayuscula)
        setMes(mesEnMayuscula);
    }

    useEffect(() => {
        capturarMesActual();
        console.log('useEffect called');
        async function loadData() {
            try {
                console.log('Loading data...');
                const csv = await fetchCsv(CSV_URL);
                const parsedData = parseCSV(csv);
                console.log('Parsed data:', parsedData);
                // Transform string values to numeric where applicable
                const transformedData = parsedData.map(row => {
                    const transformedRow = {};
                    for (const key in row) {
                        if (row.hasOwnProperty(key)) {
                            let value = row[key];
                            // Convert to number if the value is a string and is a valid number
                            if (typeof value === 'string') {
                                // Replace comma with dot for decimal conversion
                                value = value.replace(',', '.');
                                if (!isNaN(value) && value.trim() !== '') {
                                    transformedRow[key] = Number(value);
                                } else {
                                    transformedRow[key] = row[key];
                                }
                            } else {
                                transformedRow[key] = row[key];
                            }
                        }
                    }
                    return transformedRow;
                });
                console.log('Transformed data:', transformedData);
                setExcelData(transformedData);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        }

        loadData();
    }, []);



    let results = [];

    if (!search) {
        results = excelData;
    } else {
        results = excelData.filter((dato) => {
            for (const key in dato) {
                if (
                    typeof dato[key] === "string" &&
                    dato[key].toLowerCase().includes(search.toLowerCase())
                ) {
                    return true;
                }
            }
            return false;
        });
    }

    const groupedByMarca = results.reduce((acc, producto) => {
        const marca = producto.Marca;
        if (!acc[marca]) {
            acc[marca] = [];
        }
        acc[marca].push(producto);
        return acc;
    }, {});


    const searcher = (e) => {
        setSearch(e.target.value);
    };
    return (
       
            <div style={{
                backgroundImage: 'url(/Fondo.png)',

                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '900px', // Ajusta la altura según tus necesidades
                width: '100%',
            }}>
                <div className="input-group mb-2">

                </div>
                <section className="catalogo-section">
                    <div className="container">
                        <div className="header mb-4" style={{ fontFamily: "Arial Rounded MT Bold, sans-serif" }}>
                            <Image src="/logo-harmony-bl.png" alt="Logo" width={540} height={210} style={{ marginBottom: "20px" }} />
                            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#ffffff", textTransform: "uppercase" }}>NUESTROS PRODUCTOS</h1>

                        </div>
                        <div style={{ marginBottom: "20px", fontFamily: "Arial Rounded MT Bold, sans-serif" }}>
                            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #333333', paddingBottom: '10px' }}>
                                <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#ffffff", marginBottom: "10px" }}>CENTRO DE DISTRIBUCION</h2>
                                <Image
                                    src="/saphiruslogo.png"
                                    alt="Logo"
                                    width={88}
                                    height={35}
                                    style={{ marginLeft: '10px', borderRadius: '4px' }}
                                />
                            </div>


                            <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#ffffff", marginBottom: "10px" }}>MES {mes} {year}</h2>
                            <p style={{ fontSize: "16px", fontWeight: "bold", color: "#ffffff", marginBottom: "10px" }}>SAN MARTIN Nº 1227, RECONQUISTA, SANTA FE</p>
                            <p style={{ fontSize: "16px", fontWeight: "bold", color: "#ffffff", marginBottom: "20px" }}>CEL: 3482-645499</p>
                        </div>
                        <div className="row mt-2">
                            <input
                                type="text"
                                onChange={searcher}
                                placeholder="Buscar por descripción"
                                className="form-control"
                            />
                            {Object.entries(groupedByMarca).map(([marca, productos]) => (
                                <React.Fragment key={marca}>
                                    <div className="marca-row">
                                        <h3 className="marca-title">{marca}</h3>
                                    </div>
                                    {productos.map((producto) => (
                                        <div key={producto.id} className="col-md-4">
                                            <div className="card mb-4 shadow-sm">
                                                <div className="card-header text-center">
                                                    <Image
                                                        src={`/images/saphirus/${producto.Imagen}`}
                                                        alt={`${producto.Imagen}`}
                                                        width={128}
                                                        height={128}
                                                        style={{ borderRadius: '20px' }}
                                                    />
                                                </div>
                                                <div className="card-body">
                                                    <h5 className="card-title">{producto.Marca} {producto.Productos}</h5>
                                                    <p className="card-text">1 a 19 Un.: $<strong>{producto.Totalprimeralinea !== 0 ? `${parseFloat(producto.Totalprimeralinea).toFixed(2)}` : 'AGOTADO'}</strong></p>
                                                    <p className="card-text"> +19 Un.: $<strong>{producto.Totalsegundalinea === 0 ? 'S/P' : producto.Totalsegundalinea >= producto.Totalprimeralinea ? 'S/P' : `${parseFloat(producto.Totalsegundalinea).toFixed(2)}`}</strong></p>
                                                    <p className="card-text">Precio Sugerido: $<strong>{producto.Precioredondeado ? parseFloat(producto.Precioredondeado).toFixed(2) : ''}</strong></p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>
                        <footer className="footer" style={{ backgroundImage: 'url(/Fondo.png)', color: "#fff", marginTop: "5rem" }}>
                            <div className="container">
                                <div className="row align-items-center">
                                    <div className="col-md-6 text-center text-md-start">
                                        <Image src={"/logo-harmony-bl.png"} alt="Logo" width={270} height={105} />
                                    </div>
                                    <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
                                        <div className="d-flex justify-content-center justify-content-md-end align-items-center">
                                            <Image src={"/instagram-palabra.png"} alt="Logo" width={70} height={70} />
                                            <a href="https://www.instagram.com/harmony.aromatizacion" target="_blank" rel="noopener noreferrer" className="text-light text-decoration-none ms-2">
                                                <span className="fw-bold text-primary">@harmony.aromatizacion</span>
                                            </a>
                                        </div>
                                        <a href="https://www.google.com/maps/place/Harmony+aromatización/@-29.1505701,-59.6431795,18.75z/data=!4m6!3m5!1s0x944ebbe29408545f:0xfc19de06b81e1989!8m2!3d-29.1503934!4d-59.6431284!16s%2Fg%2F11rfn32tf4?entry=ttu" target="_blank" rel="noopener noreferrer" className="text-center ms-4 text-decoration-none">
                                            Ubicación en Google Maps
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </div>

                </section>
                <div className="whatsapp-logo">
                    <Link href="https://wa.me/3482645499" target="_blank" rel="noopener noreferrer">
                        Chatea con Nosotros <Image src="/whatsapp-logo.png" alt="Chatea con nosotros" width={50} height={50} />
                    </Link>
                </div>
                {!session && (
                    <div className="fixed-footer">
                        Tienda exclusiva para mayoristas, para realizar compras debes <Link href="/login">iniciar sesión</Link> o <Link href="/register">registrarte</Link>
                    </div>
                )}

                <style jsx>{`
                .whatsapp-logo {
                    position: fixed;
                    bottom: 37px;
                    right: 20px;
                    z-index: 1000;
                }
      .header {
        text-align: center;
        margin-bottom: 20px;
      }
      .header h3 {
        margin: 10px 0;
        color: #ff6600;
      }
      .subheader {
        text-align: center;
        margin: 20px 0;
      }
      .subheader h3 {
        color: #ff6600;
      }
      .subheader h4 {
        margin: 5px 0;
      }
      .table-container {
        margin-top: 20px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th,
      td {
        padding: 10px;
        text-align: center;
        border: 1px solid #ddd;
      }
      th {
        background-color: #333;
        color: #fff;
      }
      .footer {
        background-color: #ff6600;
        color: #fff;
        text-align: center;
        padding: 20px;
        margin-top: 20px;
        bottom: 60px;
      }
      .footer a {
        color: #fff;
        text-decoration: none;
        margin: 0 10px;
      }
      .footer a:hover {
        text-decoration: underline;
      }
      .card {
        border: 1px solid #ddd;
        border-radius: 0.5rem;
        overflow: hidden;
        box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      }
      .card-header {
        background-color: #f8f9fa;
        border-bottom: 1px solid #ddd;
        padding: 0.75rem 1.25rem;
      }
      .card-body {
        padding: 1.25rem;
      }
      .card-title {
        font-size: 1rem;
        font-weight: bold;
        color: #333;
      }
      .card-text {
        font-size: 0.875rem;
        color: #666;
      }
      .marca-title {
        font-size: 1.5rem;
        font-weight: bold;
        color: #333;
        text-align: center;
        margin: 20px 0;
      }
      .fixed-footer {
        
        position: fixed;
        bottom: 0;
        width: 100%;
        background: #333;
        color: #fff;
        text-align: center;
        padding: 10px;
        font-size: 16px;
      }
      borde{
        buttom: 30px;
      }
    `}</style>
            </div>
        

    );

}


