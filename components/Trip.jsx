
import React, { useState } from 'react'
import { IconButton, Stack, Typography} from '@mui/material'
import { useRouter } from 'next/navigation';
import { useTheme } from '@emotion/react';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import dayjs from 'dayjs';


const Trip = (props) => {

  const [tripHover, setTripHover] = useState(false)

  const router = useRouter()
  const theme = useTheme()

  
  const calculateDaysLeft = (tripData) => {
    if (tripData && tripData.startDate && tripData.endDate) {
      const startDate = dayjs(tripData.startDate);
      const today = dayjs().startOf('day'); 
      const daysLeft = startDate.diff(today, 'day');
      return daysLeft;
    }
    return null;
  };

  const NavigateToInnerTrip = () => {

     localStorage.setItem('tripId', props.tripData._id);
     router.push(`/trips?id=${props?.tripData?._id}`)
    
  }

  return (
    <Stack backgroundColor={theme.palette.mode === "dark" ? theme.main.darkColor : null } display={theme.flexBox} justifyContent={theme.between} alignItems={theme.center} onMouseOver={() => setTripHover(true)} onMouseLeave={() => setTripHover(false)} borderRadius={theme.radius} height={theme.trips.height} onClick={NavigateToInnerTrip} boxShadow={theme.boxShadow} sx={{transition: theme.transition, cursor: "pointer", "&:hover": {boxShadow: theme.boxShadowHover}}}>
      <img src={props?.tripData?.url || './default.png'} width="100%" height={150} alt='trip' style={{borderTopLeftRadius: theme.trips.borderLeft, borderTopRightRadius: theme.trips.borderRight, objectFit: theme.cover, filter: calculateDaysLeft(props.tripData) <= 0 ? "grayscale(100%)" : "none" }}/>
      { calculateDaysLeft(props?.tripData) <= 0 ? <Typography component="h2" variant='span' position="absolute" marginTop="80px" fontWeight="bold" fontSize="23px" color={theme.main.lightGray}>Traveled</Typography> : null}
      <Typography height="25px" borderRadius="7px" marginRight="auto"  pt={0.8} pl={2} pb={1} component="span" variant='span' fontSize="14px" display={theme.flexBox} alignItems={theme.center} justifyContent={theme.left}>{props?.tripData?.name?.length > 30? `${props.tripData.name.substring(0, 30)}..` : props?.tripData?.name} { tripHover ? <IconButton onClick={NavigateToInnerTrip} size='small' sx={{marginLeft: "5px"}}><NearMeOutlinedIcon sx={{fontSize: "17px"}} /></IconButton> : null }</Typography>
    </Stack>
  )
}

export default React.memo(Trip)