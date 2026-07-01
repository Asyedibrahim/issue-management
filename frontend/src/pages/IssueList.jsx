import { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaSpinner, FaFilter, FaEdit, FaTrash, FaInbox, FaChevronDown } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import CreateIssueModal from '../ui/CreateIssueModal';
import EditIssueModal from '../ui/EditIssueModal';
import { MdOutlineTrackChanges } from 'react-icons/md';
import IssueDetailModal from '../ui/IssueDetailModal';

const IssueList = () => {

    const { currentUser } = useSelector((state) => state.user);

    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    const [categories, setCategories] = useState([]);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createFormData, setCreateFormData] = useState({
        title: "",
        category: "",
        description: "",
        priority: "",
        machineName: "",
        reportedBy: "",
        status: "Open",
    });
    const [creating, setCreating] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: "",
        category: "",
        description: "",
        priority: "",
        machineName: "",
        reportedBy: "",
        status: "Open",
    });
    const [saving, setSaving] = useState(false);

    // Detail view
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // Status dropdown
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalIssues, setTotalIssues] = useState(0);

    const statusBadge = {
        Open: "bg-red-100 text-red-700 ring-1 ring-red-200",
        "In Progress": "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200",
        Resolved: "bg-green-100 text-green-700 ring-1 ring-green-200",
    };

    const priorityBadge = {
        High: "bg-red-50 text-red-600",
        Medium: "bg-orange-50 text-orange-600",
        Low: "bg-blue-50 text-blue-600",
    };

    const statusOptions = ['Open', 'In Progress', 'Resolved'];

    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/categories/get');
            setCategories(res.data.categories);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load categories");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchIssues = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/issue/search', {
                params: {
                    page: currentPage,
                    search: searchTerm,
                    category: categoryFilter,
                    status: statusFilter,
                },
            });
            setIssues(response.data.issues);
            setTotalPages(response.data.totalPages);
            setTotalIssues(response.data.totalIssues);
        } catch (err) {
            console.error('Error fetching issues:', err.message);
            toast.error('Failed to fetch issues');
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm, categoryFilter, statusFilter]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchIssues();
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [fetchIssues]);

    const handleCreateIssue = async () => {
        setCreating(true);
        try {
            const response = await axios.post('/api/issue/create', createFormData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                toast.success('Issue raised successfully!');
                setShowCreateModal(false);
                setCreateFormData({
                    title: "",
                    category: "",
                    description: "",
                    priority: "",
                    machineName: "",
                    reportedBy: "",
                    status: "Open",
                });
                await fetchIssues();
            } else {
                toast.error('Failed to create issue');
            }
        } catch (err) {
            console.error('Error creating issue:', err);
            toast.error('Failed to create issue');
        } finally {
            setCreating(false);
        }
    };

    const handleEditClick = (issue) => {
        setEditingId(issue._id);
        setEditFormData({
            title: issue.title || '',
            category: issue.category || '',
            description: issue.description || '',
            priority: issue.priority || '',
            machineName: issue.machineName || '',
            status: issue.status || '',
            reportedBy: issue.reportedBy || ''
        });
        setShowEditModal(true);
    };

    const handleEditIssue = async (id) => {
        setSaving(true);
        try {
            const response = await axios.put(`/api/issue/${id}`, editFormData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                toast.success('Issue updated successfully!');
                setShowEditModal(false);
                setEditingId(null);
                await fetchIssues();
            } else {
                toast.error('Failed to update issue');
            }
        } catch (err) {
            console.error('Error updating issue:', err);
            toast.error('Failed to update issue');
        } finally {
            setSaving(false);
        }
    };

    const handleStatusUpdate = async (issueId, newStatus) => {
        if (updatingStatus === issueId) return;

        setUpdatingStatus(issueId);
        try {
            const response = await axios.patch(`/api/issue/issue-status/${issueId}`, {
                status: newStatus
            });

            if (response.status === 200) {
                toast.success(`Status updated to ${newStatus}`);
                await fetchIssues();
                setStatusDropdownOpen(null);
            } else {
                toast.error('Failed to update status');
            }
        } catch (err) {
            console.error('Error updating status:', err);
            toast.error('Failed to update status');
        } finally {
            setUpdatingStatus(null);
        }
    };

    const handleRowClick = async (issue) => {
        setLoadingDetail(true);
        setSelectedIssue(null);
        setShowDetailModal(true);

        try {
            const response = await axios.get(`/api/issue/get/${issue._id}`);
            setSelectedIssue(response.data.issue);
        } catch (err) {
            console.error('Error fetching issue details:', err);
            toast.error('Failed to load issue details');
            setShowDetailModal(false);
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This issue will be deleted permanently!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/api/issue/${id}`);
                toast.success('Issue deleted successfully!');
                await fetchIssues();
            } catch (err) {
                console.error('Error deleting issue:', err);
                toast.error('Failed to delete issue!');
            }
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleCategoryFilter = (e) => {
        setCategoryFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusFilter = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setCategoryFilter('');
        setStatusFilter('');
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

    const hasActiveFilters = searchTerm || categoryFilter || statusFilter;

    return (
        <div className='min-h-screen w-full mx-auto bg-gray-50'>
            <div className="p-3 sm:p-5 lg:ml-68">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-5">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Issue List</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {totalIssues > 0
                                ? `Showing ${(currentPage - 1) * 30 + 1}-${Math.min(currentPage * 30, totalIssues)} of ${totalIssues} issues`
                                : 'No issues to display'}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-black text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all font-medium text-sm shadow-sm whitespace-nowrap"
                    >
                        + Raise Issue
                    </button>
                </div>

                {/* Filter bar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-5">
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        {/* Search */}
                        <div className="relative  min-w-0">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Search issues..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-shadow"
                            />
                            {loading && (
                                <FaSpinner className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin text-sm" />
                            )}
                        </div>

                        {/* Category Filter */}
                        <div className="relative sm:w-48">
                            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            <select
                                value={categoryFilter}
                                onChange={handleCategoryFilter}
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 appearance-none bg-white cursor-pointer transition-shadow"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="relative sm:w-44">
                            <MdOutlineTrackChanges className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            <select
                                value={statusFilter}
                                onChange={handleStatusFilter}
                                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 appearance-none bg-white cursor-pointer transition-shadow"
                            >
                                <option value="">All Status</option>
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-red-500 hover:text-red-800 text-xs font-medium flex items-center gap-1 mt-3 underline underline-offset-2"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-2">
                            <FaSpinner className="animate-spin text-gray-400 text-2xl" />
                            <span className="text-sm text-gray-400">Loading issues...</span>
                        </div>
                    ) : issues.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr className='text-xs text-gray-500 uppercase tracking-wide'>
                                        <th className="px-4 py-3 text-left font-semibold">#</th>
                                        <th className="px-4 py-3 text-left font-semibold">Issue</th>
                                        <th className="px-4 py-3 text-left font-semibold">Category</th>
                                        <th className="px-4 py-3 text-left font-semibold">Priority</th>
                                        <th className="px-4 py-3 text-left font-semibold">Machine</th>
                                        <th className="px-4 py-3 text-left font-semibold">Reported By</th>
                                        <th className="px-4 py-3 text-left font-semibold">Status</th>
                                        <th className="px-4 py-3 text-left font-semibold">Created</th>
                                        <th className="px-4 py-3 text-center font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {issues.map((issue, index) => (
                                        <tr
                                            key={issue._id}
                                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                                            onClick={() => handleRowClick(issue)}
                                        >
                                            <td className="px-4 py-3 text-gray-400">{(currentPage - 1) * 30 + index + 1}</td>
                                            <td className="px-4 py-3 font-medium text-gray-800 max-w-[220px] truncate">
                                                {issue.title}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {issue.category}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${priorityBadge[issue.priority] || "bg-gray-50 text-gray-600"}`}>
                                                    {issue.priority || '—'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {issue.machineName || '—'}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {issue.reportedBy || '—'}
                                            </td>
                                            <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                                {/* Status Dropdown */}
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setStatusDropdownOpen(
                                                            statusDropdownOpen === issue._id ? null : issue._id
                                                        )}
                                                        className={`px-2.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-colors ${statusBadge[issue.status] || "bg-gray-100 text-gray-700"}`}
                                                        disabled={updatingStatus === issue._id}
                                                    >
                                                        {updatingStatus === issue._id ? (
                                                            <FaSpinner className="animate-spin" size={10} />
                                                        ) : (
                                                            <>
                                                                {issue.status}
                                                                <FaChevronDown size={8} />
                                                            </>
                                                        )}
                                                    </button>

                                                    {statusDropdownOpen === issue._id && (
                                                        <div className="absolute z-10 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                                                            {statusOptions.map((status) => (
                                                                <button
                                                                    key={status}
                                                                    onClick={() => handleStatusUpdate(issue._id, status)}
                                                                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 transition-colors ${status === issue.status ? 'bg-gray-50 font-medium' : ''
                                                                        }`}
                                                                >
                                                                    <span className={`px-2 py-0.5 rounded-full ${statusBadge[status]}`}>
                                                                        {status}
                                                                    </span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString('en-GB') : '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-center gap-3">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditClick(issue);
                                                        }}
                                                        className="text-blue-600 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    {currentUser.role === 'Admin' && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(issue._id);
                                                            }}
                                                            className="text-red-600 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <FaTrash />
                                                        </button>

                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                            <FaInbox className="text-4xl" />
                            <p className="text-sm">No issues found</p>
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

            {/* Create Issue Modal */}
            <CreateIssueModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                formData={createFormData}
                setFormData={setCreateFormData}
                creating={creating}
                onCreateIssue={handleCreateIssue}
                categories={categories}
            />

            {/* Edit Issue Modal */}
            <EditIssueModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                formData={editFormData}
                setFormData={setEditFormData}
                saving={saving}
                onSave={() => handleEditIssue(editingId)}
                categories={categories}
            />

            {/* View Details */}
            <IssueDetailModal
                isOpen={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedIssue(null);
                }}
                issue={selectedIssue}
                loading={loadingDetail}
                statusBadge={statusBadge}
                priorityBadge={priorityBadge}
            />
        </div>
    );
};

export default IssueList;