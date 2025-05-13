"use client";
import { useState, useEffect } from "react";
import {
    ArrowDownIcon,
    ArrowUpIcon,
} from '@heroicons/react/24/outline'
import { UserAuth } from '../../context/AuthContext';

export default function Postulations() {
    const [postulations, setPostulations] = useState([]);
    const [postulation, setPostulation] = useState({});
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
        let sorted = [...postulations];
        switch (sortOrder) {
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'dateStart':
                if(sortDirection === 'asc') {
                    sorted.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
                } else {
                    sorted.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                }
                break;
            default:
                return postulations;
        }
        
        if (sortDirection === 'desc') {
            sorted.reverse();
        }
    
        return sorted;
    };

    const fetchYes = async (datoDinamico) => {
        try {
            const response = await fetch((`http://localhost:3000/tutors/accept/${datoDinamico}`), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
                },
            })
            const result = await response.json();
            fetchPostulaciones();
            setPostulation({});
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    const fetchNo = async (datoDinamico) => {
        try {
            const response = await fetch((`http://localhost:3000/tutors/reject/${datoDinamico}`), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
                },
            })
            const result = await response.json();
            fetchPostulaciones();
            setPostulation({});
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchPostulaciones = async () => {
        try {
            const response = await fetch((`http://localhost:3000/unaccepted-tutors`), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
                },
            });
            const result = await response.json();
            setPostulations(result.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    const loadPostulacion = (id) => {
        const found = postulations.find(obj => obj.id == id);
        setPostulation(found);
    };

    useEffect(() => {
        fetchPostulaciones();
    }, []);
        
    return(
        <div className="bg-white dark:bg-slate-900 w-5/6 p-6">
            <h1 className="mt-4 text-3xl">
                Postulaciones por Procesar
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
                                onClick={() => toggleSortOrder('dateStart')}
                            >
                                <div className="flex items-center justify-center">
                                    <span className="px-2 text-slate-700 dark:text-slate-400">Apellido</span>
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
                        {postulations.length?(
                            sortedData().map((obj, i) => (
                                <tr
                                value = { obj.id } 
                                onClick={ () => loadPostulacion( obj.id ) }
                                className="bg-white dark:bg-slate-900 h-14 text-center py-3 px-4 border-b-2 border-gray-200 dark:border-slate-700 hover:bg-gray-300" 
                                key={i}>
                                    <td>{ obj.name }</td>
                                    <td>{ obj.lastName }</td>
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
                <div className="mx-4 w-2/3">
                    {postulation.id?(
                        <div className="bg-white dark:bg-slate-900 justify-center border-t border-gray-100 dark:border-slate-700">
                            <form action="#" method="POST" className="mx-auto mt-4 overflow-scroll">
                                <h2 className="text-2xl">Postulación de {postulation.name} {postulation.lastName}</h2>
                                <dl className="divide-y divide-gray-300 dark:divide-slate-700">
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-400">Email</dt>
                                        <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-400 sm:col-span-2 sm:mt-0">
                                            { postulation.email }
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-400">Ramos</dt>
                                        <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-400 sm:col-span-2 sm:mt-0">
                                            { postulation.courses.join(", ") }
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-400">Áreas</dt>
                                        <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-400 sm:col-span-2 sm:mt-0">
                                            { postulation.subjects.join(", ") }
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-400">Descripción</dt>
                                        <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-400 sm:col-span-2 sm:mt-0">
                                            { postulation.description }
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-400">Precio</dt>
                                        <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-400 sm:col-span-2 sm:mt-0">
                                            { postulation.priceDescription }
                                        </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-400">Foto</dt>
                                        <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-400 w-40 sm:col-span-2 sm:mt-0">
                                            <img src={postulation.photo} alt=""></img>
                                        </dd>
                                    </div>
                                    <div className="grid grid-cols-5">
                                        <button
                                        type="submit"
                                        onClick={() => fetchNo(postulation.id)}
                                        className="bg-red-700 my-4 ml-4 h-12 col-start-2 text-white rounded-md shadow-lg hover:bg-green-300">
                                            Rechazar
                                        </button>
                                        <button
                                        type="submit"
                                        onClick={() => fetchYes(postulation.id)}
                                        className="bg-green-700 my-4 ml-4 h-12 col-start-4 text-white rounded-md shadow-lg hover:bg-green-300">
                                            Aceptar
                                        </button>
                                    </div>
                                </dl>
                            </form>
                        </div>
                    ):(
                        <div className="bg-white justify-center border-t border-gray-100 dark:bg-slate-900 dark:border-slate-700">
                            <div className="grid grid-cols-3 grid-rows-5">
                                <h3 className="row-start-3 col-start-2 text-2xl text-slate-700 dark:text-slate-400">Seleccione una postulación</h3>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
