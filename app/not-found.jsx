"use client"

import { Stack, Typography, Link, IconButton} from "@mui/material"
import { useRouter } from 'next/navigation';
import { useTheme } from '@emotion/react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export default function NotFound() {

  const router = useRouter();
  const theme = useTheme()


    const navigateToHome = () => {
         router.push('/')
    }

  return( 

     <Stack display="flex" justifyContent="center" width="100%" alignItems="center" height="100vh" mr="210px">
      <Stack p={2} alignItems="center">
      <IconButton><HighlightOffIcon sx={{fontSize: "100px"}}/></IconButton>
      <Typography component="h1" variant="span" fontWeight="400" fontSize="40px" mb={1} textAlign="center">We couldn't connect the dots.</Typography>
      <Typography component="span" variant="span" fontWeight="400" mb={2.5} textAlign="center">This page was not found. You may have mistyped the <br /> address or the page may have moved.</Typography>
      <Link onClick={navigateToHome} width="230px" sx={{cursor: "pointer", margin: "0 auto", color: theme.green, textDecorationColor: theme.green}} textAlign="center">Home Page</Link>

      </Stack>
     </Stack>
  )
      
}