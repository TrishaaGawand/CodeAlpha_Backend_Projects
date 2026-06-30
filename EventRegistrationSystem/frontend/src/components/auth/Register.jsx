import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Toast from '../common/Toast';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'attendee',
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const { register } = useAuth();
    const navigate = useNavigate();

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

        if (formData.password.length < 6) {
            setToast({ message: 'Password must be at least 6 characters', type: 'error' });
            setLoading(false);
            return;
        }

        const result = await register(formData);

        if (result.success) {
            setToast({ message: 'Registration successful! Please login 🎉', type: 'success' });
            setFormData({ name: '', email: '', password: '', role: 'attendee' });
            setTimeout(() => navigate('/login'), 1000);
        } else {
            setToast({ message: result.message || 'Registration failed', type: 'error' });
        }

        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="card auth-card">
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
                <div className="logo">
                    <h1>🎫 <span>Event</span>Registration</h1>
                    <p>Create your account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name <span className="required">*</span></label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address <span className="required">*</span></label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password <span className="required">*</span></label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Enter password (min 6 chars)"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="form-group">
                        <label>Role <span className="required">*</span></label>
                        <select
                            name="role"
                            className="form-control"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="attendee">Attendee</option>
                            <option value="organizer">Organizer</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-success btn-block btn-lg"
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-switch">
                    Already have an account? <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;