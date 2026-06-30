const app = require('./src/app');
const connectDB = require('./src/config/db');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

const server = app.listen(PORT, function() {
    console.log('='.repeat(60));
    console.log('URL SHORTENER API');
    console.log('='.repeat(60));
    console.log(`Server running on: http://localhost:${PORT}`);
    console.log(`Base URL: ${process.env.BASE_URL || 'http://localhost:5000'}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('='.repeat(60));
    console.log('Server is ready to accept requests');
});

process.on('unhandledRejection', function(err) {
    console.error('Unhandled Rejection:', err);
    console.log('Shutting down server...');
    server.close(function() {
        process.exit(1);
    });
});

module.exports = server;