"use client";
import EntrepreneurReports from "../components/emprendimientos/reports";
import { AuthContextProvider } from '../components/context/AuthContext'
import '../components/globals.css'

export default function ReportesEmprendimientos() {  
 return (
    <AuthContextProvider>
        <EntrepreneurReports/>
    </AuthContextProvider>
 )
}







