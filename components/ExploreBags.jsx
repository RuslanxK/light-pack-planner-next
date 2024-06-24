"use client"


import React from 'react'
import {  Container, Typography, Stack, IconButton, Badge,  Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link} from '@mui/material'
import { useTheme } from '@emotion/react';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';


const ExploreBags = ({exploreBags}) => {

  const theme = useTheme()
  const router = useRouter();


  return (
    <Container sx={{display: theme.flexBox}} maxWidth={false} disableGutters>
    
    <Stack display={theme.flexBox} justifyContent={theme.start} width={theme.trips.width} minHeight="100vh" pb={5}>
    
    
          
    <div className="main-info">
    
  
    
    <Stack direction="row" alignItems="center">
    <IconButton sx={{marginRight: "5px"}} onClick={() => router.push('/')}><ArrowBackIcon /></IconButton>
    <Typography component="h1" fontWeight="600" variant='span' fontSize="20px" mb={0.5} onClick={() => console.log(exploreBags)}> 
     Explore Bags
    </Typography>
    </Stack>
    <Typography component="p" variant="p" mb={2.5} mt={1}>
     Discover the top-rated bags crafted for every journey. <br /> Whether you're conquering remote mountain peaks or exploring dense forests, find the perfect companion for your next adventure.
</Typography>
    
    </div>
    

         <Stack pl={5} pr={5}>
        
         {exploreBags.length === 0 ? (
  <Alert severity="warning" sx={{ margin: "0 auto" }}>
    There are no shared bags yet.
  </Alert>
) : (
  <TableContainer>
    <Table
      size="small"
      sx={{
        minWidth: 650,
        boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px;",
        background: theme.palette.mode === "dark" ? theme.main.darkColor : "#FAFAFA"
      }}
      aria-label="simple table"
    >
      <TableHead sx={{ background: theme.palette.mode === "dark" ? "#171717" : "#F2F2F2" }}>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell align="left">Owner</TableCell>
          <TableCell align="center">Categories</TableCell>
          <TableCell align="center">Items</TableCell>
          <TableCell align="center">Worn</TableCell>
          <TableCell align="center">Total Weight</TableCell>
          <TableCell align="right">Likes</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {exploreBags.map((row) => (
          <TableRow
            key={row._id}
            sx={{
              '&:last-child td, &:last-child th': { border: 0 },
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? '#6e6d6d' : "#e6e3e3",
                cursor: 'pointer'
              }
            }}
          >
            <TableCell component="th" scope="row">
            <Link href={`/share?id=${row._id}`} target="_blank" rel="noopener noreferrer" underline="none">{row.name}</Link>
            </TableCell>
            <TableCell align="left">{row.userDetails.username}</TableCell>
            <TableCell align="center">{row.totalCategories}</TableCell>
            <TableCell align="center">{row.totalItems}</TableCell>
            <TableCell align="center">{row.totalWorn.toFixed(2)} {row.userDetails.weightOption}</TableCell>
            <TableCell align="center">{row.totalBagWeight.toFixed(2)} / {row.goal} {row.userDetails.weightOption}</TableCell>
            <TableCell align="right">
              <Badge color="success" badgeContent={row.likes || "0"} sx={{ zIndex: 0 }}>
                <IconButton>
                  <FavoriteIcon sx={{ fontSize: "20px" }} />
                </IconButton>
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)}

      
         </Stack>

        </Stack>
          
          </Container>
  )
}

export default ExploreBags