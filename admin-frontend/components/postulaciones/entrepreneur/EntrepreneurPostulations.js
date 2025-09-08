"use client";
import { useState, useEffect } from "react";
import {
	ArrowDownIcon,
	ArrowUpIcon,
} from '@heroicons/react/24/outline'
import { UserAuth } from '../../context/AuthContext';

export default function EntrepreneurPostulations() {
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
				sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
				break;
			case 'userId':
				if(sortDirection === 'asc') {
					sorted.sort((a, b) => (a.userId || 0) - (b.userId || 0));
				} else {
					sorted.sort((a, b) => (b.userId || 0) - (a.userId || 0));
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

	const acceptProject = async (id) => {
		try {
			const response = await fetch((`http://localhost:3000/projects/accept/${id}`), {
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
			console.error('Error fetching data:', error);
		}
	};

	const rejectProject = async (id) => {
		try {
			const response = await fetch((`http://localhost:3000/projects/reject/${id}`), {
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
			console.error('Error fetching data:', error);
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
			setProjects(result.data || []);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	const loadProject = (id) => {
		const found = projects.find(obj => obj.id == id);
		setProject(found || {});
	};

	useEffect(() => {
		fetchProjects();
	}, []);

	return(
		<div className="bg-white dark:bg-slate-900 w-5/6 p-6">
			<h1 className="mt-4 text-3xl">
				Proyectos de emprendimiento por procesar
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
									<span className="px-2 text-slate-700 dark:text-slate-400">Usuario</span>
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
								onClick={() => toggleSortOrder('userId')}
							>
								<div className="flex items-center justify-center">
									<span className="px-2 text-slate-700 dark:text-slate-400">Usuario ID</span>
									{sortOrder === 'userId' && sortDirection === 'asc' && (
									<ArrowUpIcon className="h-4 w-4" aria-hidden="true" />
									)}
									{sortOrder === 'userId' && sortDirection === 'desc' && (
									<ArrowDownIcon className="h-4 w-4" aria-hidden="true" />
									)}
								</div>
							</th>
						</tr>
					</thead>
					<tbody className='text-slate-700 dark:text-slate-400 text-sm'>
						{projects.length?(
							sortedData().map((obj, i) => (
								<tr
								value = { obj.id } 
								onClick={ () => loadProject( obj.id ) }
								className="bg-white dark:bg-slate-900 h-14 text-center py-3 px-4 border-b-2 border-gray-200 dark:border-slate-700 hover:bg-gray-300" 
								key={i}>
									<td>{ obj.name }</td>
									<td>{ obj.userId }</td>
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
					{project.id?(
						<div className="bg-white dark:bg-slate-900 justify-center border-t border-gray-100 dark:border-slate-700">
							<form action="#" method="POST" className="mx-auto mt-4 overflow-scroll">
								<h2 className="text-2xl">Proyecto {project.name}</h2>
								<dl className="divide-y divide-gray-300 dark:divide-slate-700">
									<div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
										<dt className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-400">Usuario ID</dt>
										<dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-400 sm:col-span-2 sm:mt-0">
											{ project.userId }
										</dd>
									</div>
									<div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
										<dt className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-400">Activo</dt>
										<dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-400 sm:col-span-2 sm:mt-0">
											{ String(project.isActive) }
										</dd>
									</div>
									<div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
										<dt className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-400">Descripción</dt>
										<dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-400 sm:col-span-2 sm:mt-0">
											{ project.description }
										</dd>
									</div>
									<div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
										<dt className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-400">Fotos</dt>
										<dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-400 w-full sm:col-span-2 sm:mt-0">
											<div className="grid grid-cols-3 gap-4">
												{(project.photos || []).map((url, idx) => (
													<img key={idx} src={url} alt="Foto del proyecto" className="w-40 h-40 object-cover" />
												))}
											</div>
										</dd>
									</div>
									<div className="grid grid-cols-5">
										<button
										type="submit"
										onClick={() => rejectProject(project.id)}
										className="bg-red-700 my-4 ml-4 h-12 col-start-2 text-white rounded-md shadow-lg hover:bg-green-300">
											Rechazar
										</button>
										<button
										type="submit"
										onClick={() => acceptProject(project.id)}
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
								<h3 className="row-start-3 col-start-2 text-2xl text-slate-700 dark:text-slate-400">Seleccione un proyecto</h3>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}







