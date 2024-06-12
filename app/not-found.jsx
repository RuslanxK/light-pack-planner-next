"use client"

import { Stack, Typography, Link} from "@mui/material"
import { useRouter } from 'next/navigation';
import { useTheme } from '@emotion/react';

export default function NotFound() {

  const router = useRouter();
  const theme = useTheme()


    const navigateToHome = () => {
         router.push('/')
    }

  return( 

     <Stack display="flex" justifyContent="center" width="100%" alignItems="center" height="100vh" mr="210px">
      <Stack p={2}>
      <img src="/notfound.jpg" width="350px" style={{margin: "0 auto"}} />
      <Typography component="h1" variant="span" fontWeight="400" fontSize="30px" mb={2.5} textAlign="center">We couldn't connect the dots.</Typography>
      <Typography component="span" variant="span" fontWeight="400" mb={2.5} textAlign="center">This page was not found. You may have mistyped the <br /> address or the page may have moved.</Typography>
      <Link onClick={navigateToHome} width="230px" sx={{cursor: "pointer", margin: "0 auto", color: theme.green, textDecorationColor: theme.green}} textAlign="center">Take me to the home page</Link>

      </Stack>
     </Stack>
  )
      
}