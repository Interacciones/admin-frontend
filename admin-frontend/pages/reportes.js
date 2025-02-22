"use client";
import Reports from "../components/reportes/reports";
import { AuthContextProvider } from '../components/context/AuthContext'
import '../components/globals.css'

export default function Reportes() {  
 return (
    <AuthContextProvider>
        <Reports/>
    </AuthContextProvider>
)
}