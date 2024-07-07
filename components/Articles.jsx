"use client"

import React, { useState, useTransition, useRef  } from 'react'
import {  Container, Typography, Stack, TextField, Button, IconButton } from '@mui/material'
import { useTheme } from '@emotion/react';
import Article from './Article';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const Articles = ({articles}) => {

  const theme = useTheme()
  const router = useRouter();


  const ArticleBox = articles.map((article) => {

       return <Article key={article._id} articleData={article} />
  })



  return (
    <Container sx={{display: theme.flexBox}} maxWidth={false} disableGutters>
    
<Stack display={theme.flexBox} justifyContent={theme.start} width={theme.trips.width} minHeight="100vh" pb={5}>


      
<div className="main-info">
<Stack direction="row" alignItems="center">
<IconButton sx={{marginRight: "5px"}} onClick={() => router.push('/')}><ArrowBackIcon /></IconButton>
<Typography component="h1" fontWeight="600" variant='span' fontSize="20px" mb={0.5}> 
 Explore the Wilderness: Expert Tips, Stories, and Gear Recommendations Inside!
</Typography>
</Stack>
<Typography component="p" variant="p" mb={2.5} mt={1}>
 Embark on a journey with our backpacking blog, where seasoned adventurers share their tales of triumph, survival, and discovery. <br /> From remote mountain peaks to dense forests, find inspiration for your next expedition.
</Typography>

</div>


    <div className="boxes">
    
    {ArticleBox}
   

    </div>

    </Stack>
      
      </Container>
  )
}

export default Articles