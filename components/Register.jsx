"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@emotion/react";
import { Stack, TextField, Typography, Button, Select, MenuItem, InputLabel, FormControl, Grid, CircularProgress, Alert, useMediaQuery } from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers-pro";
import { DemoContainer, DemoItem  } from '@mui/x-date-pickers/internals/demo';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';


const Register = () => {
  const [registerData, setRegisterData] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const theme = useTheme();
  const router = useRouter();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFileChange = (event) => {
    const { name } = event.target;
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setRegisterData({ ...registerData, [name]: selectedFile });
      setError("");
      setSuccess("");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRegisterData({ ...registerData, [name]: value });
    setError("");
    setSuccess("");
  };

  const handleDateChange = (date, fieldName) => {
    setRegisterData((prevData) => ({
      ...prevData,
      [fieldName]: date,
    }));
  };

  const register = async (e) => {
    e.preventDefault();

    if (!registerData.image || !(registerData.image instanceof File)) {
      setError("Profile picture is required.");
      return;
    }

    if (registerData.image && registerData.image.size > 2 * 1024 * 1024) {
      setError("File size exceeds the maximum limit of 2 MB.");
      return;
    }

    try {
      setIsLoading(true);

      const data = await axios.post("/api/register", registerData);

      const awsUrl = data.data.signedUrl;

      await fetch(awsUrl, {
        method: "PUT",
        body: registerData.image,
        headers: {
          "Content-Type": registerData.image.type,
        },
      });

      const sendTo = { email: registerData.email, id: data.data.User._id };

      await axios.post("/api/emailVerify", sendTo);
      setSuccess(
        "Account created successfully. Please check your email to verify your account."
      );
      setIsLoading(false);
    } catch (error) {
      console.log(error);

      setIsLoading(false);
      setError(error?.response?.data);
    }
  };

  return (
    <Stack
      display={theme.flexBox}
      direction="row"
      justifyContent={theme.end}
      sx={{ overflowY: "hidden" }}
    >
      <div className="login-img">
        <img
          id="hiking-image"
          src="/hiking-2.jpg"
          alt="hiking"
          width="100%"
          style={{ objectFit: "cover", height: "100vh" }}
        />
        <img
          id="logo"
          onClick={() => router.push("/login")}
          src="/logo.png"
          alt="logo"
          width="110px"
          height="70"
          style={{ position: "absolute", top: "16px", left: "35px" }}
        />
      </div>

      <div className="register-content">
        <img
          id="logo-mobile-login"
          src="/logo.png"
          alt="logo"
          width="90px"
          height="58"
          style={{ position: "absolute", top: "25px", left: "25px" }}
        />
        <div className="register-form">
          <form onSubmit={register}>
            <Stack
              display={theme.flexBox}
              direction="row"
              justifyContent="space-between"
              alignItems="stretch"
              mb={2}
              width="100%"
            >
              <Stack direction="column" alignItems="flex-start">
                <Typography component="h1" variant="h1" fontSize="30px" fontWeight={600} mb={0.5}>
                  Register
                </Typography>
                <Typography component="span" variant="body1" color="gray">
                  Welcome! Create your free account.
                </Typography>
              </Stack>
            </Stack>

            <div className="register-image-upload">
              <Button
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                component="label"
                role={undefined}
                variant="outlined"
                sx={{
                  width: "100%",
                  height: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "12px",
                  backgroundColor: "#f5f5f5",
                  border: "2px dashed #c4c4c4",
                  transition: "background-color 0.3s, border-color 0.3s",
                  '&:hover': {
                    backgroundColor: "#e0e0e0",
                    borderColor: "#a4a4a4",
                  },
                }}
              >
                {registerData.image ? (
                  <Fragment>
                    <img
                      width="100%"
                      height="100%"
                      style={{ objectFit: "contain" }}
                      src={URL.createObjectURL(registerData.image)}
                    />
                    {isHover ? (
                      <EditIcon
                        sx={{
                          position: "absolute",
                          fill: "rgba(255, 255, 255, 0.7)",
                          fontSize: "2.5rem",
                        }}
                      />
                    ) : null}
                  </Fragment>
                ) : (
                  <Fragment>
                    <AddPhotoAlternateIcon sx={{ fontSize: "2.5em", color: "#9e9e9e" }} />
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: "#9e9e9e" }}
                    >
                      Upload Profile
                    </Typography>
                  </Fragment>
                )}

                <input
                  type="file"
                  name="image"
                  style={{ display: "none" }}
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                />
              </Button>
            </div>

            <Grid container spacing={2}>
              <Grid item xs={isMobile ? 12 : 6}>
                <TextField
                  required
                  type="text"
                
                  label="Username"
                  name="username"
                  onChange={handleChange}
                  fullWidth
                  sx={{ borderRadius: "7px" }}
                />
              </Grid>
              <Grid item xs={isMobile ? 12 : 6}>
                <TextField
                  required
                  type="email"
                 
                  label="Email"
                  name="email"
                  onChange={handleChange}
                  fullWidth
                  sx={{ borderRadius: "7px" }}
                  InputProps={{ style: { border: "2px" } }}
                />
              </Grid>
              <Grid item xs={isMobile ? 12 : 6}>
                <TextField
                  required
                  inputProps={{ minLength: 10 }}
                  type="password"
                  label="Password"
                
                  name="password"
                  onChange={handleChange}
                  fullWidth
                  sx={{ borderRadius: "7px" }}
                />
              </Grid>
              <Grid item xs={isMobile ? 12 : 6}>
                <TextField
                  required
                  inputProps={{ minLength: 10 }}
                  type="password"
                  label="Repeat password"
                
                  name="repeatedPassword"
                  onChange={handleChange}
                  fullWidth
                  sx={{ borderRadius: "7px" }}
                />
              </Grid>

              <Grid item xs={isMobile ? 12 : 4}>
                <FormControl fullWidth>
                  <InputLabel
                    id="weight-unit-label"
                    sx={{ zIndex: 1 }}
                  >
                    Weight Unit
                  </InputLabel>
                  <Select
                    labelId="weight-unit-label"
                    id="weight-unit"
                    name="weightOption"
                   
                    value={registerData.weightOption || ""}
                    onChange={handleChange}
                    sx={{ zIndex: 0 }}
                  >
                    <MenuItem value="lb">lb</MenuItem>
                    <MenuItem value="oz">oz</MenuItem>
                    <MenuItem value="g">g</MenuItem>
                    <MenuItem value="kg">kg</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={isMobile ? 12 : 4}>
                <FormControl fullWidth>
                  <InputLabel
                    id="distance-unit-label"
                    sx={{ zIndex: 1 }}
                  >
                    Distance Unit
                  </InputLabel>
                  <Select
                    labelId="distance-unit-label"
                    id="distance-unit"
                    name="distance"
                   
                    value={registerData.distance || ""}
                    onChange={handleChange}
                    sx={{ zIndex: 0 }}
                  >
                    <MenuItem value="km">km</MenuItem>
                    <MenuItem value="miles">miles</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={isMobile ? 12 : 4}>
                <FormControl fullWidth>
                  <InputLabel
                    id="gender-label"
                    sx={{ zIndex: 1 }}
                  >
                    Gender
                  </InputLabel>
                  <Select
                    labelId="gender-label"
                    id="gender"
                    name="gender"
                  
                    optional
                    value={registerData.gender || ""}
                    onChange={handleChange}
                    sx={{ zIndex: 0 }}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={isMobile ? 12 : 4}>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoItem components={['DatePicker']} sx={{ m: 0, pt: 0 }}>
                      <MobileDatePicker
                        label="Birthdate"
                        name="birthdate"
                        onChange={(date) => handleDateChange(date, "birthdate")}
                        value={registerData.birthdate || null}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            fullWidth 
                            sx={{ m: 0, p: 0, '& .MuiInputLabel-root': { zIndex: 999 } }} 
                          />
                        )}
                      />
                    </DemoItem>
                  </LocalizationProvider>
                </FormControl>
              </Grid>

              <Grid item xs={isMobile ? 12 : 4}>
                <FormControl fullWidth>
                  <InputLabel
                    id="activity-level-label"
                    sx={{ zIndex: 1 }}
                  >
                    Activity Level
                  </InputLabel>
                  <Select
                    labelId="activity-level-label"
                    id="activity-level"
                    name="activityLevel"
                   
                    value={registerData.activityLevel || ""}
                    optional
                    onChange={handleChange}
                    sx={{ zIndex: 0 }}
                  >
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={isMobile ? 12 : 4}>
                <TextField
                  optional
                  type="text"
                  label="Country"
                  
                  name="country"
                  onChange={handleChange}
                  fullWidth
                  sx={{ marginBottom: "15px", borderRadius: "7px" }}
                />
              </Grid>
            </Grid>

            <button
              type="submit"
              className="login-button-regular"
              style={{ display: "flex", justifyContent: "center" }}
            >
              Create Account
              {isLoading ? (
                <CircularProgress
                  color="inherit"
                  size={20}
                  sx={{ marginLeft: "15px" }}
                />
              ) : null}
            </button>
            <Typography
              component="span"
              variant="span"
              width="100%"
              color="gray"
            >
              Already have an account?
              <Typography
                onClick={() => router.push("/login")}
                component="span"
                variant="span"
                color="#2d7fb5"
                ml={0.5}
                sx={{ cursor: "pointer" }}
              >
                Sign in
              </Typography>
            </Typography>

            {error ? <Stack mt={2}><Alert severity="error">{error}</Alert></Stack> : null}
            {success ? <Stack mt={2}><Alert severity="success">{success}</Alert></Stack> : null}
          </form>
        </div>
      </div>
    </Stack>
  );
};

export default Register;
