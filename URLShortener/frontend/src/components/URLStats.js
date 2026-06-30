import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { deleteUrl } from '../services/api';

function URLStats({ urls, loading, totalUrls, onUrlDeleted }) {
    const [deleting, setDeleting] = useState(null);

    async function handleDelete(shortCode) {
        if (!window.confirm('Are you sure you want to delete this URL?')) {
            return;
        }

        try {
            setDeleting(shortCode);
            await deleteUrl(shortCode);
            toast.success('URL deleted successfully');
            onUrlDeleted();
        } catch (error) {
            toast.error('Failed to delete URL');
        } finally {
            setDeleting(null);
        }
    }

    function formatDate(date) {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    if (loading) {
        return (
            <div className="stats-container">
                <h3>📊 URL Statistics</h3>
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading statistics...</p>
                </div>
            </div>
        );
    }

    if (!urls || urls.length === 0) {
        return (
            <div className="stats-container">
                <h3>📊 URL Statistics</h3>
                <div className="empty-state">
                    <div className="empty-icon">🔗</div>
                    <p>No URLs shortened yet</p>
                    <p className="empty-subtext">
                        Start by shortening your first URL above!
                    </p>
                </div>
            </div>
        );
    }

    const totalClicks = urls.reduce(function(sum, url) {
        return sum + url.clicks;
    }, 0);

    return (
        <div className="stats-container">
            <div className="stats-header">
                <h3>📊 URL Statistics</h3>
                <div className="stats-badge">
                    {totalUrls || urls.length} URLs
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-content">
                        <span className="stat-label">Total URLs</span>
                        <span className="stat-value">{totalUrls || urls.length}</span>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon">👆</div>
                    <div className="stat-content">
                        <span className="stat-label">Total Clicks</span>
                        <span className="stat-value">{totalClicks}</span>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon">📈</div>
                    <div className="stat-content">
                        <span className="stat-label">Average Clicks</span>
                        <span className="stat-value">
                            {urls.length > 0 ? (totalClicks / urls.length).toFixed(1) : 0}
                        </span>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon">⚡</div>
                    <div className="stat-content">
                        <span className="stat-label">Most Popular</span>
                        <span className="stat-value">
                            {urls.length > 0 ? Math.max.apply(null, urls.map(function(u) { return u.clicks; })) : 0}
                        </span>
                    </div>
                </div>
            </div>

            <div className="url-list">
                <h4>Recent URLs</h4>
                <div className="url-table">
                    <div className="url-table-header">
                        <span className="col-url">Short URL</span>
                        <span className="col-long">Original URL</span>
                        <span className="col-clicks">Clicks</span>
                        <span className="col-date">Created</span>
                        <span className="col-actions">Actions</span>
                    </div>
                    {urls.slice(0, 20).map(function(url, index) {
                        return (
                            <div key={index} className="url-table-row">
                                <span className="col-url">
                                    <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">
                                        {url.shortCode}
                                    </a>
                                </span>
                                <span className="col-long" title={url.longUrl}>
                                    {url.longUrl.length > 50 ? 
                                        url.longUrl.substring(0, 50) + '...' : 
                                        url.longUrl}
                                </span>
                                <span className="col-clicks">
                                    <span className="click-badge">
                                        {url.clicks}
                                    </span>
                                </span>
                                <span className="col-date">
                                    {formatDate(url.createdAt)}
                                </span>
                                <span className="col-actions">
                                    <button
                                        onClick={function() { handleDelete(url.shortCode); }}
                                        className="delete-btn"
                                        disabled={deleting === url.shortCode}
                                        title="Delete URL"
                                    >
                                        {deleting === url.shortCode ? '...' : '🗑️'}
                                    </button>
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default URLStats;