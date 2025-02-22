"use client";
import History from "../components/historial/history";
import { AuthContextProvider } from '../components/context/AuthContext'
import '../components/globals.css'

export default function Historial() {  
 return (
    <AuthContextProvider>
      <History/>
    </AuthContextProvider>
)
}