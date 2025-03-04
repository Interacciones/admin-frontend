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
import { UserAuth } from '../../context/AuthContext';

export default function CommentsReports() {
    const [reports, setReports] = useState([]);
    const [report, setReport] = useState({});
    const [sortOrder, setSortOrder] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
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
        let sorted = [...reports];
        switch (sortOrder) {
            case 'name':
                sorted.sort((a, b) => a.userReporting.name.localeCompare(b.userReporting.name));
                break;
            case 'dateStart':
                if(sortDirection === 'asc') {
                    sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                } else {
                    sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                }
                break;
            default:
                return reports;
        }
        
        if (sortDirection === 'desc') {
            sorted.reverse();
        }
    
        return sorted;
    };

    const fetchUpdate = async (datoDinamico) => {
        if (!report.userReporting || !report.reviewer) {
            setOpen(true);
            setMessage("No se ha seleccionado un reporte válido");
            return;
        }

        try {
            const response = await fetch((`http://localhost:3000/reports/review/ignore`), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
                },
                body: JSON.stringify({
                    reportedByUserId: report.userReporting.id,
                    createdByUserId: report.reviewer.id,
                    reportId: report.id,
                    decisionArgument: "Se ignora el reporte"
                })
            })
            const result = await response.json();
            if (response.status === 200){
                fetchReportes();
                setReport({});
                setMessage("Reporte ignorado con éxito");
                setOpen(true);
            } else {
                setOpen(true);
                setMessage("Problema al actualizar reporte");
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
  
    const fetchDelete = async (datoDinamico) => {
        if (!report.userReporting || !report.reviewer) {
            setOpen(true);
            setMessage("No se ha seleccionado un reporte válido");
            return;
        }

        try {
            const response = await fetch((`http://localhost:3000/reports/review/eliminate`), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
                },
                body: JSON.stringify({
                    reportedByUserId: report.userReporting.id,
                    createdByUserId: report.reviewer.id,
                    reportId: report.id,
                    decisionArgument: "Se elimina el comentario"
                })
            })
            const result = await response.json();
            if (response.status === 200){
                fetchReportes();
                setReport({});
                setMessage("Reporte eliminado con éxito");
                setOpen(true);
            } else {
                setOpen(true);
                setMessage("Problema al eliminar reporte");
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchReportes = async () => {
        try {
            const response = await fetch(`http://localhost:3000/reports/review`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
                }
            });
            const result = await response.json();
            setReports(result.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    const loadPostulacion = (id) => {
        const found = reports.find(obj => obj.id == id);
        setReport(found);
    };

    useEffect(() => {
        fetchReportes();
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
                                    <span className="px-2 text-slate-700 dark:text-slate-400">Usuario reportado</span>
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
                        {reports.length?(
                            sortedData().map((obj, i) => (
                                <tr
                                value = { obj.id } 
                                onClick={ () => loadPostulacion( obj.id ) }
                                className="bg-white dark:bg-slate-900 h-14 text-center py-3 px-4 border-b-2 border-gray-200 dark:border-slate-700 hover:bg-gray-300" 
                                key={i}>
                                    <td>{ obj.reviewer.name + " " + obj.reviewer.lastName }</td>
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
                    {report.id ? (
                        <div className="bg-white dark:bg-slate-900 justify-center border-t border-gray-100 dark:border-slate-700">
                                <h2 className="text-2xl mt-2">Comentario reportado por {report.userReporting.name + " " + report.userReporting.lastName}</h2>
                                <dl className="divide-y divide-gray-300 dark:divide-slate-700">
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-400">Correo creador reporte</dt>
                                        <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-400 sm:col-span-2 sm:mt-0">
                                            { report.userReporting.email }
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-400">Usuario reportado</dt>
                                        <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-400 sm:col-span-2 sm:mt-0">
                                            { report.reviewer.name + " " + report.reviewer.lastName }
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-400">Comentario reportado</dt>
                                        <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-400 sm:col-span-2 sm:mt-0">
                                            { report.review.content }
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-400">Perfil del tutor</dt>
                                        <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-400 sm:col-span-2 sm:mt-0">
                                            { report.tutor.name + " " + report.tutor.lastName }
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-400">Descripción del reporte</dt>
                                        <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-400 sm:col-span-2 sm:mt-0">
                                            { report.description }
                                        </dd>
                                    </div>
                                    <div className="flex flex-row justify-around">
                                        <button
                                        type="submit"
                                        onClick={() => fetchDelete(report.id)}
                                        className="bg-red-700 my-4 ml-4 w-32 h-12 text-white rounded-md shadow-lg hover:bg-green-300">
                                            Eliminar comentario
                                        </button>
                                        <button
                                        type="submit"
                                        onClick={() => fetchUpdate(report.id)}
                                        className="bg-green-700 my-4 ml-4 w-32 h-12 text-white rounded-md shadow-lg hover:bg-green-300">
                                            Ignorar Reporte
                                        </button>
                                    </div>
                                </dl>
                        </div>
                    ):(
                        <div className="bg-white justify-center border-t border-gray-100 dark:bg-slate-900 dark:border-slate-700">
                            <div className="grid grid-cols-3 grid-rows-5">
                                <h3 className="row-start-3 col-start-2 text-2xl text-slate-700 dark:text-slate-400">Seleccione un reporte</h3>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
  );
}