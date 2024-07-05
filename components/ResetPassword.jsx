"use client"

import { Stack, TextField, Typography, Grid } from '@mui/material'
import { useTheme } from '@emotion/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import axios from 'axios';


const ResetPassword = () => {


  const [userData, setUserData] = useState({})
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")


  const theme = useTheme()
  const router = useRouter();

 

  const handleChange = (event) => {
    let { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
    setError("")
    setSuccess("")
  };



  const handleSubmit =  async (e) => {
     e.preventDefault()
     setIsLoading(true)

     try {

     const foundUser = await axios.post("/api/findUserEmail", userData)


     if(!foundUser) {

         setSuccess(false)
         setError("The email does not exist.")
         setIsLoading(false)
     }

     else {

         const updatedUser = { ...foundUser.data, changingPassword: true };
        
         await axios.put(`/api/user/${foundUser.data._id}`, updatedUser)
         setError("")
         setSuccess("Please check your email to continue.")
         setIsLoading(false)
      }
     }

     catch(error) {
       setError(error?.response?.data)
       setSuccess(false)
       setIsLoading(false)
     }
  }
  


  return (
    <Stack display={theme.flexBox} direction="row" justifyContent={theme.center} sx={{overflowY: "hidden"}}>
      
      <div className="login-img">
        <img id="hiking-image" src="/hiking-3.jpg" alt="hiking" width="100%" style={{objectFit: "cover", height:"100vh" }} /> 
        <img id="logo" onClick={() => router.push('/login')} src="/logo.png" alt="logo" width="110px" height="70" style={{ position: "absolute", top: "16px", left: '35px' }}/> 
      </div>


    <div className="reset-password-content">
    <img id="logo-mobile-login" src="/logo.png" alt="logo" width="90px" height="58" style={{ position: "absolute", top: "25px", left: '25px' }}/> 
    <div className='login-form'  style={{backgroundColor: theme.palette.mode === "dark" ? "rgba(30, 30, 30, 0.9)" : null}}>
    <h1 className='login-text'>Forgot password</h1>
    <Typography component="span" variant="span" mb={3} width="100%" color="gray">
       Enter the email address you used to create the account, and we will email you instructions to reset your password
    </Typography>
    <form onSubmit={handleSubmit}>
    <Grid container spacing={2}>

    <Grid item xs={12}>
    
    <TextField type="email" required label=" Enter Email" name="email" onChange={handleChange} sx={{width: "100%"}} />
    </Grid>

    <Grid item xs={12}>
    <button type='submit' className="login-button-regular" style={{display: "flex", justifyContent: "center"}}>Send Email { isLoading ? <CircularProgress color="inherit" size={20} sx={{marginLeft: "15px"}} /> : null }</button>
    </Grid>
    <Typography component="span" variant="span" width="100%" ml={2} color="gray" sx={{cursor: "pointer"}}>Remember password? <Typography onClick={() => router.push("/login")} component="span" variant="span" color="#2d7fb5" sx={{cursor: "pointer"}}>Login</Typography></Typography>

    </Grid>
    </form>


    { error ? <Alert severity="error">{error}</Alert> : null }
    {success ?  <Alert severity="success">{success}</Alert>: null }

    </div>
    

      </div>
    </Stack>
  )
}

export default ResetPassword

