import React, { useState } from 'react';
import axios from 'axios';
import CodeForceCard from './CodeForceCard';
import CodeChefCard from './CodeChefCard';
import LeetCodeCard from './LeetCodeCard';


function Contest() {
  return (
    <>
    <span style={{display:"flex",justifyContent:"center", margin:"80px 0px 0px 0px"}}><h1>Contest</h1></span>
    <div style={{display:"flex",justifyContent:"space-evenly"}} >
    <CodeForceCard/>
    {/* <CodeChefCard/> */}
    <LeetCodeCard/>
    </div>
       
    </>
  )
}

export default Contest
