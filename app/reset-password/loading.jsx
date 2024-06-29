import React from 'react'
import { Stack } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';


const Loading = () => {
  return (
    <Stack display="flex" justifyContent="center" height="100vh" alignItems="center" width="100%">

    
    <CircularProgress color="success" />
   

    </Stack>
  )
}

export default Loading