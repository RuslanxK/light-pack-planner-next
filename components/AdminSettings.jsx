"use client"; 

import * as React from "react";
import { useState, useRef } from "react";
import {
  Stack,
  IconButton,
  Typography,
  TextField,
  Button,
  useTheme,
  Alert,
  Box
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';


const AdminSettings = () => {

  const theme = useTheme();
  const router = useRouter();
  const formRef = useRef(null);
  const formRefChangeLog = useRef(null);


  const [articleData, setArticleData] = useState({})
  const [changelogData, setChangeLogData]= useState({})
  const [error, setError] = useState("")
  const [errorChangeLog, setErrorChangeLog] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [successChangeLog, setSuccessChangeLog] = useState("")
  const [loadingChangeLog, setLoadingChangeLog] = useState(false)




  const addToChangeLog = async (e) => {

      e.preventDefault()


      console.log(changelogData)

      try {
        setLoadingChangeLog(true)
        await axios.post('/api/changelog', changelogData)
        formRefChangeLog.current.reset();
        setSuccessChangeLog("Uploaded successfully!")
        setLoadingChangeLog(false)
  
    }
    
     catch (error) {
  
        setErrorChangeLog(error.message)
     }

  }




  const addArticle = async (e) => {

    e.preventDefault()

    if (articleData.image && articleData.image.size > 2 * 1024 * 1024) {
      setError("File size exceeds the maximum limit of 2 MB.");
      return; 
    }

    try {

      setLoading(true)
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
     setSuccess("Uploaded successfully!")
     setLoading(false)

  }
  
   catch (error) {

      setError(error.message)
   }
}


const handleChange = (event) => {

  setError("")
  setSuccess("")
  const { name, value } = event.target;
  setArticleData({ ...articleData, [name]: value });
};


const handleChangeLog = (event) => {
    setSuccessChangeLog("")
    setErrorChangeLog("")
    const { name, value } = event.target;
    setChangeLogData({ ...changelogData, [name]: value });
  };
  


 const handleFileChange = (event) => {
  const { name } = event.target;
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    setArticleData({ ...articleData, [name]: selectedFile });
    setError("");
    setSuccess("")
  }
};





  return (
    <Stack
      display={theme.flexBox}
      justifyContent={theme.start}
      width={theme.fullWidth}
      minHeight="100vh"
      
    >
      <div className="main-info">
        <Stack direction="row" alignItems="center" mb={1}>
          <IconButton
            sx={{ marginRight: "5px" }}
            onClick={() => router.push("/")}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography component="h2" variant="h6">
            Admin Settings
          </Typography>
        </Stack>
        <Typography component="p" variant="body2" mb={3} color="gray" >
          Use the forms below to add new content for users.
        </Typography>


<Box sx={{width: "100%"}}>
<form onSubmit={addArticle} ref={formRef}>
<Stack  p={4} mb={5} borderRadius="7px" boxShadow="rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;" backgroundColor={ theme.palette.mode === "dark" ? "#171717" : "#FAFAFA"}>
<Typography component="h2" variant='h6' mb={3}>Upload Article</Typography>
<input required type='file' name='image' style={{width: "fit-content"}} onChange={handleFileChange} />
<TextField required type='text' name='title' label="title" sx={{marginTop: "15px", background: theme.palette.mode === "dark" ? "#1E1E1E" : "white"}} onChange={handleChange} />
<TextField required multiline rows={8} name='description' label="description" sx={{marginTop: "15px", background: theme.palette.mode === "dark" ? "#1E1E1E" : "white"}} onChange={handleChange} />
<Button type='submit' variant="contained" sx={{marginTop: "15px", padding: "15px"}} disableElevation>Add article {loading &&  <CircularProgress color="inherit" size={16} sx={{ marginLeft: "10px" }} /> }</Button>

{ error ? <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert> : null }
{ success.length ? <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert> : null }</Stack> </form> 


<form onSubmit={addToChangeLog} ref={formRefChangeLog}>
<Stack p={4} mb={5} borderRadius="7px" boxShadow="rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;" backgroundColor={ theme.palette.mode === "dark" ? "#171717" : "#FAFAFA"}>
<Typography component="h2" variant='h6' mb={1}>Changelog</Typography>
<TextField required type='text' name='title' label="title" sx={{marginTop: "15px", background: theme.palette.mode === "dark" ? "#1E1E1E" : "white"}} onChange={handleChangeLog} />
<TextField required multiline rows={8} name='description' label="description" sx={{marginTop: "15px", background: theme.palette.mode === "dark" ? "#1E1E1E" : "white"}} onChange={handleChangeLog} />
<Button type='submit' variant="contained" sx={{marginTop: "15px", padding: "15px"}} disableElevation>Add last update {loadingChangeLog &&  <CircularProgress color="inherit" size={16} sx={{ marginLeft: "10px" }} /> }</Button>

{ errorChangeLog ? <Alert severity="error" sx={{ mt: 2 }}>{errorChangeLog}</Alert> : null }
{ successChangeLog.length ? <Alert severity="success" sx={{ mt: 2 }}>{successChangeLog}</Alert> : null }</Stack> </form> 

</Box>

      </div>
    </Stack>
  );
};

export default AdminSettings;
