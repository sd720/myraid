'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Input, Button } from '@/components/UI';
import api from '@/utils/api';
import { encrypt, decrypt } from '@/utils/encryption';
import { useRouter } from 'next/navigation';
import { LogOut, Plus, Search, Filter, Trash2, Edit3, Loader2 } from 'lucide-react';

export default function DashboardPage() {
    const { user, logout, loading: authLoading } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});

    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', status: 'Pending' });

    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        } else if (user) {
            fetchTasks();
        }
    }, [user, authLoading, router, search, statusFilter, page]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const params = {
                search,
                status: statusFilter || undefined,
                page,
                limit: 5
            };
            const res = await api.get('/tasks', { params });
            const decryptedTasks = res.data.data.map(task => ({
                ...task,
                description: decrypt(task.description)
            }));
            setTasks(decryptedTasks);
            setPagination(res.data.pagination);
        } catch (err) {
            console.error('Failed to fetch tasks', err);
            if (err.code === 'ERR_NETWORK') {
                alert('Backend server is unreachable. Please ensure the backend is running and connected to MongoDB.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                description: encrypt(formData.description)
            };

            if (editingTask) {
                await api.put(`/tasks/${editingTask._id}`, payload);
            } else {
                await api.post('/tasks', payload);
            }
            setShowModal(false);
            setEditingTask(null);
            setFormData({ title: '', description: '', status: 'Pending' });
            fetchTasks();
        } catch (err) {
            alert('Operation failed');
        }
    };

    const handleDelete = async () => {
        if (!taskToDelete) return;
        try {
            await api.delete(`/tasks/${taskToDelete}`);
            setShowDeleteModal(false);
            setTaskToDelete(null);
            fetchTasks();
        } catch (err) {
            console.error('Delete failed', err);
            alert(`Delete failed: ${err.response?.data?.message || err.message}`);
        }
    };

    if (authLoading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
                        <p className="text-gray-600">Welcome back, {user.username}</p>
                    </div>
                    <Button variant="secondary" onClick={logout} className="flex items-center gap-2">
                        <LogOut size={18} /> Logout
                    </Button>
                </header>

                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-4">
                            <select
                                className="border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                            <Button onClick={() => { setEditingTask(null); setFormData({ title: '', description: '', status: 'Pending' }); setShowModal(true); }} className="flex items-center gap-2">
                                <Plus size={18} /> New Task
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-700 font-semibold">
                                    <tr>
                                        <th className="px-4 py-3">Title</th>
                                        <th className="px-4 py-3">Description</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {tasks.map(task => (
                                        <tr key={task._id} className="hover:bg-gray-50 transition duration-150">
                                            <td className="px-4 py-4 font-medium text-gray-900">{task.title}</td>
                                            <td className="px-4 py-4 text-gray-600 truncate max-w-xs">{task.description}</td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {task.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 space-x-2">
                                                <button onClick={() => { setEditingTask(task); setFormData({ title: task.title, description: task.description, status: task.status }); setShowModal(true); }} className="text-indigo-600 hover:text-indigo-900"><Edit3 size={18} /></button>
                                                <button onClick={() => { setTaskToDelete(task._id); setShowDeleteModal(true); }} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {tasks.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-4 py-8 text-center text-gray-500">No tasks found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-6">
                        <Button
                            variant="secondary"
                            disabled={!pagination.prev}
                            onClick={() => setPage(prev => prev - 1)}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-gray-600">Page {page}</span>
                        <Button
                            variant="secondary"
                            disabled={!pagination.next}
                            onClick={() => setPage(prev => prev + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-6">{editingTask ? 'Edit Task' : 'New Task'}</h2>
                        <form onSubmit={handleCreateOrUpdate}>
                            <Input
                                label="Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                                <textarea
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                                <select
                                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3">
                                <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit">{editingTask ? 'Update' : 'Create'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
                        <h2 className="text-2xl font-bold mb-4">Delete Task?</h2>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
