// components/ProtectedRoute.js
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

const ProtectedRoute = ({ children }) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return; // No hacer nada mientras carga
        if (!session) signIn(); // Redirigir al inicio de sesión si no hay sesión
    }, [session, status]);

    if (status === "loading") {
        return <div>Loading...</div>; // Mostrar un cargando mientras verifica
    }

    if (!session) return null; // No mostrar nada mientras redirige

    return children;
};

export default ProtectedRoute;
