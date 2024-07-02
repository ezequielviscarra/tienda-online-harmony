// pages/register.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cuil, setCuil] = useState('');
  const [celular, setCelular] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [cp, setCp] = useState('');
  const [provincia, setProvincia] = useState('');
  const [direccion, setDireccion] = useState('');
  const router = useRouter();
  const [error, setError] = useState("");
  const [pressButton, setPressButton] = useState(true)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPressButton(false)
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        nombre,
        apellido,
        cuil,
        celular,
        localidad,
        cp,
        provincia,
        direccion,
      }),
    });

    const data = await res.json();
    console.log(data)

    if (!res.ok) {
      setError(`${data.message}. ingresa los datos nuevamente...` || "Error en el registro."

      );
      setPressButton(true)
      setEmail("")
      setPassword("")
      setNombre("")
      setApellido("")
      setCuil("")
      setCelular("")
      setLocalidad("")
      setCp("")
      setProvincia("")
      setDireccion("")
    } else {
      alert(data.message);
      router.push('/login'); // Redirigir al usuario a la página de inicio de sesión después de registrarse
    }
  };

  return (
    <div className="container mt-2">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">REGISTRATE</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="apellido" className="form-label">Apellido</label>
              <input
                type="text"
                className="form-control"
                id="apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Apellido"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="cuil" className="form-label">CUIT/DNI/CUIL</label>
              <input
                type="text"
                className="form-control"
                id="cuil"
                value={cuil}
                onChange={(e) => setCuil(e.target.value)}
                placeholder="CUIT/DNI/CUIL"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="celular" className="form-label">Celular</label>
              <input
                type="text"
                className="form-control"
                id="celular"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                placeholder="Celular"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="localidad" className="form-label">Localidad</label>
              <input
                type="text"
                className="form-control"
                id="localidad"
                value={localidad}
                onChange={(e) => setLocalidad(e.target.value)}
                placeholder="Localidad"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="cp" className="form-label">Código Postal</label>
              <input
                type="text"
                className="form-control"
                id="cp"
                value={cp}
                onChange={(e) => setCp(e.target.value)}
                placeholder="Código Postal"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="provincia" className="form-label">Provincia</label>
              <input
                type="text"
                className="form-control"
                id="provincia"
                value={provincia}
                onChange={(e) => setProvincia(e.target.value)}
                placeholder="Provincia"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="direccion" className="form-label">Dirección</label>
              <input
                type="text"
                className="form-control"
                id="direccion"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Dirección"
                required
              />
            </div>
            {error && <p className="text-danger">{error}</p>}
            {pressButton && (
              <button type="submit" className="btn btn-primary btn-block">Register</button>
            )}
          </form>
          <p className="text-center mt-3">Ya tienes una cuenta? <Link href="/login">Inicia sesión aquí</Link></p>
        </div>
      </div>
    </div>
  );
}
