import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import CenteredStack from '../../components/custom/loading/CenteredStack';


const Loading = () => {
  return (
    <CenteredStack>

    <div className='loading'>
    <CircularProgress color="success" />
    </div>

    </CenteredStack>
  )
}

export default Loading