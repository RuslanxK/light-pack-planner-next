"use client"

import React from 'react'
import Nav from './Nav'
import { Container, Typography, Stack, Link } from '@mui/material'
import { useTheme } from '@emotion/react';
import { useRouter } from 'next/navigation';


const InnerArticle = ({articleData}) => {

    const theme = useTheme()
    const router = useRouter()

  return (
    <Container sx={{display: theme.flexBox}} maxWidth={false} disableGutters>


        <Stack display={theme.flexBox} justifyContent={theme.start} width={theme.trips.width} pb={7} minHeight="100vh">

        <img src={`${process.env.NEXT_PUBLIC_ARTICLE_URL}/${articleData.imageKey}`} height="350px" style={{objectFit: "cover"}} alt='article' />

        <div className="main-info">

        <Stack pr={5} mb={3}>
        <Typography variant="body2" component="span" backgroundColor={ theme.palette.mode === "dark" ? "#171717" : "#fafafa"} p={1} width="fit-content" borderRadius="7px">{new Date(articleData.createdAt).toDateString()}</Typography>

        <Typography component="h1" variant='h5' pt={2} mb={1}>{articleData.title}</Typography>
        <Typography component="span" variant='body2' color="gray" pt={1} lineHeight={2}>{articleData.description}</Typography>

        </Stack>

        <Link sx={{cursor: "pointer"}} onClick={() => router.push("/articles")}>Back to all articles</Link>

        </div>

        </Stack>
        
        </Container>
  )
}

export default InnerArticle