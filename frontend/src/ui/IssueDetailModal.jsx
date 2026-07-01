import React from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import { format } from 'date-fns';

const IssueDetailModal = ({
    isOpen,
    onClose,
    issue,
    loading,
    statusBadge,
    priorityBadge,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <FaSpinner className="animate-spin text-gray-400 text-3xl" />
                            <span className="text-sm text-gray-400 mt-3">Loading issue details...</span>
                        </div>
                    ) : issue ? (
                        <div className="p-6">
                            <div className="mb-6">
                                <div className="flex items-start justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900 pr-8">
                                        {issue.title}
                                    </h2>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusBadge[issue.status] || "bg-gray-100 text-gray-700"}`}>
                                        {issue.status}
                                    </span>
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${priorityBadge[issue.priority] || "bg-gray-50 text-gray-600"}`}>
                                        {issue.priority || 'No Priority'}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Category</label>
                                        <p className="text-sm text-gray-900 mt-0.5">{issue.category || '—'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Machine Name</label>
                                        <p className="text-sm text-gray-900 mt-0.5">{issue.machineName || '—'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Reported By</label>
                                        <p className="text-sm text-gray-900 mt-0.5">{issue.reportedBy || '—'}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Created</label>
                                        <p className="text-sm text-gray-900 mt-0.5">
                                            {issue.createdAt ? new Date(issue.createdAt).toLocaleString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</label>
                                        <p className="text-sm text-gray-900 mt-0.5">
                                            {issue.updatedAt ? new Date(issue.updatedAt).toLocaleString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : '—'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200 mb-5">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Description</label>
                                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                        {issue.description || 'No description provided'}
                                    </p>
                                </div>
                            </div>

                            {issue.document?.url ? (
                                issue.document.url.includes(".pdf") ? (
                                    <div
                                        onClick={() => window.open(issue.document.url, "_blank")}
                                        className="w-full h-40 border border-gray-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition"
                                    >
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-gray-700">📄 PDF Document</p>
                                            <p className="text-xs text-gray-500 mt-1">Click to view full file</p>
                                        </div>
                                    </div>
                                ) : (
                                    <img
                                        src={issue.document.url}
                                        alt="Issue Document"
                                        className="w-full max-h-64 object-contain rounded-lg border border-gray-400 cursor-pointer"
                                        onClick={() => window.open(issue.document.url, "_blank")}
                                    />
                                )
                            ) : (
                                <div className="w-full h-32 border border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                    <p className="text-sm text-gray-500">No document available</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16">
                            <p className="text-gray-400">Failed to load issue details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IssueDetailModal;