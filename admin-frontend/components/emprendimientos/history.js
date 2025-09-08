"use client";
import Sidebar from "../sidebar/Sidebar";
import Topbar from "../topbar/Topbar";
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

export default function EntrepreneurHistory() {
	const [isForComments, setIsForComments] = useState(false);
	const [isForProjects, setIsForProjects] = useState(true);
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

	const handleForComments = () => {
		if (!isForComments) {
			setIsForProjects(false);
			setIsForComments(true);
		}
	};

	const handleForProjects = () => {
		if (!isForProjects) {
			setIsForComments(false);
			setIsForProjects(true);
		}
	};

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
									Historial de reportes (Emprendimientos)
								</h2>
							</div>
							<div className='mt-4 mr-12 h-10 shadow-xl bg-white dark:bg-slate-900 grid grid-cols-2'>
								<div>
									<button
									className={`h-full w-full rounded-l-full ${isForProjects ? 'dark:bg-white bg-slate-900 text-white':'dark:hover:bg-white hover:bg-slate-900 hover:text-slate-500 border-2 dark:border-white border-slate-900 text-black'} dark:text-slate-400`}
									onClick={()=> handleForProjects()}>
										Proyectos
									</button>
								</div>
								<div>
									<button
										className={`h-full w-full rounded-r-full ${isForComments ? 'dark:bg-white bg-slate-900 text-white':'dark:hover:bg-white hover:bg-slate-900 border-2 dark:border-white border-slate-900 text-black hover:text-slate-500'} dark:text-slate-400`}
										onClick={() => handleForComments()}>
										Comentarios
									</button>
								</div>
							</div>
							<div className="mt-8 text-slate-700 dark:text-slate-400">
								<p>Endpoints de historial para emprendimientos no especificados en el README. Indícame las rutas para listar el historial de proyectos y comentarios, y los integro de inmediato.</p>
							</div>
						</div>
					</div>
				</div>
			) : (
				<RouteLoader/>
			)}
		</>
	)
}







