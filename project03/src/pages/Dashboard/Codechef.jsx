import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    TextField,
    Box,
    Grid,
    CircularProgress,
    Container,
    Avatar,
    IconButton,
    Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const StyledCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #654321 0%, #8B4513 100%)',
    color: 'white',
    borderRadius: '16px',
    overflow: 'visible',
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    height: '90vh',
    margin: '16px',
}));

const LeftSection = styled(Box)(({ theme }) => ({
    flex: '0 0 300px',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
}));

const RightSection = styled(Box)(({ theme }) => ({
    flex: 1,
    padding: theme.spacing(2),
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-track': {
        background: 'rgba(255, 255, 255, 0.1)',
    },
    '&::-webkit-scrollbar-thumb': {
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '4px',
    },
}));

const StyledStatBox = styled(Box)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: theme.spacing(2),
    backdropFilter: 'blur(10px)',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.02)',
        background: 'rgba(255, 255, 255, 0.15)'
    }
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 120,
    height: 120,
    border: '4px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    margin: '20px 0'
}));

const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE'];

const Codechef = () => {
    const [username, setUsername] = useState('');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [ratingHistory, setRatingHistory] = useState([]);
    const [contestStats, setContestStats] = useState([]);
    const [problemStats, setProblemStats] = useState([]);
    const [submissionStats, setSubmissionStats] = useState([]);

    const fetchUserData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Mock API call for user data
            const mockUserData = {
                username,
                rating: Math.floor(Math.random() * 1000) + 1500,
                globalRank: Math.floor(Math.random() * 10000) + 1,
                countryRank: Math.floor(Math.random() * 1000) + 1,
                stars: Math.floor(Math.random() * 6) + 1,
                avatar: '/assets/default-avatar.png'
            };
            setUserData(mockUserData);

            // Generate realistic rating history data
            const currentDate = new Date();
            const mockRatingHistory = Array.from({ length: 24 }, (_, i) => {
                const date = new Date();
                date.setMonth(currentDate.getMonth() - i);
                return {
                    date: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
                    rating: Math.floor(Math.random() * 300) + mockUserData.rating - 150,
                    contests: Math.floor(Math.random() * 5) + 1
                };
            }).reverse();
            setRatingHistory(mockRatingHistory);

            // Enhanced contest statistics
            const mockContestStats = [
                { name: 'Long Challenge', value: Math.floor(Math.random() * 20) + 10, avgRating: Math.floor(Math.random() * 200) + mockUserData.rating - 100 },
                { name: 'Cook-Off', value: Math.floor(Math.random() * 15) + 8, avgRating: Math.floor(Math.random() * 200) + mockUserData.rating - 100 },
                { name: 'Lunchtime', value: Math.floor(Math.random() * 12) + 6, avgRating: Math.floor(Math.random() * 200) + mockUserData.rating - 100 },
                { name: 'Starters', value: Math.floor(Math.random() * 25) + 15, avgRating: Math.floor(Math.random() * 200) + mockUserData.rating - 100 }
            ];
            setContestStats(mockContestStats);

            // Add problem statistics
            const mockProblemStats = [
                { category: 'Beginner', solved: Math.floor(Math.random() * 50) + 30 },
                { category: 'Easy', solved: Math.floor(Math.random() * 40) + 20 },
                { category: 'Medium', solved: Math.floor(Math.random() * 30) + 10 },
                { category: 'Hard', solved: Math.floor(Math.random() * 20) + 5 },
                { category: 'Challenge', solved: Math.floor(Math.random() * 10) + 2 }
            ];
            setProblemStats(mockProblemStats);

            // Mock submission statistics
            const mockSubmissionStats = [
                { status: 'Accepted', count: Math.floor(Math.random() * 200) + 150 },
                { status: 'Wrong Answer', count: Math.floor(Math.random() * 100) + 50 },
                { status: 'Time Limit', count: Math.floor(Math.random() * 50) + 20 },
                { status: 'Compilation Error', count: Math.floor(Math.random() * 30) + 10 },
                { status: 'Runtime Error', count: Math.floor(Math.random() * 40) + 15 }
            ];
            setSubmissionStats(mockSubmissionStats);

        } catch (err) {
            setError('Failed to fetch user data');
        } finally {
            setLoading(false);
        }
    };

    const getRatingColor = (rating) => {
        if (!rating) return '#757575';
        if (rating < 1400) return '#757575';
        if (rating < 1600) return '#008000';
        if (rating < 1800) return '#03a89e';
        if (rating < 2000) return '#0000ff';
        if (rating < 2200) return '#aa00aa';
        if (rating < 2500) return '#ff8c00';
        return '#ff0000';
    };

    const getStarRating = (rating) => {
        if (!rating) return '1★';
        if (rating < 1400) return '1★';
        if (rating < 1600) return '2★';
        if (rating < 1800) return '3★';
        if (rating < 2000) return '4★';
        if (rating < 2200) return '5★';
        if (rating < 2500) return '6★';
        return '7★';
    };

    // Add a new chart for problem statistics
    const renderProblemStats = () => (
        <Grid item xs={12}>
            <StyledStatBox sx={{ height: 300 }}>
                <Typography variant="h6" align="center" gutterBottom>
                    Problem Statistics
                </Typography>
                {userData && username && <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={problemStats}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis stroke="white"dataKey="category" />
                        <YAxis stroke="white" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="solved" fill="#8884d8" name="Problems Solved">
                            {problemStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>}
            </StyledStatBox>
        </Grid>
    );

    // Add submission statistics chart
    const renderSubmissionStats = () => (
        <Grid item xs={12} md={6}>
            <StyledStatBox sx={{ height: 300 }}>
                <Typography variant="h6" align="center" gutterBottom>
                    Submission Statistics
                </Typography>
                {userData && username && <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={submissionStats}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" stroke="white" />
                        <YAxis dataKey="status" stroke="white"type="category" width={120} />
                        <Tooltip />
                        <Legend />
                        <Bar
                            dataKey="count"
                            name="Submissions"
                        >
                            {submissionStats.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.status === 'Accepted' ? '#4CAF50' :
                                        entry.status === 'Wrong Answer' ? '#f44336' :
                                            entry.status === 'Time Limit' ? '#ff9800' :
                                                entry.status === 'Compilation Error' ? '#e91e63' : '#9c27b0'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>}
            </StyledStatBox>
        </Grid>
    );


    useEffect(() => {
        if (!username.trim()) {
            setUserData(null);
            return;
        }
        fetchUserData(username).then(data => {
            setUserData(data);
        });
    }, [username]);

    return (
        <Container maxWidth="xl" sx={{ py: 2 }}>
            <StyledCard elevation={8}>
                <LeftSection>
                    {/* <CardMedia
                        component="img"
                        height="60"
                        // image="/assets/codechef.jpeg"
                        // alt="CodeChef"
                        sx={{ objectFit: 'contain', width: 'auto' }}
                    /> */}

                    <StyledAvatar
                        src={userData?.avatar || '/assets/default-avatar.png'}
                        alt="Profile"
                    />

                    <Box sx={{ width: '100%', mb: 2 }}>
                        <TextField
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter CodeChef username"
                            variant="outlined"
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: 'white' }
                                },
                                '& .MuiOutlinedInput-input': {
                                    '&::placeholder': {
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        opacity: 1
                                    }
                                }
                            }}
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        onClick={fetchUserData}
                                        disabled={loading}
                                        sx={{ color: 'white' }}
                                    >
                                        {loading ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />}
                                    </IconButton>
                                )
                            }}
                        />
                    </Box>

                    {error && (
                        <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                            {error}
                        </Typography>
                    )}

                    <Typography variant="h5" align="center" gutterBottom>
                        {'CodeChef Profile'}
                    </Typography>

                    {userData && (
                        <Typography variant="h6" align="center" gutterBottom>
                            {'Rating:' + userData !== 0?.rating || 'N/A'}
                        </Typography>
                    )}
                </LeftSection>

                <RightSection>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <StyledStatBox sx={{ height: 300 }}>
                                <Typography variant="h6" align="center" gutterBottom>
                                    Rating History
                                </Typography>
                                {userData && username && <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={ratingHistory}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" stroke="white"/>
                                        <YAxis stroke="white" />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="rating"
                                            stroke="#8884d8"
                                            strokeWidth={2}
                                            dot={{ fill: '#8884d8', stroke:'white', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>}
                            </StyledStatBox>
                        </Grid>

                        {renderSubmissionStats()}

                        <Grid item xs={12} md={6}>
                            <StyledStatBox sx={{ height: 300 }}>
                                <Typography variant="h6" align="center" gutterBottom>
                                    Contest Statistics
                                </Typography>
                                {userData && username && <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={contestStats}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" stroke="white" />
                                        <YAxis yAxisId="left" orientation="left" stroke="white" />
                                        <YAxis yAxisId="right" orientation="right" stroke="white" />
                                        <Tooltip />
                                        <Legend />
                                        <Bar yAxisId="left" dataKey="value" fill="#8884d8" name="Contests Participated" />
                                        <Bar yAxisId="right" dataKey="avgRating" fill="#82ca9d" name="Average Rating" />
                                    </BarChart>
                                </ResponsiveContainer>}
                            </StyledStatBox>
                        </Grid>

                        {renderProblemStats()}
                    </Grid>
                </RightSection>
            </StyledCard>
        </Container>
    );
};

export default Codechef;
