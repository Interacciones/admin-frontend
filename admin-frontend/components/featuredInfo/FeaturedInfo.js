import "./featuredInfo.css";
import React, { useState, useEffect } from 'react'
import { UserAuth } from '../context/AuthContext';

export default function FeaturedInfo() {
    const [postulations, setPostulations] = useState("-");
    const [registered, setRegisteres] = useState("-");
    const [reports, setReports] = useState("-");
    const [complains, setComplains] = useState("-");
    const [tutorPriority, setTutorPriority] = useState("-");
    const [tutorProfiles, setTutorProfiles] = useState("-");
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
            setPostulations(result.data.unpublishedTutorsCount);
            setRegisteres(result.data.totalUsersCount);
            setReports(result.data.pendingReportsCount);
            setComplains(result.data.totalComplainsCount);
            setTutorPriority(result.data.totalTutorPriorityCount);
            setTutorProfiles(result.data.totalTutorProfilesCount);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
    <div className="bg-white dark:bg-slate-900 col-span-4 w-5/6 p-6 text-slate-700 dark:text-slate-400">
        <div className="grid grid-cols-3 gap-4 mt-4 mx-4">
            <div className="bg-white dark:bg-slate-900 outline outline-slate-200 dark:outline-slate-700 rounded-md p-4">
                <h3 className="text-xl">Postulaciones por Revisar</h3>
                <p className="mt-2 text-2xl font-bold">{postulations}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 outline outline-slate-200 dark:outline-slate-700 rounded-md p-4">
                <h3 className="text-xl">Usuarios Registrados</h3>
                <p className="mt-2 text-2xl font-bold">{registered}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 outline outline-slate-200 dark:outline-slate-700 rounded-md p-4">
                <h3 className="text-xl">Reportes por Revisar</h3>
                <p className="mt-2 text-2xl font-bold">{reports}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 outline outline-slate-200 dark:outline-slate-700 rounded-md p-4">
                <h3 className="text-xl">Total de Quejas</h3>
                <p className="mt-2 text-2xl font-bold">{complains}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 outline outline-slate-200 dark:outline-slate-700 rounded-md p-4">
                <h3 className="text-xl">Tutores Prioritarios</h3>
                <p className="mt-2 text-2xl font-bold">{tutorPriority}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 outline outline-slate-200 dark:outline-slate-700 rounded-md p-4">
                <h3 className="text-xl">Perfiles de Tutores</h3>
                <p className="mt-2 text-2xl font-bold">{tutorProfiles}</p>
            </div>
        </div>
    </div>
  );
}
