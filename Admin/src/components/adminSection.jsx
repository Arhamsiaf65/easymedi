import React, { useState, useEffect } from 'react';
import ManagePatients from './deleteAppointments';
import Form from './addAppointment';
import Analytics from './analytics';
import Appointments from './appointments';
import ManageDoctors from './manageDoctors';
import { FaBars, FaTimes } from 'react-icons/fa'; // Icon for the toggle button
import DashBoard from './dashBoard';

function AdminSection() {
    const [activeTab, setActiveTab] = useState('dashboard'); // Active section state
    const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar toggle state

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    };

    // Lock body scroll when sidebar is open on mobile
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto'; // Cleanup on component unmount
        };
    }, [sidebarOpen]);

    return (
        <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
            {/* Sidebar */}
            <aside className={`lg:w-64 w-full h-screen bg-gray-900 text-white flex flex-col fixed top-0 bottom-0 lg:left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform ease-in-out duration-300 z-50`}>
                <div className="p-4 text-center text-xl font-bold border-b border-gray-700">
                    Admin Panel
                </div>

                {/* Horizontal separator (--- bar) */}
                <div className="border-b border-gray-600 my-2"></div> {/* This adds the separator bar */}

                <nav className="flex-1 p-4">
                    <ul className="space-y-4">
                        <li
                            className={`cursor-pointer p-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
                            onClick={() => handleTabChange('dashboard')}
                        >
                            Dashboard
                        </li>
                        <li
                            className={`cursor-pointer p-2 rounded-lg ${activeTab === 'doctors' ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
                            onClick={() => handleTabChange('doctors')}
                        >
                            Manage Doctors
                        </li>
                        <li
                            className={`cursor-pointer p-2 rounded-lg ${activeTab === 'appointments' ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
                            onClick={() => handleTabChange('appointments')}
                        >
                            Appointments
                        </li>
                        <li
                            className={`cursor-pointer p-2 rounded-lg ${activeTab === 'add appointments' ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
                            onClick={() => handleTabChange('add appointments')}
                        >
                            Add Appointments
                        </li>
                        <li
                            className={`cursor-pointer p-2 rounded-lg ${activeTab === 'patients' ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
                            onClick={() => handleTabChange('patients')}
                        >
                            Delete Appointments
                        </li>
                        <li
                            className={`cursor-pointer p-2 rounded-lg ${activeTab === 'reports' ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
                            onClick={() => handleTabChange('reports')}
                        >
                            Reports and Analytics
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden fixed top-4 right-4 z-10">
                <button
                    className="text-white p-3 rounded-full bg-gray-800 hover:bg-gray-600"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            <main className={`flex-1 ml-0 lg:ml-64 p-6 overflow-x-hidden ${sidebarOpen ? 'lg:ml-64' : ''}`}>
                <div className="bg-white p-6 shadow-md rounded-lg">
                    {activeTab === 'dashboard' && (
                        <div>
                            <DashBoard />
                        </div>
                    )}
                    {activeTab === 'doctors' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Manage Doctors</h2>
                            <ManageDoctors />
                        </div>
                    )}
                    {activeTab === 'appointments' && (
                        <div>
                            <Appointments />
                        </div>
                    )}
                    {activeTab === 'add appointments' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Add Appointments</h2>
                            <ul>
                                <Form />
                            </ul>
                        </div>
                    )}
                    {activeTab === 'patients' && (
                        <div>
                            <ManagePatients />
                        </div>
                    )}
                    {activeTab === 'reports' && (
                        <div>
                            <Analytics />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default AdminSection;
