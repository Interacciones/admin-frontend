"use client";
import Complains from "../components/complains/complains";
import { AuthContextProvider } from '../components/context/AuthContext'
import '../components/globals.css'

export default function Reportes() {  
 return (
    <AuthContextProvider>
        <Complains/>
    </AuthContextProvider>
)
}