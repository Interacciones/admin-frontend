"use client";
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { UserAuth } from '../../context/AuthContext';

export default function CategoriesAdmin() {
    const { user } = UserAuth();
    const [categories, setCategories] = useState([]);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: "", description: "" });
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const handleClose = () => setOpen(false);

    const load = async () => {
        try {
            const res = await fetch(`http://localhost:3000/categories`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
                }
            });
            const data = await res.json();
            setCategories(data.data || data || []);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => { load(); }, []);

    const onEdit = (cat) => {
        setEditing(cat.id);
        setForm({ name: cat.name || "", description: cat.description || "" });
    };

    const onCancel = () => {
        setEditing(null);
        setForm({ name: "", description: "" });
    };

    const onSubmit = async (e) => {
        e?.preventDefault?.();
        try {
            const isEdit = Boolean(editing);
            const url = isEdit ? `http://localhost:3000/admin/categories/${editing}` : `http://localhost:3000/admin/categories`;
            const method = isEdit ? 'PATCH' : 'POST';
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.stsTokenManager.accessToken}`
                },
                body: JSON.stringify(form)
            });
            await res.json();
            if (res.status === 200 || res.status === 201) {
                setMessage(isEdit ? 'Categoría actualizada' : 'Categoría creada');
                setOpen(true);
                onCancel();
                load();
            } else {
                setMessage('Error al guardar categoría');
                setOpen(true);
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="w-5/6 p-6 bg-white dark:bg-slate-900">
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <DialogContentText>{message}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            <h2 className="text-3xl">Categorías</h2>
            <div className="mt-6 grid grid-cols-2 gap-8">
                <div>
                    <table className="w-full">
                        <thead className="h-12 max-h-12 outline outline-slate-200 dark:outline-slate-700">
                            <tr className="text-black dark:text-white text-left text-sm">
                                <th className="py-3 px-4 font-semibold text-sm">Nombre</th>
                                <th className="py-3 px-4 font-semibold text-sm">Descripción</th>
                                <th className="py-3 px-4 font-semibold text-sm">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className='text-slate-700 dark:text-slate-400 text-sm'>
                            {categories.length ? categories.map((c) => (
                                <tr key={c.id} className="border-b-2 border-gray-200 dark:border-slate-700">
                                    <td className="py-2 px-4">{c.name}</td>
                                    <td className="py-2 px-4">{c.description}</td>
                                    <td className="py-2 px-4">
                                        <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-md px-3 py-1" onClick={() => onEdit(c)}>Editar</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td className="py-2 px-4">no data</td>
                                    <td className="py-2 px-4">no data</td>
                                    <td className="py-2 px-4"></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div>
                    <form className="mx-auto mt-4" onSubmit={onSubmit}>
                        <h3 className="text-2xl mb-4">{editing ? 'Editar categoría' : 'Crear categoría'}</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-400">Nombre</label>
                            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full h-10 p-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-400">Descripción</label>
                            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full h-24 p-2 border border-gray-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400" />
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" className="bg-green-700 text-white rounded-md px-4 py-2">Guardar</button>
                            {editing && (
                                <button type="button" onClick={onCancel} className="bg-gray-500 text-white rounded-md px-4 py-2">Cancelar</button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}



