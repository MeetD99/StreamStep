import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Box, LinearProgress, Typography } from '@mui/material';
import axios from 'axios';

const VideoPlayer = ({ videoId, videoUrl, videoLength }) => {
    const [progress, setProgress] = useState(0);
    const [watchedIntervals, setWatchedIntervals] = useState([]);
    const [currentInterval, setCurrentInterval] = useState({ start: 0, end: 0 });
    const [isPlaying, setIsPlaying] = useState(false);
    const [lastUnwatchedPosition, setLastUnwatchedPosition] = useState(0);
    const playerRef = useRef(null);

    useEffect(() => {
        const loadProgress = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`https://stream-step-backend.onrender.com/api/progress/${videoId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProgress(response.data.progress);
                setWatchedIntervals(response.data.watchedIntervals);
                
                const sortedIntervals = [...response.data.watchedIntervals].sort((a, b) => a.start - b.start);
                let lastUnwatched = 0;
                
                for (let i = 0; i < sortedIntervals.length; i++) {
                    if (sortedIntervals[i].start > lastUnwatched) {
                        break;
                    }
                    lastUnwatched = Math.max(lastUnwatched, sortedIntervals[i].end);
                }
                
                setLastUnwatchedPosition(lastUnwatched);
            } catch (error) {
                console.error('Error loading progress:', error);
            }
        };

        loadProgress();
    }, [videoId]);

    const handleProgress = (state) => {
        if (isPlaying) {
            setCurrentInterval(prev => ({
                start: prev.start,
                end: state.playedSeconds
            }));
        }
    };

    const handlePlay = () => {
        setIsPlaying(true);
        const currentTime = playerRef.current.getCurrentTime();
        setCurrentInterval({ start: currentTime, end: currentTime });
    };

    const handlePause = async () => {
        setIsPlaying(false);
        
        if (currentInterval.start !== currentInterval.end) {
            try {
                const token = localStorage.getItem('token');
                await axios.post(
                    `https://stream-step-backend.onrender.com/api/progress/${videoId}`,
                    {
                        startTime: currentInterval.start,
                        endTime: currentInterval.end,
                        videoLength
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
            } catch (error) {
                console.error('Error saving progress:', error);
            }
        }
    };

    return (
        <Box sx={{ 
            width: '100%', 
            maxWidth: '1200px', 
            mx: 'auto', 
            p: 2,
            '& .react-player': {
                width: '100% !important',
                height: 'auto !important',
                aspectRatio: '16/9'
            }
        }}>
            <Box sx={{
                position: 'relative',
                paddingTop: '56.25%',
                width: '100%'
            }}>
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                }}>
                    <ReactPlayer
                        ref={playerRef}
                        url={videoUrl}
                        width="100%"
                        height="100%"
                        controls
                        onProgress={handleProgress}
                        onPlay={handlePlay}
                        onPause={handlePause}
                        playing={false}
                        config={{
                            youtube: {
                                playerVars: {
                                    start: Math.floor(lastUnwatchedPosition),
                                    autoplay: 0
                                }
                            }
                        }}
                    />
                </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {Math.round(progress)}% watched
                </Typography>
            </Box>
        </Box>
    );
};

export default VideoPlayer; 