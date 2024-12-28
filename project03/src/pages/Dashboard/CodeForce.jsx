import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tooltip as ReactTooltip } from 'react-tooltip';

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
import TimelineIcon from '@mui/icons-material/Timeline';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { LineChart, Line, BarChart, Bar, CartesianGrid, Tooltip, Legend, ResponsiveContainer, XAxis, YAxis, Cell } from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

const StyledCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
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

const StyledCalendarHeatmap = styled(CalendarHeatmap)(({ theme }) => ({
    '.react-calendar-heatmap text': {
        fill: '#fff',
        fontSize: '0.8em',
    },
    '.react-calendar-heatmap .color-empty': {
        fill: 'rgba(255, 255, 255, 0.1)',
    },
    '.react-calendar-heatmap .color-scale-1': {
        fill: '#4fc3f7',
    },
    '.react-calendar-heatmap .color-scale-2': {
        fill: '#29b6f6',
    },
    '.react-calendar-heatmap .color-scale-3': {
        fill: '#03a9f4',
    },
    '.react-calendar-heatmap .color-scale-4': {
        fill: '#039be5',
    },
}));

const Codeforces = () => {
    const [username, setUsername] = useState('');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [ratingHistory, setRatingHistory] = useState([]);
    const [submissionData, setSubmissionData] = useState([]);
    const [contestData, setContestData] = useState(null);

    const fetchUserData = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const userResponse = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
            const ratingResponse = await axios.get(`https://codeforces.com/api/user.rating?handle=${username}`);
            const submissionResponse = await axios.get(`https://codeforces.com/api/user.status?handle=${username}`);

            if (userResponse.data.status === 'OK') {
                setUserData(userResponse.data.result[0]);
            }

            if (ratingResponse.data.status === 'OK') {
                const ratingData = ratingResponse.data.result.map(entry => ({
                    contestName: entry.contestName.substring(0, 20) + '...',
                    newRating: entry.newRating,
                    ratingChange: entry.newRating - entry.oldRating,
                    date: new Date(entry.ratingUpdateTimeSeconds * 1000).toLocaleDateString()
                }));
                setRatingHistory(ratingData.slice(-15));
                setContestData(ratingResponse.data.result);
            }

            if (submissionResponse.data.status === 'OK') {
                const submissions = submissionResponse.data.result;
                const submissionMap = {};

                submissions.forEach((submission) => {
                    const date = new Date(submission.creationTimeSeconds * 1000).toISOString().split('T')[0];
                    if (!submissionMap[date]) {
                        submissionMap[date] = 0;
                    }
                    submissionMap[date]++;
                });

                const today = new Date();
                const submissionValues = [];
                for (let i = 365; i >= 0; i--) {
                    const date = new Date(today);
                    date.setDate(date.getDate() - i);
                    const formattedDate = date.toISOString().split('T')[0];
                    submissionValues.push({
                        date: formattedDate,
                        count: submissionMap[formattedDate] || 0,
                    });
                }
                setSubmissionData(submissionValues);
            }
        } catch (err) {
            setError('Error fetching user data. Please check the username and try again.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    }; 

    const getContestStats = () => {
        if (!contestData || contestData.length === 0) return null;

        return {
            totalContests: contestData.length,
            bestRank: Math.min(...contestData.map(c => c.rank)),
            worstRank: Math.max(...contestData.map(c => c.rank)),
            maxUp: Math.max(...contestData.map(c => c.newRating - c.oldRating)),
            maxDown: Math.min(...contestData.map(c => c.newRating - c.oldRating))
        };
    };

    const getTooltipDataAttrs = (value) => {

        if (!value || !value.date) {
            return null;
        }
        return {
            'data-tip': `Date: ${value.date}, Submissions: ${value.count}`,
        };
    };

    const getClassForValue = (value) => {
        if (!value || !value.count) {
            return 'color-empty';
        }
        return `color-scale-${Math.min(4, value.count)}`;
    };

    return (
        <Container maxWidth="xl" sx={{ py: 2 }}>
            <StyledCard elevation={8}>
                <LeftSection>
                    <StyledAvatar
                        src={userData?.titlePhoto || '/assets/default-avatar.png'}
                        alt="Profile"
                    />

                    <Box sx={{ width: '100%', mb: 2 }}>
                        <TextField
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter Codeforces handle"
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                                    '&.Mui-focused fieldset': { borderColor: 'white' }
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
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <Typography variant="h5" gutterBottom>
                        {userData?.handle || 'Codeforces Profile'}
                    </Typography>

                    {userData && (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Rating: {userData.rating || 'N/A'}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Rank: {userData.rank || 'N/A'}
                            </Typography>
                            <Typography variant="body1">
                                Max Rating: {userData.maxRating || 'N/A'}
                            </Typography>
                        </>
                    )}
                </LeftSection>

                <RightSection>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <StyledStatBox>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <TimelineIcon sx={{ mr: 1 }} />
                                    <Typography variant="h6">Rating History</Typography>
                                </Box>
                                {ratingHistory && ratingHistory.length > 0 && (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={ratingHistory}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis stroke="white" dataKey="contestName" />
                                            <YAxis stroke="white"/>
                                            <Tooltip />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="newRating"
                                                stroke="#8884d8"
                                                name="Rating"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </StyledStatBox>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <StyledStatBox>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <EmojiEventsIcon sx={{ mr: 1 }} />
                                    <Typography variant="h6">Contest Statistics</Typography>
                                </Box>
                                {contestData && getContestStats() && (
                                    <>
                                        <Typography variant="body1" gutterBottom>
                                            Total Contests: {getContestStats().totalContests}
                                        </Typography>
                                        <Typography variant="body1" gutterBottom>
                                            Best Rank: #{getContestStats().bestRank}
                                        </Typography>
                                        <Typography variant="body1" gutterBottom>
                                            Worst Rank: #{getContestStats().worstRank}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            gutterBottom
                                            sx={{
                                                color: getContestStats().maxUp > 0 ? '#4CAF50' : '#FF5252',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Max Rating Change: {getContestStats().maxUp > 0
                                                ? `+${getContestStats().maxUp}`
                                                : getContestStats().maxDown}
                                        </Typography>
                                    </>
                                )}
                            </StyledStatBox>
                        </Grid>

                        <Grid item xs={12}>
                            <StyledStatBox>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <TimelineIcon sx={{ mr: 1 }} />
                                    <Typography variant="h6">Contest Performance</Typography>
                                </Box>
                                {contestData && contestData.length > 0 && (
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart
                                            data={contestData.slice(-10)} // Show last 10 contests
                                            margin={{
                                                top: 20,
                                                right: 30,
                                                left: 20,
                                                bottom: 60
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="contestName"
                                                stroke="white"
                                                angle={-45}
                                                textAnchor="end"
                                                height={60}
                                                interval={0}
                                            />
                                            <YAxis stroke="white" />
                                            <Tooltip
                                                content={({ active, payload, label }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <Box
                                                                sx={{
                                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                                    p: 1,
                                                                    border: '1px solid #ccc',
                                                                    borderRadius: 1
                                                                }}
                                                            >
                                                                <Typography variant="body2" color="textPrimary">
                                                                    {label}
                                                                </Typography>
                                                                <Typography variant="body2" color="textPrimary">
                                                                    Rating: {payload[0].value}
                                                                </Typography>
                                                                <Typography variant="body2" color="textPrimary">
                                                                    Rank: #{payload[0].payload.rank}
                                                                </Typography>
                                                            </Box>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Legend />
                                            <Bar
                                                dataKey="newRating"
                                                fill="#8884d8"
                                                name="Contest Rating"
                                                animationDuration={1500}
                                                label={{
                                                    position: 'top',
                                                    content: ({ value }) => value,
                                                    fill: '#fff',
                                                    fontSize: 12
                                                }}
                                            >
                                                {contestData.slice(-10).map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.newRating > entry.oldRating ? '#4CAF50' : '#FF5252'}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </StyledStatBox>
                        </Grid>

                        <Grid item xs={12}>
                            <StyledStatBox>
                                <Typography variant="h6" align="center" gutterBottom>
                                    Submission Activity
                                </Typography>
                                <Box sx={{
                                    p: 2,
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '8px',
                                    '.react-calendar-heatmap': {
                                        width: '100%',
                                    }
                                }}>
                                    <CalendarHeatmap
                                        startDate={new Date(new Date().setDate(new Date().getDate() - 365))}
                                        endDate={new Date()}
                                        values={submissionData}
                                        classForValue={(value) => {
                                            if (!value || value.count === 0) {
                                                return 'color-empty';
                                            }
                                            return `color-scale-${Math.min(value.count, 4)}`;
                                        }}
                                        tooltipDataAttrs={getTooltipDataAttrs}
                                        showWeekdayLabels={true}
                                    />
                                    <ReactTooltip />
                                </Box>
                            </StyledStatBox>
                        </Grid>
                    </Grid>
                </RightSection>
            </StyledCard>
        </Container>
    );
};

export default Codeforces;
