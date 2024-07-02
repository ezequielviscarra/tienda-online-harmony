import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import "bootstrap/dist/css/bootstrap.min.css";

const ResetPassword = () => {
  const { data: session, status } = useSession(); // Obtener la sesión del usuario
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pressSubmit, setPressSubmit] = useState(true);

  if (status === 'loading') {
    return <p>Cargando...</p>;
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPressSubmit(false)

    

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }



    // Aquí deberías hacer la llamada al backend para cambiar la contraseña
    try {
      const response = await fetch(`/api/change-password/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
     
      });

      if (response.ok) {
        setSuccess('Contraseña cambiada exitosamente. cerrando session y redireccionando pagina.... espere por favor');
        // Redirigir al usuario a otra página si es necesario
        setTimeout(() => {
          signOut({ callbackUrl: '/login' });
        }, 3000);
      } else {
        setError('Hubo un problema al cambiar la contraseña');
      }
    } catch (error) {
      setError('Hubo un problema al cambiar la contraseña');
    }
  };
  return (
    <div className="container mt-5">
      <h1 className="text-center">Cambiar Contraseña</h1>
      {error && <p className="text-danger text-center">{error}</p>}
      {success && <p className="text-success text-center">{success}</p>}
      <form onSubmit={handleSubmit} className="w-50 mx-auto">
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Nueva Contraseña:</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña:</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {pressSubmit && (
        <button type="submit" className="btn btn-primary">Cambiar Contraseña</button>
      )}
        </form>
    </div>
  );
};

export default ResetPassword;
