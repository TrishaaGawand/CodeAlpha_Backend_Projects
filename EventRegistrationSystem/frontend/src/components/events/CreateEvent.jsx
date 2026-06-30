import React, { useState } from 'react';
import { eventAPI } from '../../api/api';
import Toast from '../common/Toast';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        capacity: '',
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setToast(null);

        if (!formData.title || !formData.description || !formData.date ||
            !formData.location || !formData.capacity) {
            setToast({ message: 'Please fill all fields', type: 'error' });
            setLoading(false);
            return;
        }

        if (parseInt(formData.capacity) < 1) {
            setToast({ message: 'Capacity must be at least 1', type: 'error' });
            setLoading(false);
            return;
        }

        try {
            const response = await eventAPI.create(formData);
            if (response.data.success) {
                setToast({ message: '✅ Event created successfully!', type: 'success' });
                setFormData({
                    title: '',
                    description: '',
                    date: '',
                    location: '',
                    capacity: '',
                });
            } else {
                setToast({ message: response.data.message || 'Failed to create event', type: 'error' });
            }
        } catch (error) {
            setToast({
                message: error.response?.data?.message || 'Failed to create event',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <h2>➕ Create New Event</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title <span className="required">*</span></label>
                    <input
                        type="text"
                        name="title"
                        className="form-control"
                        placeholder="Enter event title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description <span className="required">*</span></label>
                    <textarea
                        name="description"
                        className="form-control"
                        rows="3"
                        placeholder="Enter event description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Date & Time <span className="required">*</span></label>
                        <input
                            type="datetime-local"
                            name="date"
                            className="form-control"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Location <span className="required">*</span></label>
                        <input
                            type="text"
                            name="location"
                            className="form-control"
                            placeholder="Enter location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Capacity <span className="required">*</span></label>
                    <input
                        type="number"
                        name="capacity"
                        className="form-control"
                        placeholder="Maximum attendees"
                        value={formData.capacity}
                        onChange={handleChange}
                        min="1"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-success btn-block"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Event'}
                </button>
            </form>
        </div>
    );
};

export default CreateEvent;