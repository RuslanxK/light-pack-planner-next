"use client"

import { Stack, TextField, Typography } from '@mui/material'
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
    <Stack display={theme.flexBox} direction="row" justifyContent={theme.end} sx={{overflowY: "hidden"}}>
      
      <div className="login-img">
        <img id="hiking-image" src="/hiking-3.jpg" alt="hiking" width="100%" style={{objectFit: "cover", height:"100vh" }} /> 
        <img id="logo" onClick={() => router.push('/login')} src="/logo.png" alt="logo" width="110px" height="70" style={{ position: "absolute", top: "16px", left: '35px' }}/> 
      </div>


    <div className="login-content">
    <img id="logo-mobile-login" src="/logo.png" alt="logo" width="90px" height="58" style={{ position: "absolute", top: "25px", left: '25px' }}/> 
    <Stack display={theme.flexBox} justifyContent={theme.center} alignItems="stretch" width="450px">
    <h1 className='login-text'>Forgot password</h1>
    <Typography component="span" variant="span" mb={4} width="100%" color="gray">
          Enter the email address you used to create the account, and we will email you instructions to reset your password
    </Typography>
    <form onSubmit={handleSubmit}>
    <div style={{display: "flex", marginBottom: "15px", flexDirection: "column", justifyContent: "center", alignItems: "stretch", borderRadius:"10px"}}>
    
    <TextField type="email" required label=" Enter Email" name="email" onChange={handleChange} sx={{marginBottom: "15px", background: "white", borderRadius: "7px"}} />
    <button type='submit' className="login-button-regular" style={{display: "flex", justifyContent: "center"}}>Send Email { isLoading ? <CircularProgress color="inherit" size={20} sx={{marginLeft: "15px"}} /> : null }</button>
    <Typography component="span" variant="span" width="100%" color="gray" sx={{cursor: "pointer"}}  mb={2}>Remember password? <Typography onClick={() => router.push("/login")} component="span" variant="span" color="#2d7fb5" sx={{cursor: "pointer"}}>Login</Typography></Typography>

    </div>
    </form>


    { error ? <Alert severity="error">{error}</Alert> : null }
    {success ?  <Alert severity="success">{success}</Alert>: null }

    </Stack>
    

      </div>
    </Stack>
  )
}

export default ResetPassword

