"use client";
import Sidebar from "../sidebar/Sidebar";
import Topbar from "../topbar/Topbar";
import ComplainsTable from "./complainsTable";
import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from 'next/router';
import RouteLoader from "../RouteLoader";

export default function Complains() {
  const [open, setOpen] = useState(false);
  const [redirectUser, setRedirectUser] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  
  const handleClose = () => {
    setOpen(false);
    setRedirectUser(true); 
  };

  const checkAdmin = async (currentUser) => {
    const response = await fetch((`http://localhost:3000/check-admin`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.stsTokenManager.accessToken}`
      }
    });
    const result = await response.json();
    if (result.message === "Successfull") {
      setAuthorized(true);
    } else {
      setOpen(true);
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setOpen(true);
      } else {
        checkAdmin(currentUser);
      }
    });
  }, [])

  if (redirectUser) {
    router.push('/login');
  }

 return (
  <>
    <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
              No tienes permisos para acceder a esta página
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cerrar</Button>
        </DialogActions>
    </Dialog>
    {authorized ? (
    <div className="bg-white min-w-screen min-h-screen flex flex-col">
      <Topbar/>
      <div className="flex flex-grow">
        <Sidebar/>
        <div className='w-5/6 p-6 bg-white dark:bg-slate-900'>
            <div className="mx-auto max-w-2xl text-center py-4">
              <h2 className="text-3xl font-sans tracking-tight text-gray font-semibold sm:text-4xl">
                Reclamos
              </h2>
            </div>
            <ComplainsTable/>
        </div>
      </div>
    </div>
    ) : (
      <RouteLoader/>
    )}
  </>
)
}