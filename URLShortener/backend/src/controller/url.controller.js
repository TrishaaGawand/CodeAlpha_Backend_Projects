const urlModel = require('../models/url.model');
const { nanoid } = require('nanoid');

async function generateUniqueCode(length = 7) {
    let code;
    let isUnique = false;

    while (!isUnique) {
        code = nanoid(length);
        const existing = await urlModel.findOne({ shortCode: code });
        if (!existing) {
            isUnique = true;
        }
    }
    return code;
}

async function shortenUrl(req, res) {
    try {
        const { longUrl } = req.body;
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

        if (!longUrl) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a long URL'
            });
        }

        try {
            new URL(longUrl);
        } catch (_) {
            return res.status(400).json({
                success: false,
                message: 'Invalid URL format. Please include http:// or https://'
            });
        }

        const existingUrl = await urlModel.findOne({ longUrl });
        if (existingUrl) {
            return res.status(200).json({
                success: true,
                message: 'URL already shortened',
                data: {
                    id: existingUrl._id,
                    longUrl: existingUrl.longUrl,
                    shortUrl: existingUrl.shortUrl,
                    shortCode: existingUrl.shortCode,
                    clicks: existingUrl.clicks,
                    createdAt: existingUrl.createdAt
                }
            });
        }

        const shortCode = await generateUniqueCode();
        const shortUrl = `${baseUrl}/${shortCode}`;

        const newUrl = new urlModel({
            longUrl,
            shortCode,
            shortUrl
        });

        await newUrl.save();

        return res.status(201).json({
            success: true,
            message: 'URL shortened successfully',
            data: {
                id: newUrl._id,
                longUrl: newUrl.longUrl,
                shortUrl: newUrl.shortUrl,
                shortCode: newUrl.shortCode,
                clicks: newUrl.clicks,
                createdAt: newUrl.createdAt
            }
        });

    } catch (error) {
        console.error('Error in shortenUrl:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

async function redirectUrl(req, res) {
    try {
        const { shortCode } = req.params;

        const urlEntry = await urlModel.findOne({ shortCode });

        if (!urlEntry) {
            return res.status(404).json({
                success: false,
                message: 'URL not found'
            });
        }

        urlEntry.clicks += 1;
        urlEntry.lastAccessed = new Date();
        await urlEntry.save();

        return res.redirect(urlEntry.longUrl);

    } catch (error) {
        console.error('Error in redirectUrl:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

async function getAllUrls(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const urls = await urlModel.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await urlModel.countDocuments();

        return res.status(200).json({
            success: true,
            data: urls,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error in getAllUrls:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

async function getUrlStats(req, res) {
    try {
        const { shortCode } = req.params;

        const urlEntry = await urlModel.findOne({ shortCode });

        if (!urlEntry) {
            return res.status(404).json({
                success: false,
                message: 'URL not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                longUrl: urlEntry.longUrl,
                shortUrl: urlEntry.shortUrl,
                shortCode: urlEntry.shortCode,
                clicks: urlEntry.clicks,
                createdAt: urlEntry.createdAt,
                lastAccessed: urlEntry.lastAccessed
            }
        });

    } catch (error) {
        console.error('Error in getUrlStats:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

async function deleteUrl(req, res) {
    try {
        const { shortCode } = req.params;

        const urlEntry = await urlModel.findOneAndDelete({ shortCode });

        if (!urlEntry) {
            return res.status(404).json({
                success: false,
                message: 'URL not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'URL deleted successfully',
            data: urlEntry
        });

    } catch (error) {
        console.error('Error in deleteUrl:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

async function bulkShortenUrls(req, res) {
    try {
        const { urls } = req.body;
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

        if (!urls || !Array.isArray(urls) || urls.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an array of URLs'
            });
        }

        const results = [];
        const errors = [];

        for (const longUrl of urls) {
            try {
                new URL(longUrl);

                const existingUrl = await urlModel.findOne({ longUrl });
                if (existingUrl) {
                    results.push({
                        longUrl,
                        shortUrl: existingUrl.shortUrl,
                        shortCode: existingUrl.shortCode,
                        status: 'exists'
                    });
                    continue;
                }

                const shortCode = await generateUniqueCode();
                const shortUrl = `${baseUrl}/${shortCode}`;

                const newUrl = new urlModel({
                    longUrl,
                    shortCode,
                    shortUrl
                });

                await newUrl.save();

                results.push({
                    longUrl,
                    shortUrl,
                    shortCode,
                    status: 'created'
                });

            } catch (error) {
                errors.push({
                    longUrl,
                    error: error.message
                });
            }
        }

        return res.status(201).json({
            success: true,
            message: 'Bulk URL shortening completed',
            data: {
                total: urls.length,
                successful: results.length,
                failed: errors.length,
                results,
                errors: errors.length > 0 ? errors : undefined
            }
        });

    } catch (error) {
        console.error('Error in bulkShortenUrls:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

module.exports = {
    shortenUrl,
    redirectUrl,
    getAllUrls,
    getUrlStats,
    deleteUrl,
    bulkShortenUrls
};