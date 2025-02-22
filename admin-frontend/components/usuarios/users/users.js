import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
  } from '@tanstack/react-table'
import 'tailwindcss/tailwind.css';
import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  ArrowsUpDownIcon,
  ArrowDownIcon,
  ArrowUpIcon,
} from '@heroicons/react/24/outline';
import { UserAuth } from '../../../context/AuthContext';


export default function Users() {
  const [data, setData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [sorting, setSorting] = useState([])
  const [filtering, setFiltering] = useState('')
  const { user } = UserAuth();


  useEffect(() => {
    async function fetchData() {
      try {
        await fetchProfiles();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  
    fetchData();
  }, []);

  const fetchProfiles = async () => {
      try {
        const response = await fetch(`http://localhost:3000/admin-users/getAll`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
          },
        });
        const result = await response.json();
        // Agregar un campo 'blocked' a los datos si no existe
        const usersWithBlockedState = result.map(user => ({ ...user, blocked: !user.active || false}));
        setData(usersWithBlockedState);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
  
  const columns = [
      {
          header: 'Nombre',
          accessorKey: "name",
          sortable: true,
          cell: ({ row }) => String(row.original.name + " " + row.original.lastName),
      },{
          header: 'Correo',
          accessorKey: "email",
          sortable: true,
          cell: ({ row }) => String(row.original.email),
      }
  ]

  const handleBloquear = (user) => {
    setSelectedUser(user);
    if (!user.active) {
      setActionType('desbanear');
    } else {
      setActionType('banear');
    }
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
  };
  
  const confirmAction = async () => {
    setShowModal(false);
    // Encuentra el usuario en la lista de datos
    const userToModify = data.find((user) => user.id === selectedUser.id);
    if (userToModify) {
      // Verificar si el usuario está bloqueado
      const isBlocked = userToModify.active;

      if ((actionType === 'banear' && isBlocked) || (actionType === 'desbanear' && !isBlocked)) {
        const actionUrl = actionType === 'banear'
          ? `http://localhost:3000/admin-users/ban/${selectedUser.id}`
          : `http://localhost:3000/admin-users/unban/${selectedUser.id}`;

        // Enviar la solicitud al backend
        await fetch(actionUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
          },
        }).catch((error) => {
            console.error(`Error al ${actionType === 'banear' ? 'banear' : 'desbanear'} el usuario:`, error);
          });
        fetchProfiles();
      } else {
        console.error(`El usuario ya está ${actionType === 'banear' ? 'desbanear' : 'desbaneado'}`);
      }
    } else {
      console.error('Usuario no encontrado en la lista de datos');
    }
    // Restablecer el tipo de acción a una cadena vacía
    setActionType('');
  };

  const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      state: {
          sorting: sorting,
          globalFilter: filtering
      },
      onSortingChange: setSorting,
      onGlobalFilterChange: setFiltering,
  })

  
  return (
    <div className="bg-white dark:bg-slate-900 w-5/6">
        <div className="mx-auto max-w-2xl text-center py-4">
          <h2 className="text-3xl font-sans tracking-tight text-gray font-semibold sm:text-4xl">
            Usuarios
          </h2>
        </div>
        <main className="flex flex-col items-center justify-between mx-4 bg-white dark:bg-slate-900 p-2 pt-6">
          <div className="container mx-auto bg-white dark:bg-slate-900 mb-16">
            <div className="container mx-auto bg-white dark:bg-slate-900 mb-4 flex items-center">
              <p className="font-sans tracking-tight text-black dark:text-white font-semibold mr-2">Filtrar campos:</p>
              <input
                type='text'
                value={filtering}
                onChange={e => setFiltering(e.target.value)}
                className='block  rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                placeholder="Correo"
              />
            </div>
            <table className='min-w-full'>
              <thead className='border-b-gray-800 border-b-2 font-sans'>
                {table.getHeaderGroups().map(HeaderGroup => (
                  <tr key={HeaderGroup.id} className='text-slate-700 dark:text-slate-400 text-center'>
                    {HeaderGroup.headers.map(header => (
                      <th key={header.id} onClick={header.column.getToggleSortingHandler()} className="py-3 px-4 font-semibold text-sm cursor-pointer">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && ({
                          asc: <ArrowDownIcon className='h-4 inline' />,
                          desc: <ArrowUpIcon className='h-4 inline' />
                        }[header.column.getIsSorted()] ??
                          <ArrowsUpDownIcon className='h-4 inline' />
                        )}
                      </th>
                    ))}
                    <th className="py-3 px-4 font-semibold text-sm">
                      Acciones
                    </th>
                  </tr>
                ))}
              </thead>
              <tbody className='text-slate-700 dark:text-slate-400 border-gray-100 dark:border-slate-700 border-b-2 font-sans'>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="text-center border-gray-100 dark:border-slate-700 border-b-2">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                    <td className="flex items-center justify-center space-x-2">
                      <button
                          type='button'
                          onClick={() => handleBloquear(row.original)}
                          className="flex w-20 justify-center rounded-md bg-red-500 opacity-90 px-3 py-1.5 my-2 text-sm font-semibold leading-6 text-white shadow-sm hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                          {row.original.blocked ? 'Desbanear' : 'Banear'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
        {showModal && (
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
                      Confirmar Acción
                      </h3>
                      <div className="mt-2">
                      <p className="text-sm text-gray-500">
                          ¿Seguro que quieres {actionType === 'banear' ? 'banear' : 'desbanear'} a {selectedUser.name}?
                      </p>
                      </div>
                  </div>
                  </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button onClick={confirmAction} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
                  Confirmar
                  </button>
                  <button onClick={closeModal} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
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