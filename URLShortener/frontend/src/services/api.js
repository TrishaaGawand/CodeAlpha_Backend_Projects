import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    function(config) {
        console.log('📤 ' + config.method.toUpperCase() + ' ' + config.url);
        return config;
    },
    function(error) {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    function(response) {
        console.log('📥 ' + response.status + ' ' + response.config.url);
        return response;
    },
    function(error) {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

async function shortenUrl(longUrl) {
    try {
        const response = await api.post('/api/shorten', { longUrl });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

async function getAllUrls(page = 1, limit = 20) {
    try {
        const response = await api.get('/api/stats', { 
            params: { page, limit } 
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

async function getUrlStats(shortCode) {
    try {
        const response = await api.get('/api/stats/' + shortCode);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

async function deleteUrl(shortCode) {
    try {
        const response = await api.delete('/api/' + shortCode);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export {
    shortenUrl,
    getAllUrls,
    getUrlStats,
    deleteUrl
};

export default api;