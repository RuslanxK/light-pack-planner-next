"use client"

import React from 'react'
import {  Container, Typography, Stack, IconButton, Alert } from '@mui/material'
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
    
<Stack display={theme.flexBox}  justifyContent={theme.start} width={theme.trips.width} minHeight="100vh" pb={5}>


      
<div className="main-info">
<Stack direction="row" alignItems="center" mb={1}>
<IconButton sx={{marginRight: "5px"}} onClick={() => router.push('/')}><ArrowBackIcon /></IconButton>
<Typography component="h2" variant="h6"> 
 Explore the Wilderness: Expert Tips, Stories, and Gear Recommendations Inside!
</Typography>
</Stack>
<Typography component="p" variant="body2" color="gray">
 Embark on a journey with our backpacking blog, where seasoned adventurers share their tales of triumph, survival, and discovery. <br /> From remote mountain peaks to dense forests, find inspiration for your next expedition.
</Typography>

{ ArticleBox.length ? null : <Alert severity="info" sx={{ mt: 2}}>No articles yet</Alert> }

</div>


    <div className="boxes">
    
    {ArticleBox}
   

    </div>

    

    </Stack>
      
      </Container>
  )
}

export default Articles