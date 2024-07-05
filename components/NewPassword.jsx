"use client"

import { Stack, TextField, Typography, Grid} from '@mui/material'
import { useTheme } from '@emotion/react';
import { Fragment, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import axios from 'axios';


const NewPassword = ({user, err}) => {



  const [passwords, setPasswords] = useState({})
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")


  const theme = useTheme()
  const router = useRouter();

  

  const handleChange = (event) => {
    let { name, value } = event.target;
    setPasswords({ ...passwords, [name]: value });
    setError("")
  };



  useEffect(() => {

    if(err) {

      router.push("/login")
  }
    
  }, []);



  const handleSubmit =  async (e) => {
     e.preventDefault()

      if(passwords.password !== passwords.confirmPassword) {

          return setError("Password do not match.")
      }

     try {

      const updateUser = { ...user, password: passwords.password, changingPassword: false, passwordResetTokenExpires: null, emailToken: null };

      setIsLoading(true)

      await axios.put(`/api/userToken/${user.emailToken}`, updateUser)

      setSuccess("Password changed successfully.")

         setTimeout(() => {

          setError("")
          setIsLoading(false)
          router.push("/login")
          
         }, 2000);
      }
     
     catch(error) {
       setError(error?.response?.data)
       setSuccess(false)
       setIsLoading(false)
     }
  }
  


  return (
    <Stack display={theme.flexBox} direction="row" justifyContent={theme.end} sx={{overflowY: "hidden"}}>
      
  { err ? null : <Fragment>  <div className="login-img">
        <img id="hiking-image" src="/hiking-4.jpg" alt="hiking" width="100%" style={{objectFit: "cover", height:"100vh" }} /> 
        <img id="logo" onClick={() => router.push('/login')} src="/logo.png" alt="logo" width="110px" height="70" style={{ position: "absolute", top: "16px", left: '35px' }}/> 
      </div>


    <div className="reset-password-content">
    <img id="logo-mobile-login" src="/logo.png" alt="logo" width="90px" height="58" style={{ position: "absolute", top: "25px", left: '25px' }}/> 
    <div className='login-form'  style={{backgroundColor: theme.palette.mode === "dark" ? "rgba(30, 30, 30, 0.9)" : null}}>
    <h1 className='login-text'>Reset password</h1>
    <Typography component="span" variant="span" mb={3} width="100%" color="gray">
          Enter the email address you used to create the account, and we will email you instructions to reset your password
    </Typography>
    <form onSubmit={handleSubmit}>

    <Grid container spacing={2}>
    <Grid item xs={12}>
    <TextField type="password" sx={{width: "100%"}} required inputProps={{minLength : 10}} label="New Password" name="password" onChange={handleChange} />
    </Grid>
    <Grid item xs={12}>
    <TextField type="password" sx={{width: "100%"}} required inputProps={{minLength : 10}} label="Confirm New Password" name="confirmPassword" onChange={handleChange}  />
    </Grid>
    <Grid item xs={12}>
    <button type='submit' className="login-button-regular" style={{display: "flex", justifyContent: "center"}}>Reset Password { isLoading ? <CircularProgress color="inherit" size={20} /> : null }</button>
    </Grid>

    <Typography component="span" variant="span" width="100%" color="gray" ml={2}>Remember password? <Typography onClick={() => router.push("/login")} component="span" variant="span" color="#2d7fb5" sx={{cursor: "pointer"}}>Login</Typography></Typography>
  

    </Grid>
    
    </form>


    { error ? <Alert severity="error">{error}</Alert> : null }
    {success ?  <Alert severity="success">{success}</Alert>: null }

    </div>
    

      </div> </Fragment> }

    </Stack>
  )
}

export default NewPassword

