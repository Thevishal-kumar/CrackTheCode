import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Button } from '@mui/material';

export default function LeetCodeCard() {
  const [contests, setContests] = useState([]);

  const fetchMockContests = () => {
    const mockData = [
      {
        name: "LeetCode Weekly Contest 333",
        start_time: new Date().toISOString(),
      },
      {
        name: "LeetCode Biweekly Contest 100",
        start_time: new Date(Date.now() + 86400000).toISOString(), // +1 day
      },
    ];
    setContests(mockData);
  };

  useEffect(() => {
    fetchMockContests();
  }, []);

  return (
    <Card sx={{ maxWidth: 345, margin: '0 auto' }}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Upcoming LeetCode Contests
          </Typography>
          {contests.length > 0 ? (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <ul>
                {contests.map((contest, index) => (
                  <li key={index}>
                    {contest.name} - Starts at:{" "}
                    {new Date(contest.start_time).toLocaleString()}
                  </li>
                ))}
              </ul>
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No upcoming contests.
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
      <Button onClick={fetchMockContests} variant="contained" sx={{ margin: 2 }}>
        Refresh Contests
      </Button>
    </Card>
  );
}
