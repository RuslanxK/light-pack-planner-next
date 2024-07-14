"use client"

import React from 'react';
import { Stack, Typography, Box } from '@mui/material'
import LinearProgress from '@mui/material/LinearProgress';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const VerifiedPage = ({user}) => {

  const [progress, setProgress] = React.useState(0);

  const router = useRouter()


  React.useEffect(() => {


    if(user.verifiedCredentials === true) {

      return router.push('/login'); 
    }

    
    const fetchData = async () => {
      try {

        const formData = new FormData();
        formData.append("verifiedCredentials", true);
        await axios.put(`/api/user/${user._id}`, formData);
        router.push('/login'); 
      } catch (error) {
        console.log('Error:', error);
      }
    };

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          fetchData();
          return 100;
        }
        const diff = Math.random() * 20;
        return Math.min(oldProgress + diff, 100);
      });
    }, 150);

    return () => {
      clearInterval(timer);
    };
  }, [user]); 



  
  return (

    <Stack display="flex" flexDirection="column" justifyContent="center" alignItems="center" margin="0 auto" height="100vh" p={2}>
     {user.verifiedCredentials === true ? null : <>
     <Typography component="h1" variant='h1' fontSize="27px" fontWeight="600" mb={2}>Verified</Typography>
     <Typography component="span" variant='span' color="gray" textAlign="center">You have successfully verified your account</Typography>
     <Box sx={{ width: '100%', marginTop: "15px" }}>
      <LinearProgress variant="determinate" color="success" value={progress} />
     </Box></>  }

    </Stack>
  )
}

export default VerifiedPage