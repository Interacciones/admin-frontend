"use client";
import Users from "../components/usuarios/users";
import { AuthContextProvider } from '../components/context/AuthContext'
import '../components/globals.css'

export default function Usuarios() {  
 return (
    <AuthContextProvider>
        <Users/>
    </AuthContextProvider>
)
}