import { LineStyle, Timeline } from "@mui/icons-material";
import { UserIcon, ChartBarIcon, ClipboardDocumentListIcon, DocumentChartBarIcon, WindowIcon, EnvelopeIcon, ExclamationCircleIcon, Cog6ToothIcon, UserGroupIcon, ChatBubbleLeftEllipsisIcon, ArrowTrendingUpIcon, ReceiptPercentIcon, NoSymbolIcon, HomeIcon, UsersIcon, BuildingLibraryIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="bg-gray-100 dark:bg-slate-900 w-1/6 border-slate-400 dark:border-slate-300 border-r-2">
        <h3 className="text-gray-400 mt-4 ml-4">Menú rápido</h3>
        <dl className="mt-2 ml-8">
            <dt className="flex">
                <HomeIcon className="h-5 w-5"/>
                <Link href="/" className="ml-2">Inicio</Link>
            </dt>
            <dt className="flex">
                <UsersIcon className="h-5 w-5"/>
                  <Link href="/postulaciones" className="ml-2"> Postulaciones </Link>
            </dt>
            <dt className="flex">
                <UserIcon className="h-5 w-5"/>
                <Link href="/usuarios" className="ml-2">Usuarios</Link>
            </dt>
            <dt className="flex">
                <BookOpenIcon className="h-5 w-5"/>
                <Link href="/areas" className="ml-2">Áreas de estudio</Link>
            </dt>
            <dt className="flex">
                <ExclamationCircleIcon className="h-5 w-5"/>
                <Link href="/reportes" className="ml-2">Reportes</Link>
            </dt>
            <dt className="flex">
                <WindowIcon className="h-5 w-5"/>
                <Link href="/historial" className="ml-2">Historial Reportes</Link>
            </dt>
            <dt className="flex">
                <EnvelopeIcon className="h-5 w-5"/>
                <Link href="/reclamos" className="ml-2">Reclamos</Link>
            </dt>
            {/* <dt className="flex">
                <ChartBarIcon className="h-5 w-5"/>
                <Link href="#" className="ml-2">Estadísticas</Link>
            </dt>
            <dt className="flex">
                <UserGroupIcon className="h-5 w-5"/>
                <Link href="#" className="ml-2">Reportes de Tutores</Link>
            </dt>
            <dt className="flex">
                <ArrowTrendingUpIcon className="h-5 w-5"/>
                <Link href="#" className="ml-2">Ventas</Link>
            </dt>
             <dt className="flex">
                <DocumentChartBarIcon className="h-5 w-5"/>
                <Link href="#" className="ml-2">Cotizaciones</Link>
            </dt>
            <dt className="flex">
                <ClipboardDocumentListIcon className="h-5 w-5"/>
                <Link href="#" className="ml-2">Reportes</Link>
            </dt>
            <dt className="flex">
                <BuildingLibraryIcon className="h-5 w-5"/>
                <Link href="#" className="ml-2">Clientes</Link>
            </dt>
            <dt className="flex">
                <EnvelopeIcon className="h-5 w-5"/>
                <Link href="#" className="ml-2">Mail</Link>
            </dt>
            <dt className="flex">
                <ChatBubbleLeftEllipsisIcon className="h-5 w-5"/>
                <Link href="#" className="ml-2">Mensajes</Link>
            </dt>
            <dt className="flex">
                <NoSymbolIcon className="h-5 w-5"/>
                <Link href="#" className="ml-2">Bloquear usuarios</Link>
            </dt>
            <dt className="flex">
                <Cog6ToothIcon className="h-5 w-5"/>
                <Link href="#" className="ml-2">Ajustes</Link>
            </dt> */}
        </dl>
    </div>
  );
}
