export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatDateShort = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const getInitials = (name) => {
    if (!name) return '?';
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

export const getSeatsStatus = (availableSeats) => {
    if (availableSeats <= 0) return { label: 'Sold Out', className: 'sold-out' };
    if (availableSeats <= 5) return { label: `${availableSeats} left`, className: 'few' };
    return { label: `${availableSeats} available`, className: 'available' };
};