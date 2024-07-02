import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut();
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand d-flex align-items-center">
          <Image src="/logo-harmony.png" alt="Logo" width={134} height={52} /> 
          <span className="ms-2">MENU PRINCIPAL</span>
        </Link>
        <Link href="/about" className="navbar-brand d-flex align-items-center">
        
          <span className="ms-1">Sobre Nosotros</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!session ? (
              <>
                <li className="nav-item">
                  <Link href="/register" className="nav-link">
                    REGISTRARSE
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/login" className="nav-link">
                    INICIAR SESIÓN
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link href="/dashboard/principal" className="btn btn-link nav-link">
                    COMPRAR
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/dashboard/carrito" className="btn btn-link nav-link">
                    CARRITO
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/dashboard/profile" className="btn btn-link nav-link">
                    HOLA {session.user.name.toUpperCase()}!
                  </Link>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-link nav-link">
                    CERRAR SESIÓN
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          background-color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .navbar-brand {
          font-weight: bold;
          font-size: 1.5rem;
        }
        .navbar-nav {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .nav-item {
          list-style-type: none;
        }
        .nav-link {
          text-decoration: none;
          color: black;
          padding: 10px 15px;
          transition: all 0.3s ease;
        }
        .nav-link:hover {
          background-color: #f0f0f0;
          border-radius: 5px;
        }
        .btn-link {
          color: black;
          text-decoration: none;
          padding: 10px 15px;
          transition: all 0.3s ease;
        }
        .btn-link:hover {
          background-color: #f0f0f0;
          border-radius: 5px;
        }
        @media (max-width: 576px) {
          .navbar-brand span {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;



/*
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

const Navbar = () => {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut();
  };

  return (

    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand">
        <Image src="/logo-harmony.png" alt="Logo" width={134} height={52} style={{ marginBottom: "px" }} /> {" "}MENU PRINCIPAL
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!session ? (
              <>
                <li className="nav-item">
                  <Link href="/register" className="nav-link">
                    REGISTRARSE
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/login" className="nav-link">
                    INCIAR SESSION
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link href="/dashboard/principal" className="btn btn-link nav-link">
                    COMPRAR
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/dashboard/carrito" className="btn btn-link nav-link">
                    CARRITO
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/dashboard/profile" className="btn btn-link nav-link">
                    HOLA {session.user.name.toUpperCase()}!
                  </Link>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-link nav-link">
                    CERRAR SESSION
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          background-color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .navbar-brand {
          font-weight: bold;
          font-size: 1.5rem;
        }
        .navbar-nav {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .nav-item {
          list-style-type: none;
        }
        .nav-link {
          text-decoration: none;
          color: black;
          padding: 10px 15px;
          transition: all 0.3s ease;
        }
        .nav-link:hover {
          background-color: #f0f0f0;
          border-radius: 5px;
        }
        .btn-link {
          color: black;
          text-decoration: none;
          padding: 10px 15px;
          transition: all 0.3s ease;
        }
        .btn-link:hover {
          background-color: #f0f0f0;
          border-radius: 5px;
        }
      `}</style>
    </nav>
    
  );
};

export default Navbar;
*/