const express = require('express');
const router = express.Router();
const urlController = require('../controller/url.controller');
const { validateUrl, limiter } = require('../middleware/validation');

router.post('/api/shorten', limiter, validateUrl, urlController.shortenUrl);
router.post('/api/shorten/bulk', limiter, urlController.bulkShortenUrls);
router.get('/api/stats', urlController.getAllUrls);
router.get('/api/stats/:shortCode', urlController.getUrlStats);
router.delete('/api/:shortCode', urlController.deleteUrl);
router.get('/:shortCode', urlController.redirectUrl);

module.exports = router;