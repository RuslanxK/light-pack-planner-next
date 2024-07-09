"use client";

import { useState, Fragment } from "react";
import {
  Typography,
  Stack,
  TextField,
  Container,
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
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import useCountries from "./hooks/useCountries";


const Settings = ({ session, user }) => {
  const theme = useTheme();
  const router = useRouter();

  const profileImageUrl = session?.user?.profileImageKey
    ? `${process.env.NEXT_PUBLIC_PROFILE_URL}/${session?.user?.profileImageKey}`
    : null;

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
  });
  const [savedMessage, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isHover, setIsHover] = useState(false);
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
    setLoading(true);
    try {
      const updatedDetails = { ...userDetails };
      if (userDetails.image && userDetails.image instanceof File) {
        const formData = new FormData();
        formData.append("file", userDetails.image);
        const uploadResponse = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        updatedDetails.image = uploadResponse.data.url;
      }
      await axios.put(`/api/user/${session?.user.id}`, updatedDetails);
      router.refresh();
      setMessage("Saved successfully!");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.log(err);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
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
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          component="label"
          sx={{
            width: "120px",
            height: "120px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 1,
            borderRadius: "100px",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          {userDetails.image ? (
            <Fragment>
              <img
                src={URL.createObjectURL(userDetails.image)}
                alt="Profile"
                width="100%"
                height="100%"
                style={{ objectFit: "cover", borderRadius: "100px" }}
              />
              {isHover && (
                <EditIcon
                  sx={{
                    position: "absolute",
                    fontSize: "25px",
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                />
              )}
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
              {isHover && (
                <EditIcon
                  sx={{
                    position: "absolute",
                    fontSize: "25px",
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                />
              )}
            </Fragment>
          ) : (
            <Fragment>
              <AddPhotoAlternateIcon
                sx={{ fontSize: "2.5rem", color: "#9e9e9e" }}
              />
              <Typography variant="body2" sx={{ color: "#9e9e9e" }}>
                Upload Photo
              </Typography>
            </Fragment>
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
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
              <MenuItem value="g">g</MenuItem>
              <MenuItem value="oz">oz</MenuItem>
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
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
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
        </Grid>


        <Button
          variant="contained"
          disableElevation
          onClick={saveDetails}
          disabled={loading}
          sx={{width: "100%", padding: "12px"}}
          
        >
          Save {loading ? <CircularProgress color="inherit" size={16} sx={{ marginLeft: "10px" }} /> : null }
        </Button>


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
