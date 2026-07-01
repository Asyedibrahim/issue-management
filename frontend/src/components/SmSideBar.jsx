import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { MdCategory, MdClose, MdDashboard, MdLogout, MdPerson, MdSyncProblem } from "react-icons/md";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { signOutSuccess } from "../redux/user/userSlice";

export default function SmSideBar() {

    const { currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const [tab, setTab] = useState('');
    const sidebarRef = useRef(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    // Close sidebar when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

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
        <div className="text-sm sm:text-base shadow py-1 relative bg-gray-100">
            {/* Top bar */}
            <div className="flex items-center justify-between px-3 my-4">
                <h1 className="font-cinzel text-xl font-serif font-extrabold text-gray-900">
                    Issue Management System
                </h1>

                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2.5 bg-black text-white rounded-lg shadow-sm active:scale-95 transition-transform"
                    aria-label="Open menu"
                >
                    <FaBars size={18} />
                </button>
            </div>

            {/* Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] lg:hidden"
                        onClick={() => setIsOpen(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.aside
                            ref={sidebarRef}
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed top-0 right-0 w-72 max-w-[85vw] h-full bg-gray-900 text-gray-200 shadow-xl z-50 flex flex-col lg:hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-5 py-5 border-b border-gray-400">
                                <h2 className="font-cinzel text-xl font-serif font-extrabold text-white">
                                    Menu
                                </h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 rounded-md text-white hover:bg-gray-200 hover:text-gray-800 transition-colors"
                                    aria-label="Close menu"
                                >
                                    <MdClose size={22} />
                                </button>
                            </div>

                            {/* User info card */}
                            <div className="mx-4 mt-4 px-3 py-3 bg-gray-800 rounded-lg shadow-sm flex items-center gap-3">
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
                            <nav className="flex flex-col gap-2 px-4 mt-4">
                                {filteredNavItems.map(({ to, tab: itemTab, label, icon: Icon }) => (
                                    <Link key={itemTab} to={to} onClick={() => setIsOpen(false)}>
                                        <div
                                            className={`px-3 py-2.5 flex items-center rounded-lg gap-3 cursor-pointer font-medium text-[15px] transition-all duration-150 ease-in-out
                                                ${tab === itemTab
                                                    ? 'bg-white text-black shadow-sm'
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
                            <div className="px-4 pb-5 pt-3 border-t border-gray-400 mt-2">
                                <div
                                    className="px-3 py-2.5 cursor-pointer font-medium text-[15px] rounded-lg flex items-center gap-3 hover:bg-red-500/10 text-red-400 transition-all duration-150 ease-in-out"
                                    onClick={() => { setIsOpen(false); handleLogout(); }}
                                >
                                    <MdLogout className="text-lg shrink-0" />
                                    Log out
                                </div>
                            </div>
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}