import React, { useState, useEffect } from 'react';
import { registrationAPI } from '../../api/api';
import LoadingSpinner from '../common/LoadingSpinner';
import Toast from '../common/Toast';
import { formatDateShort } from '../../utils/helpers';

const MyRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [cancelled, setCancelled] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const response = await registrationAPI.getMyRegistrations();
            if (response.data.success) {
                setRegistrations(response.data.registrations || []);
                setCancelled(response.data.cancelled || []);
            }
        } catch (error) {
            setToast({ message: 'Failed to load registrations', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (registrationId) => {
        if (!window.confirm('Are you sure you want to cancel this registration?')) return;

        try {
            const response = await registrationAPI.cancel(registrationId);
            if (response.data.success) {
                setToast({ message: '✅ Registration cancelled', type: 'success' });
                fetchRegistrations();
            } else {
                setToast({ message: response.data.message || 'Failed to cancel', type: 'error' });
            }
        } catch (error) {
            setToast({
                message: error.response?.data?.message || 'Failed to cancel',
                type: 'error'
            });
        }
    };

    if (loading) return <LoadingSpinner message="Loading registrations..." />;

    if (registrations.length === 0 && cancelled.length === 0) {
        return (
            <div className="empty-state">
                <div className="icon">📌</div>
                <h3>No registrations</h3>
                <p>You haven't registered for any events yet.</p>
            </div>
        );
    }

    return (
        <div className="card">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <h2>📌 My Registrations</h2>

            {registrations.length > 0 && (
                <div className="registration-list">
                    {registrations.map(reg => (
                        <div key={reg._id} className="registration-item">
                            <div className="info">
                                <h4>{reg.event?.title || 'Unknown Event'}</h4>
                                <p>
                                    📅 {reg.event ? formatDateShort(reg.event.date) : 'N/A'}
                                    {' | '}📍 {reg.event?.location || 'N/A'}
                                </p>
                                <span className="badge active">✅ Active</span>
                            </div>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleCancel(reg._id)}
                            >
                                Cancel
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {cancelled.length > 0 && (
                <>
                    <h3 style={{ marginTop: '24px', color: '#718096', fontSize: '16px' }}>
                        Cancelled Registrations
                    </h3>
                    <div className="registration-list">
                        {cancelled.map(reg => (
                            <div key={reg._id} className="registration-item">
                                <div className="info">
                                    <h4>{reg.event?.title || 'Unknown Event'}</h4>
                                    <p>
                                        📅 {reg.event ? formatDateShort(reg.event.date) : 'N/A'}
                                        {' | '}📍 {reg.event?.location || 'N/A'}
                                    </p>
                                    <span className="badge cancelled">❌ Cancelled</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default MyRegistrations;