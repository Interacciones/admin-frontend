"use client";
import { useState, useEffect } from "react";
import {
    ArrowDownIcon,
    ArrowUpIcon,
} from '@heroicons/react/24/outline';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { UserAuth } from '../context/AuthContext';

export default function ComplainsTable() {
    const [complains, setComplains] = useState([]);
    const [complain, setComplain] = useState({});
    const [sortOrder, setSortOrder] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [content, setContent] = useState("");
    const { user } = UserAuth();
    
    const handleClose = () => {
        setOpen(false);
    };

    const toggleSortOrder = (order) => {
        if (sortOrder === order) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortOrder(order);
            setSortDirection('asc');
        }
    }

    const sortedData = () => {
        let sorted = [...complains];
        switch (sortOrder) {
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'dateStart':
                if(sortDirection === 'asc') {
                    sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                } else {
                    sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                }
                break;
            default:
                return complains;
        }
        
        if (sortDirection === 'desc') {
            sorted.reverse();
        }
    
        return sorted;
    };

    const fetchUpdate = async (id) => {
        if (!complain.name || !complain.email) {
            setOpen(true);
            setMessage("No se ha seleccionado una queja válida");
            return;
        }

        try {
            const response = await fetch((`http://localhost:3000/admin/complains/${id}`), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
                },
                body: JSON.stringify({
                    content: content,
                    name: complain.name,
                    lastName: complain.lastName,
                    email: complain.email
                })
            });
            if (response.status === 200) {
                fetchComplains();
                setComplain({});
                setContent("");
                setMessage("Mensaje manejado con éxito");
                setOpen(true);
            } else {
                setOpen(true);
                setMessage("Problema al actualizar queja");
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
  
    const fetchDelete = async (id) => {
        if (!complain.name || !complain.email) {
            setOpen(true);
            setMessage("No se ha seleccionado una queja válida");
            return;
        }

        try {
            const response = await fetch((`http://localhost:3000/admin/complains/${id}`), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
                }
            });
            if (response.status === 200) {
                fetchComplains();
                setComplain({});
                setMessage("Reclamo eliminado con éxito");
                setOpen(true);
            } else {
                setOpen(true);
                setMessage("Problema al eliminar queja");
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchComplains = async () => {
        try {
            const response = await fetch(`http://localhost:3000/admin/complains`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
                }
            });
            const result = await response.json();
            setComplains(result.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    const loadComplain = (id) => {
        const found = complains.find(obj => obj.id == id);
        setComplain(found);
    };

    useEffect(() => {
        fetchComplains();
    }, []);
        
    return(
      <div className="bg-white dark:bg-slate-900 mt-14">
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cerrar</Button>
                </DialogActions>
            </Dialog>
            <div className="mt-4 flex">
                <table className="h-full w-1/2 mx-4">
                    <thead className="h-12 max-h-12 outline outline-slate-200 dark:outline-slate-700">
                        <tr className="text-black dark:text-white text-left text-sm">
                            <th 
                                className="py-3 px-4 font-semibold text-sm cursor-pointer"
                                onClick={() => toggleSortOrder('name')}
                            >
                                <div className="flex items-center justify-center">
                                    <span className="px-2 text-slate-700 dark:text-slate-400">Nombre</span>
                                    {sortOrder === 'name' && sortDirection === 'asc' && (
                                    <ArrowUpIcon className="h-4 w-4" aria-hidden="true" />
                                    )}
                                    {sortOrder === 'name' && sortDirection === 'desc' && (
                                    <ArrowDownIcon className="h-4 w-4" aria-hidden="true" />
                                    )}
                                </div>
                            </th>
                            <th 
                                className="py-3 px-4 font-semibold text-sm cursor-pointer"
                                onClick={() => toggleSortOrder('dateStart')}
                            >
                                <div className="flex items-center justify-center">
                                    <span className="px-2 text-slate-700 dark:text-slate-400">Creación</span>
                                    {sortOrder === 'dateStart' && sortDirection === 'asc' && (
                                    <ArrowUpIcon className="h-4 w-4" aria-hidden="true" />
                                    )}
                                    {sortOrder === 'dateStart' && sortDirection === 'desc' && (
                                    <ArrowDownIcon className="h-4 w-4" aria-hidden="true" />
                                    )}
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className='text-slate-700 dark:text-slate-400 text-sm'>
                        {complains.length?(
                            sortedData().map((obj, i) => (
                                <tr
                                value = { obj.id } 
                                onClick={ () => loadComplain( obj.id ) }
                                className="bg-white dark:bg-slate-900 h-14 text-center py-3 px-4 border-b-2 border-gray-200 dark:border-slate-700 hover:bg-gray-300" 
                                key={i}>
                                    <td>{ obj.name + " " + obj.lastName }</td>
                                    <td>{ new Date(obj.createdAt).toISOString().slice(0, 10) }</td>
                                </tr>
                            ))
                        ):(
                            <tr className="bg-white dark:bg-slate-900 h-14 text-center py-3 px-4 border-b-2 border-gray-200 dark:border-slate-700 hover:bg-gray-300" key={0}>
                                <td>no data</td>
                                <td>no data</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="mx-4 w-1/2">
                    {complain.id ? (
                        <div className="bg-white dark:bg-slate-900 justify-center border-t border-gray-100 dark:border-slate-700">
                                <h2 className="text-2xl mt-2">Queja de {complain.name + " " + complain.lastName}</h2>
                                <dl className="divide-y divide-gray-300 dark:divide-slate-700">
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-400">Correo</dt>
                                        <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-400 sm:col-span-2 sm:mt-0">
                                            { complain.email }
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-400">Contenido</dt>
                                        <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-400 sm:col-span-2 sm:mt-0">
                                            { complain.content }
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-400">Mensaje de respuesta</dt>
                                        <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-400 sm:col-span-2 sm:mt-0">
                                            <textarea
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                placeholder="(En caso de manejar queja, escriba aquí su respuesta)"
                                            />
                                        </dd>
                                    </div>
                                    <div className="flex flex-row justify-around">
                                        <button
                                        type="submit"
                                        onClick={() => fetchDelete(complain.id)}
                                        className="bg-red-700 my-4 ml-4 w-32 h-12 text-white rounded-md shadow-lg hover:bg-green-300">
                                            Eliminar queja
                                        </button>
                                        <button
                                        type="submit"
                                        onClick={() => fetchUpdate(complain.id)}
                                        className="bg-green-700 my-4 ml-4 w-32 h-12 text-white rounded-md shadow-lg hover:bg-green-300">
                                            Manejar queja
                                        </button>
                                    </div>
                                </dl>
                        </div>
                    ):(
                        <div className="bg-white justify-center border-t border-gray-100 dark:bg-slate-900 dark:border-slate-700">
                            <div className="grid grid-cols-3 grid-rows-5">
                                <h3 className="row-start-3 col-start-2 text-2xl text-slate-700 dark:text-slate-400">Seleccione una queja</h3>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
  );
}