import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Container,
    Button,
    Paper,
    Card,
    CardMedia,
    CardContent
} from '@mui/material';
import VideoPlayer from './VideoPlayer';
import axios from 'axios';

const VideoPage = () => {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const [videoData, setVideoData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`http://localhost:5000/api/videos/${videoId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!response.data) {
                    setError('Video not found');
                    return;
                }

                setVideoData(response.data);
            } catch (error) {
                console.error('Error fetching video data:', error);
                setError('Error loading video');
            }
        };

        fetchVideoData();
    }, [videoId, navigate]);

    if (error) {
        return (
            <Container>
                <Paper sx={{ p: 3, mt: 4, textAlign: 'center' }}>
                    <Typography color="error">{error}</Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/dashboard')}
                        sx={{ mt: 2 }}
                    >
                        Back to Dashboard
                    </Button>
                </Paper>
            </Container>
        );
    }

    if (!videoData) {
        return (
            <Container>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/dashboard')}
                    sx={{ mb: 2 }}
                >
                    Back to Dashboard
                </Button>
                
                <Card sx={{ mb: 4 }}>
                    <CardMedia
                        component="img"
                        height="300"
                        image={videoData.thumbnail}
                        alt={videoData.title}
                    />
                    <CardContent>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {videoData.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            {videoData.description}
                        </Typography>
                    </CardContent>
                </Card>

                <VideoPlayer
                    videoId={videoId}
                    videoUrl={videoData.url}
                    videoLength={videoData.length}
                />
            </Box>
        </Container>
    );
};

export default VideoPage; 