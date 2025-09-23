"use client";
import { useState, useEffect } from "react";
import {
    ArrowDownIcon,
    ArrowUpIcon,
} from '@heroicons/react/24/outline'
import { UserAuth } from '../../context/AuthContext';

export default function Areas() {
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedArea, setSelectedArea] = useState(null);
    const [newSubject, setNewSubject] = useState('');
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
        let sorted = [...areas];
        switch (sortOrder) {
            case 'id':
                sorted.sort((a, b) => a.id - b.id);
                break;
            case 'subject':
                sorted.sort((a, b) => a.subject.localeCompare(b.subject));
                break;
            default:
                return areas;
        }
        
        if (sortDirection === 'desc') {
            sorted.reverse();
        }
    
        return sorted;
    };

    const fetchAreas = async () => {
        try {
            setLoading(true);
            const response = await fetch((`http://localhost:3000/subjects`), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.stsTokenManager?.accessToken}`
                },
            });
            const result = await response.json();
            setAreas(result.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching areas:', error);
            setLoading(false);
        }
    };

    const handleDelete = (area) => {
        setSelectedArea(area);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const confirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/admin/subjects/${selectedArea.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.stsTokenManager?.accessToken}`
                },
            });
            
            if (response.ok) {
                // Remove the area from the state
                setAreas(areas.filter(area => area.id !== selectedArea.id));
                setShowDeleteModal(false);
            } else {
                console.error('Error deleting area');
            }
        } catch (error) {
            console.error('Error deleting area:', error);
        }
    };

    const handleAddSubject = async (e) => {
        e.preventDefault();
        if (!newSubject.trim()) return;
        
        try {
            const response = await fetch('http://localhost:3000/admin/subjects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.stsTokenManager?.accessToken}`
                },
                body: JSON.stringify({ subject: newSubject }),
            });
            
            if (response.ok) {
                // Refresh the list of areas
                fetchAreas();
                setNewSubject('');
            } else {
                console.error('Error adding new subject');
            }
        } catch (error) {
            console.error('Error adding new subject:', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchAreas();
        }
    }, [user]);
        
    return(
        <div className="bg-white dark:bg-slate-900 w-5/6 p-6">
            <h1 className="mt-4 text-3xl font-semibold text-slate-800 dark:text-white">
                Áreas de estudio
            </h1>

            {/* Add new subject form */}
            <div className="mt-6 mb-8">
                <form onSubmit={handleAddSubject} className="flex items-center space-x-4">
                    <input
                        type="text"
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        placeholder="Nombre del área"
                        className="block rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        required
                    />
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Agregar Área
                    </button>
                </form>
            </div>

            <div className="mt-8">
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="text-slate-700 dark:text-slate-400">Cargando áreas...</div>
                    </div>
                ) : (
                    <div className="overflow-x-auto shadow-md rounded-lg">
                        <table className="w-full table-auto">
                            <thead className="bg-slate-100 dark:bg-slate-800">
                                <tr className="text-slate-700 dark:text-slate-300 text-left text-sm">
                                    <th 
                                        className="py-3 px-6 font-semibold cursor-pointer"
                                        onClick={() => toggleSortOrder('id')}
                                    >
                                        <div className="flex items-center">
                                            <span>ID</span>
                                            {sortOrder === 'id' && sortDirection === 'asc' && (
                                                <ArrowUpIcon className="h-4 w-4 ml-1" aria-hidden="true" />
                                            )}
                                            {sortOrder === 'id' && sortDirection === 'desc' && (
                                                <ArrowDownIcon className="h-4 w-4 ml-1" aria-hidden="true" />
                                            )}
                                        </div>
                                    </th>
                                    <th 
                                        className="py-3 px-6 font-semibold cursor-pointer"
                                        onClick={() => toggleSortOrder('subject')}
                                    >
                                        <div className="flex items-center">
                                            <span>Nombre del Área</span>
                                            {sortOrder === 'subject' && sortDirection === 'asc' && (
                                                <ArrowUpIcon className="h-4 w-4 ml-1" aria-hidden="true" />
                                            )}
                                            {sortOrder === 'subject' && sortDirection === 'desc' && (
                                                <ArrowDownIcon className="h-4 w-4 ml-1" aria-hidden="true" />
                                            )}
                                        </div>
                                    </th>
                                    <th className="py-3 px-6 font-semibold">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {areas.length ? (
                                    sortedData().map((area) => (
                                        <tr 
                                            key={area.id} 
                                            className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        >
                                            <td className="py-4 px-6 text-slate-700 dark:text-slate-300">{area.id}</td>
                                            <td className="py-4 px-6 text-slate-700 dark:text-slate-300">{area.subject}</td>
                                            <td className="py-4 px-6">
                                                <button
                                                    onClick={() => handleDelete(area)}
                                                    className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="bg-white dark:bg-slate-900">
                                        <td colSpan={3} className="py-4 px-6 text-center text-slate-700 dark:text-slate-300">
                                            No hay áreas disponibles
                                        </td>
                                    </tr> 
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                            Confirmar Eliminación
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                ¿Seguro que quieres eliminar el área "{selectedArea?.subject}"?
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button 
                                    onClick={confirmDelete} 
                                    type="button" 
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Eliminar
                                </button>
                                <button 
                                    onClick={closeDeleteModal} 
                                    type="button" 
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}