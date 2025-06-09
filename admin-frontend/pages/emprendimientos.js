"use client";
import Emprendimientos from "../components/emprendimientos";
import { AuthContextProvider } from '../components/context/AuthContext'
import '../components/globals.css'

export default function EmprendimientosPage() {  
 return (
    <AuthContextProvider>
        <Emprendimientos/>
    </AuthContextProvider>
)
} 