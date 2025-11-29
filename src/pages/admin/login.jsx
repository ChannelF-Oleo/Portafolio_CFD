import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../lib/firebase"; // <--- Importamos nuestra conexión real
import { signInWithEmailAndPassword } from "firebase/auth"; // <--- Función de Firebase

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Para mostrar errores si fallas
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    try {
      // INTENTO DE LOGIN REAL EN FIREBASE
      await signInWithEmailAndPassword(auth, email, password);

      // Si pasa, guardamos la "marca" en local y entramos
      localStorage.setItem("isAdmin", "true");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
      // Mensajes de error amigables
      if (error.code === "auth/invalid-credential") {
        setError("Correo o contraseña incorrectos.");
      } else {
        setError("Ocurrió un error. Intenta de nuevo.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-serif text-white text-center mb-8">
          Admin Access
        </h2>

        {/* Mensaje de Error Visual */}
        {error && (
          <div className="bg-red-500/80 text-white p-3 rounded mb-4 text-center text-sm font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder-white/50"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder-white/50"
          />
          <button className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-brand-accent transition">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
