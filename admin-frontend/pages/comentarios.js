"use client";
import Reviews from "../components/comentarios/reviews";
import { AuthContextProvider } from '../components/context/AuthContext'
import '../components/globals.css'

export default function Comentarios() {  
 return (
    <AuthContextProvider>
        <Reviews/>
    </AuthContextProvider>
)
} 