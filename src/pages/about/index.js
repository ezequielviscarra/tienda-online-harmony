import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Image from 'next/image';
import "bootstrap/dist/css/bootstrap.min.css";
import Link from 'next/link';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const center = {
    lat: -29.1442, // Coordenadas aproximadas de Reconquista, Santa Fe
    lng: -59.6416
};

const About = () => {
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-8">
                    <h1>HARMONY AROMATIZACION</h1>
                    <p>
                        Somos un comercio con más de 5 años representando y siendo punto de venta oficial de la línea Saphirus aromatizantes de ambientes. Estamos ubicados en Reconquista, Provincia de Santa Fe. Nos especializamos en ofrecer los mejores productos para satisfacer las necesidades de nuestros clientes. Nuestra dedicación y experiencia nos han permitido consolidarnos como líderes en el mercado, siempre comprometidos con la calidad, rapidez y la buena atención. El servicio de venta es lo mejor que tenemos.
                    </p>
                    <div className="d-flex justify-content-center justify-content-md-start align-items-center">
                        <Image src="/ig-logo.png" alt="Logo" width={57} height={18} />
                        <a href="https://www.instagram.com/harmony.aromatizacion" target="_blank" rel="noopener noreferrer" className="text-light text-decoration-none ms-2">
                            <span className="fw-bold text-primary">@harmony.aromatizacion</span>
                        </a>
                    </div>
                    <div className="mt-2">
                        <a href="https://www.google.com/maps/place/Harmony+aromatización/@-29.1505701,-59.6431795,18.75z/data=!4m6!3m5!1s0x944ebbe29408545f:0xfc19de06b81e1989!8m2!3d-29.1503934!4d-59.6431284!16s%2Fg%2F11rfn32tf4?entry=ttu" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                            SAN MARTIN 1227 - RECONQUISTA - SANTA FE
                        </a>
                    </div>
                </div>
                <div className="col-md-4">
                    <LoadScript googleMapsApiKey="TU_CLAVE_DE_API_AQUI">
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center}
                            zoom={15} // Aumenté el zoom para una mejor vista de la ubicación
                        >
                            <Marker position={center} />
                        </GoogleMap>
                    </LoadScript>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col-md-3 mb-3">
                    <Image src="/collage/img1.jpg" className="img-fluid" alt="Descripción de la imagen 1" width={400} height={300} />
                </div>
                <div className="col-md-3 mb-3">
                    <Image src="/collage/img2.jpg" className="img-fluid" alt="Descripción de la imagen 2" width={400} height={300} />
                </div>
                <div className="col-md-3 mb-3">
                    <Image src="/collage/img3.jpg" className="img-fluid" alt="Descripción de la imagen 3" width={400} height={300} />
                </div>
                <div className="col-md-3 mb-3">
                    <Image src="/collage/img4.jpg" className="img-fluid" alt="Descripción de la imagen 4" width={400} height={300} />
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
                    bottom: 37px;
                    right: 20px;
                    z-index: 1000;
                }
  
    `}</style>
        </div>
        
    );
};

export default About;

