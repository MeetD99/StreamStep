import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Container,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    LinearProgress,
    Alert,
    CircularProgress
} from '@mui/material';
import axios from 'axios';

const Dashboard = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [videosResponse, progressResponse] = await Promise.all([
                    axios.get('https://stream-step-backend.onrender.com/api/videos', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('https://stream-step-backend.onrender.com/api/progress', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                // Merge videos with progress data
                const videosWithProgress = videosResponse.data.map(video => {
                    const progress = progressResponse.data.find(p => p.videoId === video._id) || {
                        progress: 0,
                        lastWatchedTime: 0
                    };
                    return {
                        ...video,
                        progress: progress.progress,
                        lastWatchedTime: progress.lastWatchedTime
                    };
                });
                
                setVideos(videosWithProgress);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load videos. Please try again later.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        
        return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1">
                        My Videos
                    </Typography>
                    <Button variant="outlined" onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {videos.length === 0 ? (
                    <Alert severity="info">
                        No videos available. Please check back later.
                    </Alert>
                ) : (
                    <Grid container spacing={3}>
                        {videos.map((video) => (
                            <Grid item xs={12} sm={6} md={4} key={video._id}>
                                <Card sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        boxShadow: 3
                                    }
                                }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={video.thumbnail}
                                        alt={video.title}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {video.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {video.description}
                                        </Typography>
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Progress: {Math.round(video.progress)}%
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={video.progress}
                                                sx={{ mt: 1, height: 8, borderRadius: 4 }}
                                            />
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                Last watched: {formatTime(video.lastWatchedTime)} / {formatTime(video.length)}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            onClick={() => navigate(`/video/${video._id}`)}
                                            fullWidth
                                            sx={{ mb: 1 }}
                                        >
                                            {video.progress > 0 ? 'Continue Watching' : 'Start Watching'}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Container>
    );
};

export default Dashboard; 