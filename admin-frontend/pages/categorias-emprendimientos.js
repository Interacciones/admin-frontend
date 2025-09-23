"use client";
import Categories from "../components/emprendimientos/categories";
import { AuthContextProvider } from '../components/context/AuthContext'
import '../components/globals.css'

export default function CategoriasEmprendimientos() {  
 return (
    <AuthContextProvider>
        <Categories/>
    </AuthContextProvider>
 )
}



