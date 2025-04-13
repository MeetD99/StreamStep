const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Video = require('../models/Video');

// Get all videos
router.get('/', auth, async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 });
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching videos', error: error.message });
    }
});

// Get a specific video
router.get('/:videoId', auth, async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        res.json(video);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching video', error: error.message });
    }
});

module.exports = router; 