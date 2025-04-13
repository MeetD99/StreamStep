const mongoose = require('mongoose');

const intervalSchema = new mongoose.Schema({
    start: {
        type: Number,
        required: true
    },
    end: {
        type: Number,
        required: true
    }
});

const videoProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    videoId: {
        type: String,
        required: true
    },
    watchedIntervals: [intervalSchema],
    lastWatchedTime: {
        type: Number,
        default: 0
    },
    progress: {
        type: Number,
        default: 0
    },
    videoLength: {
        type: Number,
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient querying
videoProgressSchema.index({ userId: 1, videoId: 1 }, { unique: true });

// Method to calculate total unique watched time
videoProgressSchema.methods.calculateTotalWatchedTime = function() {
    if (this.watchedIntervals.length === 0) return 0;
    
    // Sort intervals by start time
    const sortedIntervals = [...this.watchedIntervals].sort((a, b) => a.start - b.start);
    
    // Merge overlapping intervals
    const mergedIntervals = [];
    let currentInterval = sortedIntervals[0];
    
    for (let i = 1; i < sortedIntervals.length; i++) {
        const nextInterval = sortedIntervals[i];
        
        if (nextInterval.start <= currentInterval.end) {
            // Intervals overlap or are adjacent
            currentInterval.end = Math.max(currentInterval.end, nextInterval.end);
        } else {
            mergedIntervals.push(currentInterval);
            currentInterval = nextInterval;
        }
    }
    mergedIntervals.push(currentInterval);
    
    // Calculate total unique watched time
    return mergedIntervals.reduce((total, interval) => {
        return total + (interval.end - interval.start);
    }, 0);
};

// Method to update progress percentage
videoProgressSchema.methods.updateProgress = function() {
    const totalWatchedTime = this.calculateTotalWatchedTime();
    this.progress = (totalWatchedTime / this.videoLength) * 100;
    return this.progress;
};

module.exports = mongoose.model('VideoProgress', videoProgressSchema); 