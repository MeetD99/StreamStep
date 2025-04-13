import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Container,
    Button,
    LinearProgress,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActions
} from '@mui/material';
import axios from 'axios';

const Dashboard = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [videosResponse, progressResponse] = await Promise.all([
                    axios.get('https://stream-step-hzsn.vercel.app/api/videos', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('https://stream-step-hzsn.vercel.app/api/progress', {
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

                {loading ? (
                    <Typography>Loading...</Typography>
                ) : (
                    <Grid container spacing={3}>
                        {videos.map((video) => (
                            <Grid item xs={12} sm={6} md={4} key={video._id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={video.thumbnail}
                                        alt={video.title}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {video.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
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