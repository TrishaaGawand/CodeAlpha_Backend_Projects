import React, { useState, useEffect } from 'react';
import { eventAPI, registrationAPI } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import EventCard from './EventCard';
import LoadingSpinner from '../common/LoadingSpinner';
import Toast from '../common/Toast';

const EventList = ({ isOwner = false }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await eventAPI.getAll();
            if (response.data.success) {
                let allEvents = response.data.events || [];
                
                // ✅ CORRECT: Only filter if isOwner is true
                if (isOwner && user) {
                    // ✅ This ONLY runs for "My Events" tab
                    allEvents = allEvents.filter(e => e.organizer?._id === user.id);
                }
                // ✅ For "All Events" tab, isOwner is false, so NO filtering
                
                setEvents(allEvents);
            }
        } catch (error) {
            setToast({ 
                message: error.response?.data?.message || 'Failed to load events', 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (eventId) => {
        if (!user) {
            setToast({ message: 'Please login first', type: 'error' });
            return;
        }

        try {
            const response = await registrationAPI.register(eventId);
            if (response.data.success) {
                setToast({ message: '✅ Registered successfully!', type: 'success' });
                fetchEvents();
            } else {
                setToast({ message: response.data.message || 'Registration failed', type: 'error' });
            }
        } catch (error) {
            setToast({ 
                message: error.response?.data?.message || 'Registration failed', 
                type: 'error' 
            });
        }
    };

    const handleDelete = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;

        try {
            const response = await eventAPI.delete(eventId);
            if (response.data.success) {
                setToast({ message: '✅ Event deleted successfully', type: 'success' });
                fetchEvents();
            } else {
                setToast({ 
                    message: response.data.message || 'Failed to delete event', 
                    type: 'error' 
                });
            }
        } catch (error) {
            setToast({ 
                message: error.response?.data?.message || 'Failed to delete event', 
                type: 'error' 
            });
        }
    };

    const handleEdit = (eventId) => {
        setToast({ message: 'Edit feature coming soon!', type: 'info' });
    };

    if (loading) {
        return <LoadingSpinner message="Loading events..." />;
    }

    if (events.length === 0) {
        return (
            <div className="empty-state">
                <div className="icon">📭</div>
                <h3>No events found</h3>
                <p>
                    {isOwner 
                        ? 'You haven\'t created any events yet. Click "Create Event" to get started!' 
                        : 'Check back later for new events.'}
                </p>
            </div>
        );
    }

    return (
        <div>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="events-grid">
                {events.map(event => (
                    <EventCard
                        key={event._id}
                        event={event}
                        isOwner={isOwner && event.organizer?._id === user?.id}
                        onRegister={handleRegister}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default EventList;