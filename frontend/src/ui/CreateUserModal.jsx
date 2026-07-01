import React, { useEffect, useState } from 'react';
import { FaSpinner, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';

const CreateUserModal = ({
    isOpen,
    onClose,
    formData,
    setFormData,
    creating,
    onCreateUser,
}) => {

    const [showPassword, setShowPassword] = useState(false);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && !creating) onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, creating, onClose]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreateUser();
    };

    if (!isOpen) return null;

    const inputClass = "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-shadow bg-white";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    const isValid = formData.email && formData.password && formData.role;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-50 p-4"
            onClick={() => !creating && onClose()}
        >
            <div
                className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Create User</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Add a new admin or production manager</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={creating}
                        className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors disabled:opacity-50"
                        aria-label="Close"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
                    {/* Email */}
                    <div>
                        <label className={labelClass}>
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleFormChange}
                            placeholder="user@company.com"
                            className={inputClass}
                            autoComplete="off"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className={labelClass}>
                            Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password || ''}
                                onChange={handleFormChange}
                                placeholder="Minimum 8 characters"
                                className={`${inputClass} pr-10`}
                                autoComplete="new-password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                tabIndex={-1}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* Role */}
                    <div>
                        <label className={labelClass}>
                            Role <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="role"
                            value={formData.role || ''}
                            onChange={handleFormChange}
                            className={`${inputClass} cursor-pointer`}
                            required
                        >
                            <option value="">Select Role</option>
                            <option value="Admin">Admin</option>
                            <option value="Production Manager">Production Manager</option>
                        </select>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={creating}
                        className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={creating || !isValid}
                        className="px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center gap-2"
                    >
                        {creating && <FaSpinner className="animate-spin" size={14} />}
                        {creating ? 'Creating...' : 'Create User'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateUserModal;