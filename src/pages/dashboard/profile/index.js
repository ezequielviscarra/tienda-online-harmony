import React, { useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

import Image from 'next/image';

import { useSession } from 'next-auth/react';
import Link from 'next/link';


export default function Profile() {

    const { data: session, status } = useSession(); // Obtener la sesión del usuario
    // craem la consulta a la base de datos para obtener  el usuario que tiene el session.user.id en la base de datos
    const [userData, setUserData] = React.useState(null);

    const fetchUserData = async (id) => {

        try {
            const response = await fetch(`/api/user/${session.user.id}`);
            const data = await response.json();
            console.log(data)
            setUserData(data);
        } catch (error) {
            console.error("Error al obtener los datos del usuario:", error);
        }

    };


    useEffect(() => {
        if (status === "authenticated") {
            console.log("Usuario autenticado:", session.user.id);
            fetchUserData(session.user.id)
        } else {
            console.log("Usuario no autenticado");
        }
    }, [status, session]);


    return (
        <div className="container">
            <h1 className="text-center mb-4">Perfil del Usuario</h1>
            {userData ? (
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <div className="card">
                            <div className="card-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label"><strong>Email:</strong></label>
                                        <input type="email" className="form-control" id="email" value={userData.email} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="cuil" className="form-label"><strong>CUIL:</strong></label>
                                        <input type="text" className="form-control" id="cuil" value={userData.cuil} disabled />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="apellido" className="form-label"><strong>Apellido:</strong></label>
                                        <input type="text" className="form-control" id="apellido" value={userData.apellido} disabled />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="celular" className="form-label"><strong>Celular:</strong></label>
                                        <input type="text" className="form-control" id="celular" value={userData.celular} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="nombre" className="form-label"><strong>Nombre:</strong></label>
                                        <input type="text" className="form-control" id="nombre" value={userData.nombre} disabled />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="direccion" className="form-label"><strong>Dirección:</strong></label>
                                        <input type="text" className="form-control" id="direccion" value={userData.direccion} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="cp" className="form-label"><strong>CP:</strong></label>
                                        <input type="text" className="form-control" id="cp" value={userData.cp} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="localidad" className="form-label"><strong>Localidad:</strong></label>
                                        <input type="text" className="form-control" id="localidad" value={userData.localidad} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="provincia" className="form-label"><strong>Provincia:</strong></label>
                                        <input type="text" className="form-control" id="provincia" value={userData.provincia} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="estado" className="form-label"><strong>Estado:</strong></label>
                                        <input type="text" className="form-control" id="estado" value={userData.estado ? "Activo" : "Inactivo"} disabled />
                                    </div>
                                </form>
                                <Link href="/dashboard/profile/reset-password"> Cambiar contraseña </Link>
                            </div>
                        </div>
                        <div className="whatsapp-logo">
                            <Link href="https://wa.me/3482645499" target="_blank" rel="noopener noreferrer">
                                Chatea con Nosotros <Image src="/whatsapp-logo.png" alt="Chatea con nosotros" width={50} height={50} />
                            </Link>

                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <p>Cargando datos del usuario...</p>
                </div>
            )}
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