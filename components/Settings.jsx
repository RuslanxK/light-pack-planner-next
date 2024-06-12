"use client"

import { Typography, Stack, TextField, Container, useTheme, Button, Select, MenuItem, Alert, IconButton} from '@mui/material'
import { useState, useTransition } from 'react';
import Divider from '@mui/material/Divider';
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Settings = ({session, user}) => {
  

    const theme = useTheme()
    const router = useRouter();

    const [isTransitionStarted, startTransition] = useTransition();
    const [userDetails, setUserDetails] = useState({username: user.username, birthdate: dayjs(user.birthdate), weightOption: user.weightOption, distance: user.distance})
    const [savedMessage, setSavedMessage] = useState(null)
    const [error, setError] = useState(null)
    


   

    const handleDateChange = (date, fieldName) => {

      setError(null)
      setSavedMessage(null)

      setUserDetails((prevData) => ({
        ...prevData,
        [fieldName]: date,
      }));
    };


    const handleChange = (event) => {
      
      setError(null)
      setSavedMessage(null)

      let { name, value } = event.target;
      setUserDetails({ ...userDetails, [name]: value });
    };
  



    const saveDetails = async () => {

        try {
         await axios.put(`/api/user/${session?.user.id}`, userDetails)
         startTransition(router.refresh)
         setSavedMessage("Saved successfully!")

         setTimeout(() => {
          
          setSavedMessage("")

         }, 3000);

        }

        catch(err) {
            console.log(err)
            setError("Something went wrong.")
        }
    }

   

  return (

    <Container sx={{display: theme.flexBox}} maxWidth={false} disableGutters>

     <Stack display={theme.flexBox} justifyContent={theme.start} width={theme.fullWidth} minHeight="100vh">

     <Stack alignItems="flex-start" m={2}><IconButton onClick={() => router.push('/')}><ArrowBackIcon /></IconButton></Stack>


     <div className="main-info">

    <Typography component="h2" variant="h6" mb={0.5}>
      Settings
    </Typography>
    <Typography component="p" variant="p" mb={4} color="gray">
       Update your details here.
    </Typography>

     <Divider light />

     <Stack flexDirection="row" alignItems="flex-start" mt={3} mb={4}>

     <Stack mr={9.5}>
     <Typography component="span" variant="span" fontWeight="600" mb={0.5}>
      Username
    </Typography>

    </Stack>
        <TextField  type='text' onChange={handleChange} size='small' name='username' value={userDetails.username} sx={{marginTop: "5px", width: "400px"}} InputLabelProps={{ style: { fontSize: 14 }}} />

    </Stack>

    <Divider light  />

    <Stack display="flex" flexDirection="row" pt={3} mb={4}>
    <Stack mr={14.5}>
    <Typography component="span" variant="span" fontWeight="600" mb={0.5}>
      Email
    </Typography>
    
    </Stack>

    <TextField  type='text' size='small' disabled value={session?.user?.email} sx={{marginTop: "5px", width: "400px", '& .MuiOutlinedInput-root': {'& fieldset': {borderColor: "black" },},}} InputLabelProps={{ style: { fontSize: 14 }}} />


    </Stack>

    <Divider light  />



    <Stack display="flex" flexDirection="row" pt={3} mb={4}>
    <Stack mr={8.5}>
    <Typography component="span" variant="span" fontWeight="600" mb={0.5}>
      Weight unit
    </Typography>
    
    </Stack>

    <Select size='small' variant='outlined' name='weightOption' onChange={handleChange} value={userDetails.weightOption}  sx={{width: '10%', marginRight: "15px", fontSize: "13px", boxShadow: "none"}} >  
       <MenuItem sx={{fontSize: "13px"}} value="kg">kg</MenuItem>
       <MenuItem sx={{fontSize: "13px"}} value="lb">lb</MenuItem>
       <MenuItem sx={{fontSize: "13px"}} value="g">g</MenuItem>
       <MenuItem sx={{fontSize: "13px"}} value="oz">oz</MenuItem>
      </Select>


    </Stack>

    <Divider light />


    <Stack display="flex" flexDirection="row" pt={3} mb={4}>
    <Stack mr={11.5}>
    <Typography component="span" variant="span" fontWeight="600" mb={0.5}>
      Distance
    </Typography>
    
    </Stack>

    <Select size='small' variant='outlined' name='distance' onChange={handleChange} value={userDetails.distance}  sx={{width: '10%', marginRight: "15px", fontSize: "13px", boxShadow: "none"}} >  
       <MenuItem sx={{fontSize: "13px"}} value="Miles">Miles</MenuItem>
       <MenuItem sx={{fontSize: "13px"}} value="Km">Km</MenuItem>
      </Select>


    </Stack>

    <Divider light />
    
    
    


    <Stack display="flex" flexDirection="row" pt={3} mb={4}>
    <Stack mr={5}>
    <Typography component="span" variant="span" fontWeight="600" mb={0.5}>
    Your birth date
    </Typography>
    
    </Stack>

    <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                name="birthdate"
                onChange={(date) => handleDateChange(date, "birthdate")}
                value={userDetails.birthdate || null}
               
              />
            </LocalizationProvider>


    </Stack>

    <Button variant='contained' sx={{fontSize: "12px", marginBottom: "20px"}} disableElevation onClick={saveDetails}>{ savedMessage ? <> {savedMessage} <CheckCircleOutlineIcon sx={{marginLeft: "5px", fontSize: "15px"}} /> </> : "Save changes"}</Button>
    
    {error ?  <Alert severity="error" sx={{width: "fit-content"}}>{error}</Alert> : null }

    </div>
  
  
    
    </Stack>
    
    </Container>
  )
}

export default Settings