import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="brand">
                <span style={{ fontSize: '24px' }}>🎫</span>
                <h1><span>Event</span>Registration</h1>
            </Link>

            <div className="nav-right">
                {user ? (
                    <>
                        <div className="user-badge">
                            <div className="avatar">{getInitials(user.name)}</div>
                            <span className="name">{user.name}</span>
                            <span className="role">{user.role}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="btn btn-danger btn-sm"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            <button className="btn btn-primary btn-sm">Login</button>
                        </Link>
                        <Link to="/register">
                            <button className="btn btn-success btn-sm">Register</button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;