const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const VideoProgress = require('../models/VideoProgress');

// Get progress for a specific video
router.get('/:videoId', auth, async (req, res) => {
    try {
        const progress = await VideoProgress.findOne({
            userId: req.user._id,
            videoId: req.params.videoId
        });

        if (!progress) {
            return res.status(404).json({ message: 'No progress found for this video' });
        }

        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching progress', error: error.message });
    }
});

// Update video progress
router.post('/:videoId', auth, async (req, res) => {
    try {
        const { startTime, endTime, videoLength } = req.body;
        
        let progress = await VideoProgress.findOne({
            userId: req.user._id,
            videoId: req.params.videoId
        });

        if (!progress) {
            // Create new progress entry
            progress = new VideoProgress({
                userId: req.user._id,
                videoId: req.params.videoId,
                videoLength,
                watchedIntervals: [{ start: startTime, end: endTime }],
                lastWatchedTime: endTime
            });
        } else {
            // Add new interval to existing progress
            progress.watchedIntervals.push({ start: startTime, end: endTime });
            progress.lastWatchedTime = endTime;
        }

        // Update progress percentage
        progress.updateProgress();
        await progress.save();

        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Error updating progress', error: error.message });
    }
});

// Get all progress for user
router.get('/', auth, async (req, res) => {
    try {
        const progress = await VideoProgress.find({ userId: req.user._id });
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching progress', error: error.message });
    }
});

module.exports = router; 