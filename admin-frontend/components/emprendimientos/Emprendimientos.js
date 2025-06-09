"use client";
import { useState, useEffect } from "react";
import {
    ArrowDownIcon,
    ArrowUpIcon,
} from '@heroicons/react/24/outline'
import { UserAuth } from '../context/AuthContext';

export default function Emprendimientos() {
    const [projects, setProjects] = useState([]);
    const [project, setProject] = useState({});
    const [sortOrder, setSortOrder] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const { user } = UserAuth();

    const toggleSortOrder = (order) => {
        if (sortOrder === order) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortOrder(order);
            setSortDirection('asc');
        }
    }

    const sortedData = () => {
        let sorted = [...projects];
        switch (sortOrder) {
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'dateCreated':
                if(sortDirection === 'asc') {
                    sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                } else {
                    sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                }
                break;
            default:
                return projects;
        }
        
        if (sortDirection === 'desc') {
            sorted.reverse();
        }
    
        return sorted;
    };

    const acceptProject = async (projectId) => {
        try {
            const response = await fetch((`http://localhost:3000/projects/accept/${projectId}`), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
                },
            })
            const result = await response.json();
            fetchProjects();
            setProject({});
        } catch (error) {
            console.error('Error accepting project:', error);
        }
    };
    
    const rejectProject = async (projectId) => {
        try {
            const response = await fetch((`http://localhost:3000/projects/reject/${projectId}`), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
                },
            })
            const result = await response.json();
            fetchProjects();
            setProject({});
        } catch (error) {
            console.error('Error rejecting project:', error);
        }
    };

    const fetchProjects = async () => {
        try {
            const response = await fetch((`http://localhost:3000/unaccepted-projects`), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
                },
            });
            const result = await response.json();
            setProjects(result.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };
    
    const loadProject = (id) => {
        const found = projects.find(obj => obj.id == id);
        setProject(found);
    };

    useEffect(() => {
        fetchProjects();
    }, []);
        
    return(
        <div className="bg-white dark:bg-slate-900 w-5/6 p-6">
            <h1 className="mt-4 text-3xl">
                Proyectos Emprendedores por Procesar
            </h1>
            <div className="mt-4 flex">
                <table className="h-full w-1/3 mx-4">
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
                                onClick={() => toggleSortOrder('dateCreated')}
                            >
                                <div className="flex items-center justify-center">
                                    <span className="px-2 text-slate-700 dark:text-slate-400">Fecha</span>
                                    {sortOrder === 'dateCreated' && sortDirection === 'asc' && (
                                    <ArrowUpIcon className="h-4 w-4" aria-hidden="true" />
                                    )}
                                    {sortOrder === 'dateCreated' && sortDirection === 'desc' && (
                                    <ArrowDownIcon className="h-4 w-4" aria-hidden="true" />
                                    )}
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className='text-slate-700 dark:text-slate-400 text-sm'>
                        {projects.length ? (
                            sortedData().map((obj, i) => (
                                <tr
                                value={obj.id} 
                                onClick={() => loadProject(obj.id)}
                                className="bg-white dark:bg-slate-900 h-14 text-center py-3 px-4 border-b-2 border-gray-200 dark:border-slate-700 hover:bg-gray-300" 
                                key={i}>
                                    <td>{obj.name}</td>
                                    <td>{new Date(obj.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr className="bg-white dark:bg-slate-900 h-14 text-center py-3 px-4 border-b-2 border-gray-200 dark:border-slate-700 hover:bg-gray-300" key={0}>
                                <td>no data</td>
                                <td>no data</td>
                            </tr> 
                        )}
                    </tbody>
                </table>
                <div className="mx-4 w-2/3">
                    {project.id ? (
                        <div className="bg-white dark:bg-slate-900 justify-center border-t border-gray-100 dark:border-slate-700">
                            <form action="#" method="POST" className="mx-auto mt-4 overflow-scroll">
                                <h2 className="text-2xl">Proyecto: {project.name}</h2>
                                <dl className="divide-y divide-gray-300 dark:divide-slate-700">
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-400">Emprendedor</dt>
                                        <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-400 sm:col-span-2 sm:mt-0">
                                            {project.user?.name} {project.user?.lastName}
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-400">Email</dt>
                                        <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-400 sm:col-span-2 sm:mt-0">
                                            {project.user?.email}
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-400">Descripción</dt>
                                        <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-400 sm:col-span-2 sm:mt-0">
                                            {project.description}
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-400">Instagram</dt>
                                        <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-400 sm:col-span-2 sm:mt-0">
                                            {project.instagramProfile || 'No disponible'}
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-400">Mostrar contacto</dt>
                                        <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-400 sm:col-span-2 sm:mt-0">
                                            {project.showContact ? 'Sí' : 'No'}
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-400">Fecha de creación</dt>
                                        <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-400 sm:col-span-2 sm:mt-0">
                                            {new Date(project.createdAt).toLocaleDateString()}
                                        </dd>
                                    </div>
                                    {project.photos && project.photos.length > 0 && (
                                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                            <dt className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-400">Fotos</dt>
                                            <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-400 sm:col-span-2 sm:mt-0">
                                                <div className="grid grid-cols-2 gap-4">
                                                    {project.photos.map((photo, index) => (
                                                        <div key={photo.id} className="w-full">
                                                            <img 
                                                                src={photo.url} 
                                                                alt={`Foto ${index + 1} de ${project.name}`} 
                                                                className="max-w-full h-auto rounded"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </dd>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-5">
                                        <button
                                        type="button"
                                        onClick={() => rejectProject(project.id)}
                                        className="bg-red-700 my-4 ml-4 h-12 col-start-2 text-white rounded-md shadow-lg hover:bg-red-500">
                                            Rechazar
                                        </button>
                                        <button
                                        type="button"
                                        onClick={() => acceptProject(project.id)}
                                        className="bg-green-700 my-4 ml-4 h-12 col-start-4 text-white rounded-md shadow-lg hover:bg-green-500">
                                            Aceptar
                                        </button>
                                    </div>
                                </dl>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-white justify-center border-t border-gray-100 dark:bg-slate-900 dark:border-slate-700">
                            <div className="grid grid-cols-3 grid-rows-5">
                                <h3 className="row-start-3 col-start-2 text-2xl text-slate-700 dark:text-slate-400">Seleccione un proyecto</h3>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 