"use client"


import React from 'react'
import {  Container, Typography, Stack, IconButton } from '@mui/material'
import { useTheme } from '@emotion/react';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ExploreBags = ({exploreBags}) => {

  const theme = useTheme()
  const router = useRouter();


  const bags = exploreBags.map((bag, index) => {

        return <Stack border="1px solid gray" p={2} m={1} index={index}>{bag.name}</Stack>
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