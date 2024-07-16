import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import CenteredStack from '../../components/custom/loading/CenteredStack';


const Loading = () => {
  return (
    <CenteredStack>
    <CircularProgress color="success" />
    </CenteredStack>
  )
}

export default Loading