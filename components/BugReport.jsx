"use client"; 

import * as React from "react";
import { useState } from "react";
import {
  Stack,
  Box,
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
import SendIcon from '@mui/icons-material/Send';


const BugReport = ({session}) => {
  const theme = useTheme();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)



  const handleSubmit = async (event) => {
    event.preventDefault();

    setSuccess(false)

    const obj = { user: session?.user, title: title, content: content};
    try {

       setLoading(true)
       const response = await axios.post("/api/reportEmail", obj);
       setTitle("");
       setContent("");
       console.log(response)
       setLoading(false)
       setSuccess(true)
    }

    catch(err) {

        setError(err)

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
            Report a Bug
          </Typography>
        </Stack>
        <Typography component="p" variant="body2" mb={2}>
          Use the form below to report any bugs you encounter.
        </Typography>



        <Box sx={{width: "100%"}}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} p={4} borderRadius="7px" backgroundColor={ theme.palette.mode === "dark" ? "#171717" : "#FAFAFA"}>
          <Typography component="h2" variant='h6' mb={3}>Send Us A Message</Typography>
            <TextField
              label="Title"
              variant="outlined"
              required
              sx={{background: theme.palette.mode === "dark" ? "#1E1E1E" : "white"}}
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          
            <TextField
              label="Content"
              variant="outlined"
              fullWidth
              required
              sx={{background: theme.palette.mode === "dark" ? "#1E1E1E" : "white"}}
              multiline
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
           
            <Button type="submit" variant="contained" color="primary" disableElevation sx={{padding: "12px"}}>
              Send {loading ?  <CircularProgress color="inherit" size={16} sx={{marginLeft: "10px"}} /> : <SendIcon sx={{fontSize: "16px", marginLeft: "5px"}}/>}
            </Button>
          </Stack>
        </form>

         { success ? <Stack mt={2}> <Alert severity="success">Thank you! Your bug report has been submitted.</Alert></Stack> : null}
         { error ? <Stack mt={2}>  <Alert severity="error">Error! Unable to submit bug report. Please try again later.</Alert></Stack> : null}
        </Box>
      </div>
    </Stack>
  );
};

export default BugReport;
