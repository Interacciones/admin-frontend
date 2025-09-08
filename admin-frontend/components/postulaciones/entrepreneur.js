"use client";
import EntrepreneurPostulations from "./entrepreneur/EntrepreneurPostulations";
import Sidebar from "../sidebar/Sidebar";
import Topbar from "../topbar/Topbar";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import RouteLoader from "../RouteLoader";

export default function PostulacionesEmprendimientos() {
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
    if (response.status === 200) {
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
            <EntrepreneurPostulations/>
          </div>
        </div>
      ) : (
        <RouteLoader/>
      )}
    </>
  )
}







