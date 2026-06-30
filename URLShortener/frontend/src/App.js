import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import URLShortener from './components/URLShortener';
import URLStats from './components/URLStats.js';
import { getAllUrls } from './services/api';

function App() {
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalUrls, setTotalUrls] = useState(0);

    useEffect(function() {
        fetchUrls();
    }, []);

    async function fetchUrls() {
        try {
            setLoading(true);
            const response = await getAllUrls(1, 50);
            if (response.success) {
                setUrls(response.data);
                setTotalUrls(response.pagination.total);
            }
        } catch (error) {
            toast.error('Failed to fetch URL statistics');
            console.error('Error fetching URLs:', error);
        } finally {
            setLoading(false);
        }
    }

    function handleUrlAdded() {
        fetchUrls();
    }

    function handleUrlDeleted() {
        fetchUrls();
    }

    return (
        <div className="App">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
            />
            
            <header className="App-header">
                <div className="header-content">
                    <h1>
                        <span className="icon">🔗</span> 
                        URL Shortener
                    </h1>
                    <p className="subtitle">
                        Shorten, track, and manage your links fast and with ease
                    </p>
                </div>
            </header>
            
            <main className="App-main">
                <URLShortener onUrlAdded={handleUrlAdded} />
                <URLStats 
                    urls={urls} 
                    loading={loading} 
                    totalUrls={totalUrls}
                    onUrlDeleted={handleUrlDeleted}
                />
            </main>
            
            <footer className="App-footer">
                <div className="footer-content">
                    <p>
                        Built with MERN Stack • CodeAlpha Internship Task 1
                    </p>
                    <p className="footer-links">
                        <a href="https://github.com/yourusername/CodeAlpha_URLShortener" 
                           target="_blank" 
                           rel="noopener noreferrer">
                            GitHub Repository
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;