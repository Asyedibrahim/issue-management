import { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaSpinner, FaTrash, FaUsers } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import CreateUserModal from '../ui/CreateUserModal';

const UserList = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createFormData, setCreateFormData] = useState({
        email: "",
        password: "",
        role: "",
    });
    const [creating, setCreating] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    const roleBadge = {
        Admin: "bg-purple-100 text-purple-700 ring-1 ring-purple-200",
        "Production Manager": "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
    };

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/users/search', {
                params: {
                    page: currentPage,
                    search: searchTerm,
                    role: roleFilter,
                },
            });
            setUsers(response.data.users);
            setTotalPages(response.data.totalPages);
            setTotalUsers(response.data.totalUsers);
        } catch (err) {
            console.error('Error fetching users:', err.message);
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm, roleFilter]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchUsers();
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [fetchUsers]);

    const handleCreateUser = async () => {
        setCreating(true);
        try {
            const response = await axios.post('/api/users/register', createFormData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200 || response.status === 201) {
                toast.success('User created successfully!');
                setShowCreateModal(false);
                setCreateFormData({
                    email: "",
                    password: "",
                    role: "",
                });
                await fetchUsers();
            } else {
                toast.error('Failed to create user');
            }
        } catch (err) {
            console.error('Error creating user:', err);
            toast.error(err.response?.data?.message || 'Failed to create user');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id, email) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `${email} will be permanently removed!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/api/users/delete/${id}`);
                toast.success('User deleted successfully!');
                await fetchUsers();
            } catch (err) {
                console.error('Error deleting user:', err);
                toast.error('Failed to delete user!');
            }
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleRoleFilter = (e) => {
        setRoleFilter(e.target.value);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setRoleFilter('');
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
    };

    const getPageNumbers = () => {
        const pages = [];
        const delta = 1;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }
        return pages;
    };

    const hasActiveFilters = searchTerm || roleFilter;

    return (
        <div className='min-h-screen w-full mx-auto bg-gray-50'>
            <div className="p-3 sm:p-5 lg:ml-68">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-5">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">User List</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {totalUsers > 0
                                ? `Showing ${(currentPage - 1) * 30 + 1}-${Math.min(currentPage * 30, totalUsers)} of ${totalUsers} users`
                                : 'No users to display'}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-black text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all font-medium text-sm shadow-sm whitespace-nowrap"
                    >
                        + Create User
                    </button>
                </div>

                {/* Filter bar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-5">
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        {/* Search */}
                        <div className="relative flex-1 min-w-0">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Search by email..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-shadow"
                            />
                            {loading && (
                                <FaSpinner className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin text-sm" />
                            )}
                        </div>

                        {/* Role Filter */}
                        <div className="relative sm:w-52">
                            <select
                                value={roleFilter}
                                onChange={handleRoleFilter}
                                className="w-full pl-3 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 appearance-none bg-white cursor-pointer transition-shadow"
                            >
                                <option value="">All Roles</option>
                                <option value="Admin">Admin</option>
                                <option value="Production Manager">Production Manager</option>
                            </select>
                        </div>
                    </div>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-gray-500 hover:text-black text-xs font-medium flex items-center gap-1 mt-3 underline underline-offset-2"
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-2">
                            <FaSpinner className="animate-spin text-gray-400 text-2xl" />
                            <span className="text-sm text-gray-400">Loading users...</span>
                        </div>
                    ) : users.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr className='text-xs text-gray-500 uppercase tracking-wide'>
                                        <th className="px-4 py-3 text-left font-semibold">#</th>
                                        <th className="px-4 py-3 text-left font-semibold">Email</th>
                                        <th className="px-4 py-3 text-left font-semibold">Role</th>
                                        <th className="px-4 py-3 text-left font-semibold">Created</th>
                                        <th className="px-4 py-3 text-center font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map((user, index) => (
                                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 text-gray-400">{(currentPage - 1) * 30 + index + 1}</td>
                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                {user.email}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${roleBadge[user.role] || "bg-gray-100 text-gray-700"}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-center gap-3">
                                                    <button
                                                        onClick={() => handleDelete(user._id, user.email)}
                                                        className="text-red-600 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                            <FaUsers className="text-4xl" />
                            <p className="text-sm">No users found</p>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="text-xs text-blue-600 hover:text-blue-800 underline underline-offset-2"
                                >
                                    Clear filters and try again
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                        <nav className="inline-flex items-center gap-1">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Prev
                            </button>

                            {getPageNumbers().map((page, idx) =>
                                page === '...' ? (
                                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm">…</span>
                                ) : (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${page === currentPage
                                                ? 'bg-black text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                )
                            )}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                )}
            </div>

            {/* Create User Modal */}
            <CreateUserModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                formData={createFormData}
                setFormData={setCreateFormData}
                creating={creating}
                onCreateUser={handleCreateUser}
            />
        </div>
    );
};

export default UserList;