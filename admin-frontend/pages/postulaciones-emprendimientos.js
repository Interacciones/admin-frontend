"use client";
import EntrepreneurPostulations from "../components/postulaciones/entrepreneur";
import { AuthContextProvider } from '../components/context/AuthContext'
import '../components/globals.css'

export default function PostulacionesEmprendimientos() {  
 return (
    <AuthContextProvider>
        <EntrepreneurPostulations/>
    </AuthContextProvider>
 )
}







