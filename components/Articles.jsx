"use client"

import React, { useState, useTransition, useRef  } from 'react'
import {  Container, Typography, Stack, TextField, Button, IconButton } from '@mui/material'
import { useTheme } from '@emotion/react';
import Article from './Article';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const Articles = ({articles, session}) => {

  const theme = useTheme()
  const router = useRouter();
  const formRef = useRef(null);

  const [articleData, setArticleData] = useState({})
  const [error, setError] = useState("")
  const [isTransitionStarted, startTransition] = useTransition();


  const ArticleBox = articles.map((article) => {

       return <Article key={article._id} articleData={article} />
  })


  const addArticle = async (e) => {

      e.preventDefault()

      if (articleData.image && articleData.image.size > 2 * 1024 * 1024) {
        setError("File size exceeds the maximum limit of 2 MB.");
        return; 
      }

      try {
        const data = await axios.post('/api/articles', articleData)
  
        const awsUrl = data.data.signedUrl
  
        await fetch(awsUrl, {

          method: "PUT",
          body: articleData.image,
          headers: {
    
             "Content-Type": articleData.image.type
          }
      })

      formRef.current.reset();
      startTransition(router.refresh)

    }
    
     catch (error) {
        setError(error.response.data)
     }
  }


  const handleChange = (event) => {
    const { name, value } = event.target;
    setArticleData({ ...articleData, [name]: value });
  };


   const handleFileChange = (event) => {
    const { name } = event.target;
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setArticleData({ ...articleData, [name]: selectedFile });
      setError("");
    }
  };


  return (
    <Container sx={{display: theme.flexBox}} maxWidth={false} disableGutters>
    
<Stack display={theme.flexBox} justifyContent={theme.start} width={theme.trips.width} minHeight="100vh" pb={5}>


      
<div className="main-info">

{session.user.email === process.env.NEXT_PUBLIC_ADMIN_1_EMAIL ? 
<form onSubmit={addArticle} ref={formRef}>
<Stack mr={5} p={4} mb={5} borderRadius="7px" boxShadow={theme.boxShadow}>
<Typography component="h2" variant='h5' mb={3}>Upload Article</Typography>
<input required type='file' name='image' style={{width: "fit-content"}} onChange={handleFileChange} />
<TextField required type='text' name='title' label="title" sx={{marginTop: "15px"}} onChange={handleChange} />
<TextField required multiline rows={8} name='description' label="description" sx={{marginTop: "15px"}} onChange={handleChange} />
<Button type='submit' variant="contained" sx={{marginTop: "15px", padding: "15px"}} disableElevation>Add article</Button>

{ error ? <Stack width="100%" backgroundColor="rgba(255, 0, 0, 0.5)"><Typography p={1.5} color="white">{error}</Typography></Stack> : null }


</Stack> </form> : null }

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