"use client"


import React from 'react'
import {  Container, Typography, Stack, IconButton, Badge, Tooltip } from '@mui/material'
import { useTheme } from '@emotion/react';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';

const ExploreBags = ({exploreBags}) => {

  const theme = useTheme()
  const router = useRouter();


  const bags = exploreBags.map((bag, index) => {

        return <Stack onClick={() => window.open(`/share?id=${bag._id}`)} sx={{cursor: "pointer"}} boxShadow="rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;" backgroundColor={theme.palette.mode === "dark" ? theme.main.darkColor : "#FAFAFA"} display="flex" direction="row" alignItems="center" justifyContent="space-between" p={2} m={1} index={index}>
          <Typography>{bag.name}</Typography>
          <Badge color="secondary" badgeContent={bag.likes || "0" } sx={{zIndex: 0}}>
        <Tooltip title="Total likes"><IconButton><FavoriteIcon sx={{fontSize: "20px"}}/></IconButton></Tooltip>
        </Badge>
          
          </Stack>
  })


  return (
    <Container sx={{display: theme.flexBox}} maxWidth={false} disableGutters>
    
    <Stack display={theme.flexBox} justifyContent={theme.start} width={theme.trips.width} minHeight="100vh" pb={5}>
    
    
          
    <div className="main-info">
    
  
    
    <Stack direction="row" alignItems="center">
    <IconButton sx={{marginRight: "5px"}} onClick={() => router.push('/')}><ArrowBackIcon /></IconButton>
    <Typography component="h1" fontWeight="600" variant='span' fontSize="20px" mb={0.5}> 
     Explore Bags
    </Typography>
    </Stack>
    <Typography component="p" variant="p" mb={2.5} mt={1}>
     Discover the top-rated bags crafted for every journey. <br /> Whether you're conquering remote mountain peaks or exploring dense forests, find the perfect companion for your next adventure.
</Typography>
    
    </div>
    
        
         {bags}
      
        </Stack>
          
          </Container>
  )
}

export default ExploreBags