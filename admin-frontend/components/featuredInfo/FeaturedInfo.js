import "./featuredInfo.css";
import React, { useState, useEffect } from 'react'
import { UserAuth } from '../context/AuthContext';

export default function FeaturedInfo() {
    const [postulations, setPostulations] = useState("-");
    const [registered, setRegisteres] = useState("-");
    const [reports, setReports] = useState("-");
    const { user } = UserAuth();

    const fetchStats = async () => {
        try {
            const response = await fetch((`http://localhost:3000/admin-stats`), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
                },
            });
            const result = await response.json();
            setPostulations(result.numberTutors);
            setRegisteres(result.numberUsers);
            setReports(result.numberReports);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
    <div className="bg-white dark:bg-slate-900 col-span-4 w-5/6 p-6 text-slate-700 dark:text-slate-400">
        <div className="grid grid-cols-3 gap-x-4 h-36 mt-4 mx-4">
            <div className="bg-white dark:bg-slate-900 outline outline-slate-200 dark:outline-slate-700 rounded-md">
                <h3 className="mt-8 ml-5 text-xl">Postulaciones por Revisar</h3>
                <div className="flex">
                    <p className="mt-2 ml-5 text-2xl font-bold">{postulations}</p>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-900 outline outline-slate-200 dark:outline-slate-700 rounded-md">
            <h3 className="mt-8 ml-5 text-xl">Usuarios Registrados</h3>
                <div className="flex">
                    <p className="mt-2 ml-5 text-2xl font-bold">{registered}</p>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-900 outline outline-slate-200 dark:outline-slate-700 rounded-md">
            <h3 className="mt-8 ml-5 text-xl">Reportes por Revisar</h3>
                <div className="flex">
                    <p className="mt-2 ml-5 text-2xl font-bold">{reports}</p>
                </div>
            </div>
        </div>
    </div>
  );
}
