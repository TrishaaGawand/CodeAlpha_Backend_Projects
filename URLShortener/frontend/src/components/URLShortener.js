import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { shortenUrl } from '../services/api';

function URLShortener({ onUrlAdded }) {
    const [longUrl, setLongUrl] = useState('');
    const [shortenedData, setShortenedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        
        if (!longUrl.trim()) {
            setError('Please enter a URL');
            toast.warning('Please enter a URL');
            return;
        }

        try {
            new URL(longUrl);
        } catch (_) {
            setError('Please enter a valid URL (include http:// or https://)');
            toast.error('Invalid URL format');
            return;
        }

        setLoading(true);
        setError('');
        setShortenedData(null);

        try {
            const response = await shortenUrl(longUrl);
            
            if (response.success) {
                setShortenedData(response.data);
                toast.success('URL shortened successfully! 🎉');
                setLongUrl('');
                onUrlAdded();
            } else {
                toast.error(response.message || 'Failed to shorten URL');
            }
        } catch (error) {
            const errorMessage = error.error || 'Failed to shorten URL. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    async function handleCopy(text) {
        try {
            await navigator.clipboard.writeText(text);
            toast.success('URL copied to clipboard! 📋');
        } catch (err) {
            toast.error('Failed to copy URL');
        }
    }

    function handleOpenInNewTab(url) {
        window.open(url, '_blank');
    }

    return (
        <div className="url-shortener-container">
            <h2>
                <span className="icon">✂️</span> 
                Shorten a URL
            </h2>
            
            <form onSubmit={handleSubmit} className="url-form">
                <div className="input-group">
                    <input
                        type="text"
                        value={longUrl}
                        onChange={function(e) {
                            setLongUrl(e.target.value);
                            setError('');
                        }}
                        placeholder="Enter your long URL here..."
                        className={'url-input ' + (error ? 'error' : '')}
                        disabled={loading}
                    />
                    <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Shortening...
                            </>
                        ) : (
                            'Shorten URL'
                        )}
                    </button>
                </div>
                {error && <div className="error-message">{error}</div>}
            </form>

            {shortenedData && (
                <div className="result-container">
                    <div className="result-card">
                        <div className="result-header">
                            <span className="badge success">✅ Success</span>
                            <span className="clicks-info">
                                👆 {shortenedData.clicks || 0} clicks
                            </span>
                        </div>
                        
                        <div className="result-item">
                            <label>Original URL:</label>
                            <div className="url-display long-url">
                                <span className="url-text">{shortenedData.longUrl}</span>
                            </div>
                        </div>
                        
                        <div className="result-item">
                            <label>Shortened URL:</label>
                            <div className="url-display short-url">
                                <a 
                                    href={shortenedData.shortUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="short-link"
                                >
                                    {shortenedData.shortUrl}
                                </a>
                                <div className="action-buttons">
                                    <button 
                                        onClick={function() { handleCopy(shortenedData.shortUrl); }}
                                        className="action-btn copy-btn"
                                        title="Copy URL"
                                    >
                                        📋 Copy
                                    </button>
                                    <button 
                                        onClick={function() { handleOpenInNewTab(shortenedData.shortUrl); }}
                                        className="action-btn open-btn"
                                        title="Open in new tab"
                                    >
                                        🔗 Open
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="result-meta">
                            <span className="meta-item">
                                🆔 Code: {shortenedData.shortCode}
                            </span>
                            <span className="meta-item">
                                📅 Created: {new Date(shortenedData.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default URLShortener;