import { UserAuth } from '../context/AuthContext';

export default function Topbar() {
  const { logout } = UserAuth();

  return (
    <div className="w-full h-16 bg-white dark:bg-slate-900 sticky top-0 border-slate-400 dark:border-slate-300 border-b-2">
      <div className="w-full h-full flex items-center justify-between px-20">
        <div>
          <span className="font-bold text-3xl cursor-pointer">Pagina de Administrador</span>
        </div>
        <button
            type="button"
            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-slate-400"
            onClick={logout}
        >
            Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
