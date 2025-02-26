"use client";
import ProfilePage from "../components/profile/profile";
import { AuthContextProvider } from '../components/context/AuthContext'
import '../components/globals.css'

export default function Profile() {  
 return (
    <AuthContextProvider>
        <ProfilePage/>
    </AuthContextProvider>
)
}