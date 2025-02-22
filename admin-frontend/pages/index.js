"use client";
import Admin from "../components/home";
import { AuthContextProvider } from '../components/context/AuthContext'
import '../components/globals.css'

export default function Index() {  
 return (
    <AuthContextProvider>
      <Admin/>
    </AuthContextProvider>
)
}