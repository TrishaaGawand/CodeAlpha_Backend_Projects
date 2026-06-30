import React from 'react';
import { formatDateShort } from '../../utils/helpers';

const EventCard = ({ event, isOwner, onRegister, onEdit, onDelete }) => {
    const { _id, title, description, date, location, availableSeats, organizer } = event;

    const getSeatsStatus = () => {
        if (availableSeats <= 0) return { label: 'Sold Out', className: 'sold-out' };
        if (availableSeats <= 5) return { label: `${availableSeats} left`, className: 'few' };
        return { label: `${availableSeats} available`, className: 'available' };
    };

    const seats = getSeatsStatus();
    const organizerName = organizer?.name || 'Unknown';

    return (
        <div className="event-card">
            <h3>{title}</h3>
            <p className="description">{description}</p>
            <div className="meta">
                <span>📅 {formatDateShort(date)}</span>
                <span>📍 {location}</span>
                <span>👤 Organizer: {organizerName}</span>
            </div>
            <div className="footer">
                <span className={`seats ${seats.className}`}>
                    {seats.label}
                </span>
                <div className="actions">
                    {isOwner ? (
                        <>
                            <button
                                className="btn btn-warning btn-sm"
                                onClick={() => onEdit(_id)}
                            >
                                ✏️ Edit
                            </button>
                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => onDelete(_id)}
                            >
                                🗑️ Delete
                            </button>
                        </>
                    ) : (
                        availableSeats > 0 && (
                            <button
                                className="btn btn-success btn-sm"
                                onClick={() => onRegister(_id)}
                            >
                                ✅ Register
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventCard;