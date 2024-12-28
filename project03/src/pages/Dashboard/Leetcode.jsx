import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';

import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    TextField,
    Box,
    CircularProgress,
    Container,
    Avatar,
    IconButton,
    Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import CodeIcon from '@mui/icons-material/Code';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StyledCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
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

const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

const Leetcode = () => {
    const [username, setUsername] = useState('');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submissionHistory, setSubmissionHistory] = useState([]);

    useEffect(() => {
        if (!username.trim()) {
            setUserData(null);
            return;
        }
        fetchUserData(username).then(data => {
            setUserData(data);
        });
    }, [username]);

    const fetchUserData = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`https://leetcode-stats-api.herokuapp.com/${username}`);
            if (response.data) {
                console.log("leetcode" + response)
                setUserData(response.data);
                const mockHistory = Array.from({ length: 12 }, (_, i) => ({
                    month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
                    submissions: Math.floor(Math.random() * 50) + 10
                }));
                setSubmissionHistory(mockHistory);
            } else {
                throw new Error('User not found');
            }
        } catch (err) {
            setError('Error fetching user data. Please check the username and try again.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }

    };

    const getRankColor = (totalSolved) => {
        if (!totalSolved) return '#757575';
        if (totalSolved < 50) return '#757575';
        if (totalSolved < 100) return '#008000';
        if (totalSolved < 200) return '#03a89e';
        if (totalSolved < 500) return '#0000ff';
        return '#aa00aa';
    };

    const getRank = (totalSolved) => {
        if (!totalSolved) return 'Beginner';
        if (totalSolved < 50) return 'Beginner';
        if (totalSolved < 100) return 'Intermediate';
        if (totalSolved < 200) return 'Advanced';
        if (totalSolved < 500) return 'Expert';
        return 'Master';
    };

    const getProblemData = () => {
        if (!userData) return [];
        return [
            { name: 'Easy', value: userData.easySolved || 0 },
            { name: 'Medium', value: userData.mediumSolved || 0 },
            { name: 'Hard', value: userData.hardSolved || 0 }
        ];
    };

    return (
        <Container maxWidth="xl" sx={{ py: 2 }}>
            <StyledCard elevation={8}>
                <LeftSection>
                    <StyledAvatar
                        src={userData?.avatar || '/assets/default-avatar.png'}
                        alt="Profile"
                    />

                    <Box sx={{ width: '100%', mb: 2 }}>
                        <TextField
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter LeetCode username"
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
                        {'LeetCode Profile'}
                    </Typography>

                    {userData && username && (
                        <Typography
                            variant="h6"
                            align="center"
                            sx={{ color: getRankColor(userData.totalSolved), mb: 2 }}
                        >
                            {getRank(userData?.totalSolved)}
                        </Typography>
                    )}
                </LeftSection>

                <RightSection>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <StyledStatBox>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <AssignmentTurnedInIcon sx={{ mr: 1 }} />
                                    <Typography variant="h6">Problems Solved</Typography>
                                </Box>
                                <Typography variant="body1">
                                    Total Problem Solved: {userData?.totalSolved || 'N/A'}
                                </Typography>
                                <Typography variant="body1" color="success.light">
                                    Easy: {userData?.easySolved || 'N/A'}
                                </Typography>
                                <Typography variant="body1" color="warning.light">
                                    Medium: {userData?.mediumSolved || 'N/A'}
                                </Typography>
                                <Typography variant="body1" color="error.light">
                                    Hard: {userData?.hardSolved || 'N/A'}
                                </Typography>
                            </StyledStatBox>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <StyledStatBox>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <WorkspacePremiumIcon sx={{ mr: 1 }} />
                                    <Typography variant="h6">Contest Rating</Typography>
                                </Box>
                                <Typography variant="body1">
                                    Rating: {userData?.contestRating || 'N/A'}
                                </Typography>
                                <Typography variant="body1">
                                    Global Rank: {userData?.globalRank || 'N/A'}
                                </Typography>
                            </StyledStatBox>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <StyledStatBox sx={{ height: 300 }}>
                                <Typography variant="h6" align="center" gutterBottom>
                                    Problem Distribution
                                </Typography>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        { userData &&username &&  <Pie
                                            data={getProblemData()}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {getProblemData().map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>}

                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </StyledStatBox>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <StyledStatBox sx={{ height: 300 }}>
                                <Typography variant="h6" align="center" color="white" gutterBottom>
                                    Submission History
                                </Typography>
                                {userData && username &&
                                <ResponsiveContainer width="100%" height="100%">
                                     <LineChart
                                        data={submissionHistory}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis stroke="white" dataKey="month" />
                                        <YAxis stroke="white"/>
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="submissions" stroke="green" />
                                    </LineChart>
                                </ResponsiveContainer> }
                            </StyledStatBox>
                        </Grid>
                    </Grid>
                </RightSection>
            </StyledCard>
        </Container>
    );
};

export default Leetcode;
