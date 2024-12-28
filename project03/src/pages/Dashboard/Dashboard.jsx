import React from 'react'
import CodeForce from './CodeForce'
import Codechef from './Codechef';
import { Typography } from '@mui/material';

import Leetcode from './Leetcode';


function Dashboard() {


  return (
    <>
      <Typography  variant="h6" sx={{display:"flex",justifyContent:"center",marginTop:"2px"}}>Competitive Problem Dashboard</Typography>
      <div >
        <CodeForce />
        <Codechef />
        <Leetcode />






        {/* <LeetCode/> */}
      </div>

    </>


  )
}

export default Dashboard