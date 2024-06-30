"use client"; // Ensures that the component is rendered on the client-side

import * as React from "react";
import { useState } from "react";
import {
  Stack,
  Box,
  Grid,
  IconButton,
  Typography,
  TextField,
  Button,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

const BugReport = () => {
  const theme = useTheme();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission
    console.log("Title:", title);
    console.log("Content:", content);
    // Reset form fields
    setTitle("");
    setContent("");
  };

  return (
    <Stack
      display={theme.flexBox}
      justifyContent={theme.start}
      width={theme.fullWidth}
      minHeight="100vh"
      p={2}
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
            
            
            <Grid>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
           
            />
            </Grid>
            <Grid>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={title}
             
              onChange={(e) => setTitle(e.target.value)}
            />
            </Grid>

            <Grid>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            </Grid>

            <Grid>
            <TextField
              label="Content"
              variant="outlined"
              fullWidth
              multiline
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            </Grid>
            <Button type="submit" variant="contained" color="primary" disableElevation>
              Submit
            </Button>
          </Stack>
        </form>
        </Box>
      </div>
    </Stack>
  );
};

export default BugReport;
