import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import EventList from '../events/EventList';
import CreateEvent from '../events/CreateEvent';
import MyRegistrations from '../registrations/MyRegistrations';

const Dashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('events');

    const isOrganizer = user?.role === 'organizer';

    const tabs = [
        { id: 'events', label: '📅 All Events', show: true },
        { id: 'myEvents', label: '📋 My Events', show: isOrganizer },
        { id: 'registrations', label: '📌 My Registrations', show: true },
        { id: 'create', label: '➕ Create Event', show: isOrganizer },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'events':
                return <EventList isOwner={false} />;
            case 'myEvents':
                return <EventList isOwner={true} />;
            case 'registrations':
                return <MyRegistrations />;
            case 'create':
                return <CreateEvent />;
            default:
                return <EventList isOwner={false} />;
        }
    };

    return (
        <div>
            <div className="tabs">
                {tabs.map(tab => (
                    tab.show && (
                        <button
                            key={tab.id}
                            className={activeTab === tab.id ? 'active' : ''}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    )
                ))}
            </div>
            {renderContent()}
        </div>
    );
};

export default Dashboard;