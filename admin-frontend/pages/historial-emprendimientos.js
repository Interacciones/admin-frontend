"use client";
import EntrepreneurHistory from "../components/emprendimientos/history";
import { AuthContextProvider } from '../components/context/AuthContext'
import '../components/globals.css'

export default function HistorialEmprendimientos() {  
 return (
    <AuthContextProvider>
        <EntrepreneurHistory/>
    </AuthContextProvider>
 )
}







