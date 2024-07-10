"use client";

import { useState, Fragment } from "react";
import {
  Typography,
  Stack,
  TextField,
  useTheme,
  Button,
  Select,
  MenuItem,
  Alert,
  IconButton,
  Autocomplete,
  Grid,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import useCountries from "./hooks/useCountries";


const Settings = ({ session, user }) => {
  const theme = useTheme();
  const router = useRouter();

   

  const profileImageUrl = session?.user?.profileImageKey ? `${process.env.NEXT_PUBLIC_PROFILE_URL}/${session?.user?.profileImageKey}` : null;

  const [userDetails, setUserDetails] = useState({
    username: user.username,
    birthdate: dayjs(user.birthdate),
    weightOption: user.weightOption,
    distance: user.distance,
    gender: user.gender || "",
    activityLevel: user.activityLevel || "",
    country: user.country || "",
    image: null,
    profileImageUrl,
    profileImageKey: session?.user?.profileImageKey,

  });
  const [savedMessage, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { countryNameArr } = useCountries();

  const handleDateChange = (date, fieldName) => {
    setError(null);
    setMessage(null);
    setUserDetails((prevData) => ({
      ...prevData,
      [fieldName]: date,
    }));
  };

  const handleChange = (event) => {
    setError(null);
    setMessage(null);
    let { name, value } = event.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleFileChange = (event) => {
    const { name } = event.target;
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setUserDetails({
        ...userDetails,
        [name]: selectedFile,
        profileImageUrl: null,
      });
      setError("");
      setMessage("");
    }
  };


  const saveDetails = async () => {

    try {

      setLoading(true);

      const { image, profileImageUrl, ...updatedDetails } = userDetails;
  
       const response = await axios.put(`/api/user/${session?.user.id}`, updatedDetails);

        const url = response.data.signedUrl

      if(userDetails.image) {

        await fetch(url, {
          method: "PUT",
          body: userDetails.image,
          headers: {
            "Content-Type": userDetails.image.type,
          },
        });
      }

      setMessage("Saved successfully!");

      setTimeout(() => {

        if(userDetails.image) {
          window.location.reload()
      }

      setLoading(false)
      
      }, 2000);


    } catch (err) {
      console.log(err);
      setError("Something went wrong.");
    } 
  };


  return (

    <Stack
      display={theme.flexBox}
      justifyContent={theme.start}
      width={theme.fullWidth}
      minHeight="100vh"
      mb={3}
    >
      <div className="main-info">
        <Stack direction="row" alignItems="center">
          <IconButton
            sx={{ marginRight: "5px" }}
            onClick={() => router.push("/")}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography component="h2" variant="h6">
            Settings
          </Typography>
        </Stack>

        <Typography component="p" variant="body2" mb={3} color="gray">
          Update your personal data and preferences using the inputs below.
        </Typography>

        <Button
      component="label"
      sx={{
        width: "120px",
        height: "120px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "100px",
        marginTop: "20px",
        marginBottom: "20px",
        position: "relative", 
      }}
    >
      {session.user.image ? (
        <Fragment>
          <img
            src={session.user.image}
            alt="Profile"
            width="100%"
            height="100%"
            style={{ objectFit: "cover", borderRadius: "100px" }}
          />
          
        </Fragment>
      ) : userDetails.profileImageUrl ? (
        <Fragment>
          <img
            src={userDetails.profileImageUrl}
            alt="Profile"
            width="100%"
            height="100%"
            style={{ objectFit: "cover", borderRadius: "100px" }}
          />
          <EditIcon
            sx={{
              position: "absolute",
              bottom: 0,
              background: "gray",
              borderRadius: "100px",
              padding: "4px",
              fontSize: "20px",
              color: "rgba(255,255, 255, 0.7)",
            }}
          />
        </Fragment>
      ) : (
        <Fragment>
          <img
            src={URL.createObjectURL(userDetails.image)}
            alt="Profile"
            width="100%"
            height="100%"
            style={{ objectFit: "cover", borderRadius: "100px" }}
          />
          <EditIcon
            sx={{
              position: "absolute",
              fontSize: "25px",
              color: "rgba(255, 255, 255, 0.7)",
            }}
          />
        </Fragment>
      )}
     { session.user.image ? null : <input
        type="file"
        name="image"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />}
    </Button>


        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Full Name
            </Typography>
            <TextField
              sx={{ "& .MuiOutlinedInput-root": {background: theme.palette.mode === "dark" ? "#171717": "#fafafa"}}}
              type="text"
              fullWidth
              onChange={handleChange}
              name="username"
              value={userDetails.username}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Email
            </Typography>
            <TextField
              type="text"
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": {background: theme.palette.mode === "dark" ? "#171717": "#fafafa"}}}
              disabled
              value={session?.user?.email}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Weight Unit
            </Typography>
            <Select
              fullWidth
              name="weightOption"
              sx={{ backgroundColor: theme.palette.mode === "dark" ? "#171717": "#fafafa"}}
              onChange={handleChange}
              value={userDetails.weightOption}
            >
              <MenuItem value="kg">kg</MenuItem>
              <MenuItem value="lb">lb</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Distance Unit
            </Typography>
            <Select
              fullWidth
              sx={{ backgroundColor: theme.palette.mode === "dark" ? "#171717": "#fafafa"}}
              name="distance"
              onChange={handleChange}
              value={userDetails.distance}>
              <MenuItem value="miles">Miles</MenuItem>
              <MenuItem value="km">Kilometers</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Birthdate
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
              
                name="birthdate"
                onChange={(date) => handleDateChange(date, "birthdate")}
                sx={{ width: "100%" ,"& .MuiOutlinedInput-root": {background: theme.palette.mode === "dark" ? "#171717": "#fafafa"}}}
                value={userDetails.birthdate || null}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Gender
            </Typography>
            <Select
              fullWidth
              name="gender"
              sx={{ backgroundColor: theme.palette.mode === "dark" ? "#171717": "#fafafa"}}
              onChange={handleChange}
              value={userDetails.gender}
            >
              <MenuItem value="Please choose an option">Please choose an option</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Activity Level
            </Typography>
            <Select
              fullWidth
              name="activityLevel"
              onChange={handleChange}
              sx={{ backgroundColor: theme.palette.mode === "dark" ? "#171717": "#fafafa"}}
              value={userDetails.activityLevel}
            >
              <MenuItem value="Please choose an option">Please choose an option</MenuItem>
              <MenuItem value="beginner">Beginner</MenuItem>
               <MenuItem value="intermediate">Intermediate</MenuItem>
               <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Country
            </Typography>
            <Autocomplete
              disablePortal
              id="country"
              name="country"
              sx={{ "& .MuiOutlinedInput-root": {background: theme.palette.mode === "dark" ? "#171717": "#fafafa"}}}
              options={countryNameArr}
              onChange={(event, newValue) => {
                setUserDetails((prevData) => ({
                  ...prevData,
                  country: newValue,
                }));
              }}
              value={userDetails.country || ""}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>

        <Grid item xs={12} sm={1}>
        <Button
          variant="contained"
          disableElevation
          onClick={saveDetails}
          disabled={loading}
          sx={{ padding: "8px", width: "100%", marginTop: "10px"}}>
          Save {loading ? <CircularProgress color="inherit" size={16} sx={{ marginLeft: "10px" }} /> : null }
        </Button>

       </Grid>
          
        </Grid>

      

        {savedMessage && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {savedMessage}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}


      </div>
    </Stack>
  );
};

export default Settings;
