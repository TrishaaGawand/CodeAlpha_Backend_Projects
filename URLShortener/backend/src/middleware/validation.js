const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

function validateUrl(req, res, next) {
    const { longUrl } = req.body;
    
    if (!longUrl) {
        return res.status(400).json({
            success: false,
            message: 'URL is required',
            error: 'Please provide a long URL to shorten'
        });
    }

    try {
        const url = new URL(longUrl);
        if (!['http:', 'https:'].includes(url.protocol)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid URL protocol',
                error: 'Only HTTP and HTTPS URLs are allowed'
            });
        }
        req.validatedUrl = longUrl;
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Invalid URL format',
            error: 'Please provide a valid URL with http:// or https://'
        });
    }
}

module.exports = { limiter, validateUrl };