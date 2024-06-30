"use client"; // Ensures that the component is rendered on the client-side

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
        <Stack direction="row" alignItems="center" mb={2}>
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
        <Typography component="p" variant="body2" mb={4} color="gray">
          Use the form below to report any bugs you encounter.
        </Typography>



        <Box sx={{width: "100%", maxWidth: "800px"}}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            

          
            <TextField
              label="Title"
              variant="outlined"
              required
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          
            <TextField
              label="Content"
              variant="outlined"
              fullWidth
              required
              multiline
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
           
            <Button type="submit" variant="contained" color="primary" disableElevation>
              Submit {loading ?  <CircularProgress color="inherit" size={16} sx={{marginLeft: "10px"}} /> : null}
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
