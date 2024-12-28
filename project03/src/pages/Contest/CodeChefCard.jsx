import React from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';

export default function CodeChefCard() {
  const [userData, setUserData] = useState(null);

  const fetchContest = async () => {
    try {
      const response = await axios.get('https://about-coderme.vercel.app/codechef/');
      console.log(response);
      setUserData(response.data.result);
    } catch (error) {
      console.error("Error fetching contests:", error.message);
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
      } else if (error.request) {
        console.error("Request made but no response received:", error.request);
      }
    }
  };

  // Filter for upcoming contests with phase "BEFORE"
  const upcomingContests = userData ? userData.filter(contest => contest.phase === 'BEFORE') : [];

  useEffect(()=>{
   fetchContest()
  },[])
  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
          {/* <CardMedia
            component="img"
            height="140"
            image="/static/images/cards/contemplative-reptile.jpg"
            alt="green iguana"
          /> */}
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Upcoming CodeChef Contests
            </Typography>
            {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {upcomingContests.length > 0 ? (
                <ul>
                  {upcomingContests.map((contest) => (
                    <li key={contest.id}>
                      {contest.name} - Starts at: {new Date(contest.startTimeSeconds * 1000).toLocaleString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No upcoming contests.</p>
              )}
            </Typography> */}
          </CardContent>
        </CardActionArea>
        <Button onClick={fetchContest}>Fetch Contests</Button>
      </Card>
      
    </>
  );
}
