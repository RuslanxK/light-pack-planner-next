"use client"; // Ensures that the component is rendered on the client-side

import * as React from "react";
import { useState, useRef } from "react";
import {
  Stack,
  IconButton,
  Typography,
  TextField,
  Button,
  useTheme,
  Alert
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';


const AdminSettings = () => {

  const theme = useTheme();
  const router = useRouter();
  const formRef = useRef(null);


  const [articleData, setArticleData] = useState({})
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)




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

      setError(error.response.data)
   }
}


const handleChange = (event) => {

  setError("")
  setSuccess("")
  const { name, value } = event.target;
  setArticleData({ ...articleData, [name]: value });
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
        <Stack direction="row" alignItems="center" mb={2}>
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
        <Typography component="p" variant="body2" mb={4} color="gray">
          Use the forms below to add new content for users.
        </Typography>

         
<form onSubmit={addArticle} ref={formRef}>
<Stack mr={5} p={4} mb={5} borderRadius="7px" boxShadow={theme.boxShadow}>
<Typography component="h2" variant='h6' mb={3}>Upload Article</Typography>
<input required type='file' name='image' style={{width: "fit-content"}} onChange={handleFileChange} />
<TextField required type='text' name='title' label="title" sx={{marginTop: "15px"}} onChange={handleChange} />
<TextField required multiline rows={8} name='description' label="description" sx={{marginTop: "15px"}} onChange={handleChange} />
<Button type='submit' variant="contained" sx={{marginTop: "15px", padding: "15px"}} disableElevation>Add article {loading &&  <CircularProgress color="inherit" size={16} sx={{ marginLeft: "10px" }} /> }</Button>

{ error ? <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert> : null }
{ success.length ? <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert> : null }


   </Stack> </form> 

      </div>
    </Stack>
  );
};

export default AdminSettings;
