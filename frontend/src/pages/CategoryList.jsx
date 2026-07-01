import { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState("");
    const [creating, setCreating] = useState(false);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/categories/get");
            setCategories(res.data.categories);
        } catch (err) {
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async () => {
        if (!name.trim()) return toast.warning("Enter category name");

        setCreating(true);
        try {
            const res = await axios.post("/api/categories/create", { name });

            if (res.status === 201) {
                toast.success("Category created!");
                setName("");
                setShowModal(false);
                fetchCategories();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Error creating category");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id, name) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `${name} will be deleted`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Delete"
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/api/categories/${id}`);
                toast.success("Deleted");
                fetchCategories();
            } catch (err) {
                toast.error("Delete failed");
            }
        }
    };

    return (
        <div className='min-h-screen w-full mx-auto bg-gray-50'>
            <div className="p-3 sm:p-5 lg:ml-68">
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-2xl font-bold">Category List</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-black text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all font-medium text-sm shadow-sm whitespace-nowrap"
                    >
                        + Add Category
                    </button>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <p className="p-5 text-gray-400">Loading...</p>
                    ) : categories.length > 0 ? (
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr className="text-xs text-gray-500 uppercase tracking-wide">
                                    <th className="p-3 text-left">#</th>
                                    <th className="p-3 text-left">Name</th>
                                    <th className="p-3 text-left">Created</th>
                                    <th className="p-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {categories.map((cat, i) => (
                                    <tr key={cat._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-3 text-gray-400">{i + 1}</td>
                                        <td className="p-3 flex items-center gap-2">
                                            {cat.name}
                                        </td>
                                        <td className="p-3 text-gray-400">
                                            {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString('en-GB') : '—'}

                                        </td>
                                        <td className="p-3 text-center">
                                            <button
                                                onClick={() => handleDelete(cat._id, cat.name)}
                                                className="text-red-600"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="p-5 text-gray-400">No categories</p>
                    )}
                </div>
                {showModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
                            <h2 className="text-lg font-semibold mb-4">Create Category</h2>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Category Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Machine Breakdown"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-3 py-1 text-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreate}
                                    disabled={creating}
                                    className="bg-black text-white px-4 py-2 rounded-lg"
                                >
                                    {creating ? "Creating..." : "Create Category"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

};

export default CategoryList;
