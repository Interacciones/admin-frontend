"use client"
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { UserAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

/*
El sign in puede tirar estos errores:
"auth/invalid-email" ==> Thrown if the email address is not valid.
"auth/user-disabled" ==> Thrown if the user corresponding to the given email has been disabled.
"auth/user-not-found" ==> Thrown if there is no user corresponding to the given email
"auth/wrong-password" ==> Thrown if the password is invalid for the given email, or the account corresponding to the email does not have a password set.
*/

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user } = UserAuth();
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [redirectUser, setRedirectUser] = useState(false);
  const router = useRouter();
  
  if (redirectUser) {
    router.push('/');
  }

  async function loginUser() {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const response = await fetch((`http://localhost:3000/check-admin`), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userCredentials.user.accessToken}`
        }
      });
      const result = await response.json();
      if (result.message === "Successfull") {
        setRedirectUser(true)
      } else {
        setMessage("Las credenciales no son correctas");
        setError(true);
      }
    } catch({message}) {
      setMessage("Las credenciales no son correctas");
      setError(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Login
    await loginUser();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-100">
            Iniciar Sesión
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Campo de correo electrónico */}
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="email-address" className="sr-only">
                Dirección de correo electrónico
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Correo Electrónico"
              />
            </div>
          </div>

          {/* Campo de contraseña */}
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-left h-2">
              <span className='text-red-600 text-xs'>{message}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="mb-4 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
