"use client"

import { Stack, TextField, Typography, Grid} from '@mui/material'
import { useTheme } from '@emotion/react';
import { Fragment, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import Btn from './custom/button/Btn';
import Image from 'next/image';


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

      const updateUser = { ...user, password: passwords.password, changingPassword: false, passwordResetTokenExpires: null, emailToken: null, verifiedCredentials: true };

      setIsLoading(true)
      await axios.put(`/api/userToken/${user.emailToken}`, updateUser)
      setSuccess("Password changed successfully.")
         setTimeout(() => {
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
        <Image id="hiking-image" src="/hiking-4.jpg" alt="hiking" width={0} height={0} sizes="100vw" style={{ width: '100%', height: '100%', objectFit: "cover" }} /> 
        <Image id="logo" onClick={() => router.push('/login')} src="/logo.png" alt="logo" width={110} height={70} style={{ position: "absolute", top: "16px", left: '35px' }}/> 
      </div>

    <div className="new-password-content">
    <Image id="logo-mobile-login" src="/logo.png" alt="logo" width={90} height={58} style={{ position: "absolute", top: "25px", left: '25px' }}/> 
    <div className='login-form'  style={{backgroundColor: theme.palette.mode === "dark" ? "rgba(30, 30, 30, 0.9)" : null}}>
    <h1 className='login-text'>Reset password</h1>
    <Typography component="span" variant="span" mb={3} width="100%" color="gray">
          Enter the email address you used to create the account, and we will email you instructions to reset your password
    </Typography>
    <form onSubmit={handleSubmit}>

    <Grid container spacing={2}>
    <Grid item xs={12}>
    <TextField type="password" sx={{width: "100%"}} required inputProps={{minLength : 8}} label="New Password" name="password" onChange={handleChange} />
    </Grid>
    <Grid item xs={12}>
    <TextField type="password" sx={{width: "100%"}} required inputProps={{minLength : 8}} label="Confirm New Password" name="confirmPassword" onChange={handleChange}  />
    </Grid>
    <Grid item xs={12}>
      
    <Btn text="Reset Password" type={"submit"} isLoading={isLoading} variant={"contained"} />

    </Grid>

    <Typography component="span" variant="span" width="100%" color="gray" mt={1.5} mb={2} ml={2}>Remember password? <Typography onClick={() => router.push("/login")} component="span" variant="span" color="#2d7fb5" sx={{cursor: "pointer"}}>Login</Typography></Typography>
  
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

