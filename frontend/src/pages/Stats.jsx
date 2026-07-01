import { useEffect, useState } from "react";
import axios from "axios";
import {
    FaClipboardList,
    FaExclamationCircle,
    FaCheckCircle,
    FaUser,
    FaClock,
    FaTag,
    FaEnvelope,
    FaCalendarAlt,
} from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";
import { toast } from "react-toastify";
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from "react-router-dom";

export default function Stats() {

    const navigate = useNavigate()
    const [stats, setStats] = useState({
        totalIssues: 0,
        openIssues: 0,
        progressIssues: 0,
        resolvedIssues: 0,
        recentIssues: [],
        recentUsers: [],
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/dashboard/stats");
            setStats(res.data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load stats");
        } finally {
            setLoading(false);
        }
    };

    const percent = (value) =>
        stats.totalIssues > 0 ? Math.round((value / stats.totalIssues) * 100) : 0;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-red-100 text-red-800';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800';
            case 'Resolved': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const cards = [
        {
            label: "Total Issues",
            value: stats.totalIssues,
            icon: FaClipboardList,
            iconBg: "bg-gray-900",
            iconColor: "text-white",
            sub: "All time",
        },
        {
            label: "Open",
            value: stats.openIssues,
            icon: FaExclamationCircle,
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
            sub: `${percent(stats.openIssues)}% of total`,
        },
        {
            label: "In Progress",
            value: stats.progressIssues,
            icon: MdPendingActions,
            iconBg: "bg-yellow-100",
            iconColor: "text-yellow-600",
            sub: `${percent(stats.progressIssues)}% of total`,
        },
        {
            label: "Resolved",
            value: stats.resolvedIssues,
            icon: FaCheckCircle,
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
            sub: `${percent(stats.resolvedIssues)}% of total`,
        },
    ];

    const roleBadge = {
        Admin: "bg-purple-100 text-purple-700 ring-1 ring-purple-200",
        "Production Manager": "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
    };

    return (
        <div className='min-h-screen w-full mx-auto bg-gray-50'>
            <div className="p-3 sm:p-5 lg:ml-68">
                <div className="mb-5">
                    <h1 className="text-2xl font-bold text-gray-900">Issue Stats</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Overview of all reported issues</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                    {loading
                        ? Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 animate-pulse"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-3 w-full">
                                        <div className="h-3 w-20 bg-gray-200 rounded" />
                                        <div className="h-8 w-14 bg-gray-200 rounded" />
                                        <div className="h-2.5 w-16 bg-gray-100 rounded" />
                                    </div>
                                    <div className="w-11 h-11 rounded-lg bg-gray-200 shrink-0" />
                                </div>
                            </div>
                        ))
                        : cards.map(({ label, value, icon: Icon, iconBg, iconColor, sub }) => (
                            <div
                                key={label}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">{label}</p>
                                        <h2 className="text-3xl font-bold mt-1.5 text-gray-900">
                                            {value}
                                        </h2>
                                        <p className="text-xs text-gray-400 mt-1.5">{sub}</p>
                                    </div>
                                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
                                        <Icon className={iconColor} size={20} />
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>

                {/* Recent Activity Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Issues */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <FaClipboardList className="text-gray-600" />
                                Recent Issues
                            </h3>
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard?tab=issues')}
                                className="text-xs text-gray-500 hover:underline"
                            >
                                View All
                            </button>
                        </div>

                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="h-16 bg-gray-100 rounded-lg"></div>
                                    </div>
                                ))}
                            </div>
                        ) : stats.recentIssues.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>No recent issues</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {stats.recentIssues.map((issue) => (
                                    <div
                                        key={issue._id}
                                        className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {issue.title}
                                                </p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        <FaTag className="text-gray-400" size={10} />
                                                        {issue.machineName}
                                                    </span>
                                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                                                        {issue.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                                {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Users */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <FaUser className="text-gray-600" />
                                Recent Users
                            </h3>
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard?tab=users')}
                                className="text-xs text-gray-500 hover:underline"
                            >
                                View All
                            </button>
                        </div>

                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="h-16 bg-gray-100 rounded-lg"></div>
                                    </div>
                                ))}
                            </div>
                        ) : stats.recentUsers.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>No recent users</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {stats.recentUsers.map((user) => (
                                    <div
                                        key={user._id}
                                        className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                                    <FaEnvelope className="text-gray-400" size={12} />
                                                    {user.email}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${roleBadge[user.role] || "bg-gray-100 text-gray-700"}`}>
                                                        {user.role}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2 flex items-center gap-1">
                                                <FaCalendarAlt size={10} />
                                                {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}