import React, { useState, useMemo } from 'react'
import { IconButton, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useTheme } from '@mui/material/styles'
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined'
import dayjs from 'dayjs'

const Trip = ({ tripData }) => {
  const [tripHover, setTripHover] = useState(false)
  const router = useRouter()
  const theme = useTheme()

  const calculateDaysLeft = useMemo(() => {
    if (tripData && tripData.startDate && tripData.endDate) {
      const startDate = dayjs(tripData.startDate)
      const today = dayjs().startOf('day')
      const daysLeft = startDate.diff(today, 'day')
      return daysLeft
    }
    return null
  }, [tripData])

  const navigateToInnerTrip = () => {
    localStorage.setItem('tripId', tripData._id)
    router.push(`/trips?id=${tripData._id}`)
  }

  return (
    <Stack
      backgroundColor={theme.palette.mode === 'dark' ? theme.main.darkColor : null}
      display={theme.flexBox}
      justifyContent={theme.between}
      alignItems={theme.center}
      onMouseOver={() => setTripHover(true)}
      onMouseLeave={() => setTripHover(false)}
      borderRadius={theme.radius}
      height={theme.trips.height}
      onClick={navigateToInnerTrip}
      boxShadow={theme.boxShadow}
      sx={{
        transition: theme.transition,
        cursor: 'pointer',
        '&:hover': { boxShadow: theme.boxShadowHover },
      }}
    >
      <img
        src={tripData?.url || './default.png'}
        width="100%"
        height={150}
        alt="trip"
        style={{
          borderTopLeftRadius: theme.trips.borderLeft,
          borderTopRightRadius: theme.trips.borderRight,
          objectFit: theme.cover,
          filter: calculateDaysLeft <= 0 ? 'grayscale(100%)' : 'none',
        }}
      />
      {calculateDaysLeft <= 0 && (
        <Typography
          component="h2"
          variant="span"
          position="absolute"
          marginTop="80px"
          fontWeight="bold"
          fontSize="23px"
          color={theme.main.lightGray}
        >
          Traveled
        </Typography>
      )}
      <Typography
        height="25px"
        borderRadius="7px"
        marginRight="auto"
        pt={0.8}
        pl={2}
        pb={1}
        component="span"
        variant="span"
        fontSize="14px"
        display={theme.flexBox}
        alignItems={theme.center}
        justifyContent={theme.left}
      >
        {tripData?.name?.length > 30 ? `${tripData.name.substring(0, 30)}..` : tripData?.name}
        {tripHover && (
          <IconButton onClick={navigateToInnerTrip} size="small" sx={{ marginLeft: '5px' }}>
            <NearMeOutlinedIcon sx={{ fontSize: '17px' }} />
          </IconButton>
        )}
      </Typography>
    </Stack>
  )
}

export default React.memo(Trip)
