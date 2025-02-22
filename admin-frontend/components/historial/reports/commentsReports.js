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
import { UserAuth } from '../../context/AuthContext';


export default function CommentsReports() {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([])
  const [filtering, setFiltering] = useState('')
  const { user } = UserAuth();


  useEffect(() => {
    async function fetchData() {
      try {
        await fetchReports();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  
    fetchData();
  }, []);

  const fetchReports = async () => {
      try {
        const response = await fetch(`http://localhost:3000/reviewreport/history`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
          },
        });
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
  
  const columns = [
      {
          header: 'Tutor reportado',
          accessorKey: "mail-reportado",
          sortable: true,
          cell: ({ row }) => String(row.original.reportedUser.email),
      },{
          header: 'Estudiante creador reporte',
          accessorKey: "mail-que-reporta",
          sortable: true,
          cell: ({ row }) => String(row.original.reportingUser.email),
      },{
        header: 'Descripción',
        accessorKey: "description",
        sortable: true,
        cell: ({ row }) => String(row.original.commentText),
      },{
        header: 'Fecha creación',
        accessorKey: "date",
        sortable: true,
        cell: ({ row }) => String(new Date(row.original.createdAt).toISOString().slice(0, 10)),
      },{
        header: 'Decisión',
        accessorKey: "status",
        sortable: true,
        cell: ({ row }) => String(row.original.status),
      }
    ]

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
    <div className="bg-white dark:bg-slate-900">
      <main className="flex flex-col items-center justify-between mx-4 bg-white dark:bg-slate-900 p-2 pt-6">
        <div className="container mx-auto bg-white dark:bg-slate-900 mb-16">
          <div className="container mx-auto bg-white dark:bg-slate-900 mb-4 flex items-center">
            <p className="font-sans tracking-tight text-black dark:text-white font-semibold mr-2">Filtrar campos:</p>
            <input
              type='text'
              value={filtering}
              onChange={e => setFiltering(e.target.value)}
              className='block  rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              placeholder="Filtro"
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}