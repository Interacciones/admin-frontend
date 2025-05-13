"use client";
import Areas from "../components/areas/areas";
import { AuthContextProvider } from '../components/context/AuthContext'
import '../components/globals.css'

export default function AreasPage() {  
  return (
    <AuthContextProvider>
      <Areas/>
    </AuthContextProvider>
  )
}