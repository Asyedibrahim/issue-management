import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdLogout, MdSyncProblem, MdPerson, MdCategory } from "react-icons/md";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { signOutSuccess } from '../redux/user/userSlice.js';
import { useDispatch, useSelector } from 'react-redux';

export default function LgSideBar() {

    const location = useLocation();
    const [tab, setTab] = useState('');
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user)

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    const handleLogout = async () => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'You will be logged out of your account!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Log out!',
                cancelButtonText: 'Cancel!'
            });
            if (result.isConfirmed) {
                const res = await fetch('/api/users/signout', {
                    method: 'POST'
                });
                const data = await res.json();
                if (res.ok) {
                    toast.success('Logged out successfully!', { theme: 'colored' });
                    dispatch(signOutSuccess(data));
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const navItems = [
        { to: '/dashboard?tab=stats', tab: 'stats', label: 'Stats', icon: MdDashboard, adminOnly: false },
        { to: '/dashboard?tab=issues', tab: 'issues', label: 'Issues', icon: MdSyncProblem, adminOnly: false },
        { to: '/dashboard?tab=users', tab: 'users', label: 'Users', icon: MdPerson, adminOnly: true },
        { to: '/dashboard?tab=categories', tab: 'categories', label: 'Categories', icon: MdCategory, adminOnly: true },
    ];

    const filteredNavItems = navItems.filter(item => { 
        if (item.adminOnly && currentUser?.role !== 'Admin') return false; 
        return true; 
    });

    return (
        <div className="remove-scrollbar w-full md:w-[17rem] bg-gray-900 text-gray-200 shadow-md h-screen overflow-y-auto flex flex-col">
            <div className="py-5 border-b border-gray-400">
                <h1 className="font-cinzel font-serif text-xl font-extrabold text-center tracking-wide text-white">
                    Production Issue Management System
                </h1>
            </div>

            {/* User info card */}
            <div className="mx-3 mt-4 mb-2 px-3 py-3 bg-gray-800 rounded-lg shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-semibold uppercase shrink-0">
                    {currentUser?.username?.charAt(0) || currentUser?.role?.charAt(0) || '?'}
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                        {currentUser?.username || 'User'}
                    </p>
                    <span className="inline-block text-xs font-medium text-gray-300 uppercase tracking-wide">
                        {currentUser?.role}
                    </span>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-2 px-3 mt-3">
                {filteredNavItems.map(({ to, tab: itemTab, label, icon: Icon }) => (
                    <Link key={itemTab} to={to}>
                        <div
                            className={`px-3 py-2.5 flex items-center rounded-lg gap-3 cursor-pointer font-medium text-[15px] transition-all duration-150 ease-in-out
                                ${tab === itemTab
                                    ? 'bg-white text-black shadow'
                                    : 'text-gray-300 hover:bg-gray-800'
                                }`}
                        >
                            <Icon className="text-lg shrink-0" />
                            {label}
                        </div>
                    </Link>
                ))}
            </nav>

            {/* Spacer pushes logout to bottom */}
            <div className="flex-1" />

            {/* Logout */}
            <div className="px-3 pb-4 pt-3 border-t border-gray-400 mt-2">
                <div
                    className="px-3 py-2.5 cursor-pointer font-medium text-[15px] rounded-lg flex items-center gap-3 hover:bg-red-500/10 text-red-400 transition-all duration-150 ease-in-out"
                    onClick={handleLogout}
                >
                    <MdLogout className="text-lg shrink-0" />
                    Log out
                </div>
            </div>
        </div>
    )
}