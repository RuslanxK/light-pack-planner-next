"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@emotion/react";
import {
  Stack,
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  CircularProgress,
  Alert,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import useCountries from "./hooks/useCountries";

const Register = () => {
  const [registerData, setRegisterData] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [step, setStep] = useState(1);

  const theme = useTheme();
  const router = useRouter();

  const { countryNameArr } = useCountries();


  const handleFileChange = (event) => {
    const { name } = event.target;
    const selectedFile = event.target.files[0];
  
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        setError("File size should not exceed 2MB.");
        return;
      }
  
      setRegisterData({ ...registerData, [name]: selectedFile });
      setError("");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRegisterData({ ...registerData, [name]: value });
    setError("");
  };

  const handleDateChange = (date, fieldName) => {
    setRegisterData((prevData) => ({
      ...prevData,
      [fieldName]: date,
    }));
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!registerData.username || !registerData.email) {
        setError("Please fill in all required fields.");
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(registerData.email)) {
        setError("Please enter a valid email address.");
        return;
      }

      try {
        const email = { email: registerData.email };

        setIsLoading(true);

        const response = await axios.post("/api/checkEmail", email);

        setIsLoading(false);

        if (response.status !== 200) {
          setError(response.data.message || "An error occurred.");
          return;
        }
      } catch (error) {
        setError(error.response?.data?.message);
        setIsLoading(false);
        return;
      }
    } else if (step === 2) {
      if (!registerData.password || !registerData.repeatedPassword) {
        setError("Please fill in all required fields.");
        return;
      }
      if (registerData.password !== registerData.repeatedPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (
        registerData.password.length < 8 ||
        registerData.repeatedPassword.length < 8
      ) {
        setError("Password must be at least 8 characters long.");
        return;
      }
    } 
    setError("");
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };






  const register = async (e) => {
    e.preventDefault();
  
    try {
      setIsLoading(true);
  
      let obj = { ...registerData };
  
      if (!registerData.image) {
        const defaultImageURL = '/default.jpg';
        const defaultImageFile = await fetch(defaultImageURL)
          .then((res) => res.blob())
          .then((blob) => new File([blob], 'default.jpg', { type: 'image/jpg' }));
  
        obj = { ...registerData, image: defaultImageFile };
      }
  
      const data = await axios.post("/api/register", obj);
  
      if (obj.image) {
        const awsUrl = data.data.signedUrl;

        await fetch(awsUrl, {
          method: "PUT",
          body: obj.image,
          headers: {
            "Content-Type": obj.image.type,
          },
        });
      }
  
      const sendTo = { email: registerData.email, id: data.data.User._id };
  
      await axios.post("/api/emailVerify", sendTo);
      localStorage.setItem("registrationSuccess", "true");
  
      router.push("/login");
  
      setIsLoading(false);
    } catch (error) {
      console.error(error);
  
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
        <div
          className="register-form"
          style={{
            backgroundColor:
              theme.palette.mode === "dark" ? "rgba(30, 30, 30, 0.9)" : null,
          }}
        >
          <form onSubmit={register}>
            <Stack
              display={theme.flexBox}
              direction="row"
              justifyContent="space-between"
              alignItems="stretch"
              mb={2}
              width="100%"
            >
              <Stack direction="column" alignItems="flex-start" width="100%">

                <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                <Typography
                  component="h1"
                  variant="h1"
                  fontSize="30px"
                  fontWeight={600}
                  mb={1}
                >
                  Register
                </Typography>

                <Typography component="span" fontSize="14px" variant="body1" color="gray">
                Step {step} of 4
              </Typography>

              </Stack>

                <Typography component="span" variant="body1" color="gray">
                  Welcome! Create your free account.
                </Typography>
              </Stack>
            
            </Stack>

            {step === 1 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    type="text"
                    label="Full name"
                    name="username"
                    value={registerData.username}
                    onChange={handleChange}
                    fullWidth
                    sx={{ borderRadius: "7px" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    type="email"
                    label="Email"
                    value={registerData.email}
                    name="email"
                    onChange={handleChange}
                    fullWidth
                    sx={{ borderRadius: "7px" }}
                    InputProps={{ style: { border: "2px" } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    sx={{ padding: "12px" }}
                    disableElevation
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    Next {isLoading ? <CircularProgress color="inherit" size={20} sx={{ marginLeft: "15px" }} /> : null}
                  </Button>
                </Grid>
              </Grid>
            )}

            {step === 2 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    inputProps={{ minLength: 8 }}
                    type="password"
                    label="Password"
                    name="password"
                    value={registerData.password}
                    onChange={handleChange}
                    fullWidth
                    sx={{ borderRadius: "7px" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    inputProps={{ minLength: 8 }}
                    type="password"
                    label="Repeat password"
                    name="repeatedPassword"
                    value={registerData.repeatedPassword}
                    onChange={handleChange}
                    fullWidth
                    sx={{ borderRadius: "7px" }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    sx={{ padding: "12px" }}
                    variant="outlined"
                    color="primary"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ padding: "12px" }}
                    disableElevation
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                </Grid>
              </Grid>
            )}

{step === 3 && (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <Button
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        component="label"
        role={undefined}
        variant="text"
        sx={{
          width: "100%",
          height: "250px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px dashed",
          position: "relative",
          transition: "background-color 0.3s, border-color 0.3s",
          "&:hover": {
            borderColor: "#a4a4a4",
          },
        }}
      >
        {registerData.image ? (
          <Fragment>
            <img
              width="200px"
              height="200px"
              style={{ objectFit: "cover", borderRadius: "100%" }}
              src={URL.createObjectURL(registerData.image)}
              alt="user profile"
            />
            <IconButton 
              sx={{zIndex: 1, position: "absolute"}}
              component="label"
            >
              <EditIcon
                sx={{
                  fontSize: "40px",
                  color: isHover ? "#bfbfbf" : "#f5f5f5",
                  transition: "color 0.3s, background-color 0.3s",
                }}
              />
              <input
                hidden
                type="file"
                name="image"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
              />
            </IconButton>
          </Fragment>
        ) : (
          <Fragment>

            <Stack justifyContent="center" alignItems="center">
            <AddPhotoAlternateIcon
              sx={{
                width: "60px",
                height: "60px",
                color: "#e6e6e6",
                marginBottom: "7px"
               
              }}
            />
            <Typography
              color="gray"
              component="span"
              variant="body2"
            >
              Upload a profile picture
            </Typography>
            </Stack>
          </Fragment>
        )}
        <input
          hidden
          style={{ position: "absolute", zIndex: 9999 }}
          type="file"
          name="image"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
        />
      </Button>
    </Grid>
    <Grid item xs={6}>
      <Button
        fullWidth
        variant="outlined"
        color="primary"
        onClick={handleBack}
        sx={{ padding: "12px" }}
      >
        Back
      </Button>
    </Grid>
    <Grid item xs={6}>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{ padding: "12px" }}
        disableElevation
        onClick={handleNext}
      >
        Next
      </Button>
    </Grid>
  </Grid>
)}


            {step === 4 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="country-label">
                      Select your country
                    </InputLabel>
                    <Select
                      labelId="country-label"
                      label="Select your country"
                      name="country"
                      value={registerData.country || ""}
                      onChange={handleChange}
                     
                    >
                      {countryNameArr.map((country) => (
                        <MenuItem key={country} value={country}>
                          {country}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoItem>
                      <MobileDatePicker
                        label="Date of birth"
                        value={registerData.dob || null}
                        onChange={(date) => handleDateChange(date, "dob")}
                        slotProps={{
                          textField: { fullWidth: true },
                        }}
                      />
                    </DemoItem>
                  </LocalizationProvider>
                </Grid>



                <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
               <InputLabel id="gender-label">Gender</InputLabel>
               <Select
               labelId="gender-label"
               label="Gender"
               name="gender"
               onChange={handleChange}
               value={registerData.gender}>
               <MenuItem value="male">Male</MenuItem>
               <MenuItem value="female">Female</MenuItem>
               </Select>
               </FormControl>
                </Grid>


                <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
               <InputLabel id="distance-label">Distance Unit</InputLabel>
               <Select
               labelId="distance-label"
               label="Distance Unit"
               name="distance"
               onChange={handleChange}
               value={registerData.distance}>
               <MenuItem value="miles">Miles</MenuItem>
               <MenuItem value="km">Kilometers</MenuItem>
               </Select>
               </FormControl>
                </Grid>


                <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
               <InputLabel id="weight-unit-label">Weight Unit</InputLabel>
               <Select
               labelId="weight-unit-label"
               label="Weight Unit"
               name="weightOption"
               onChange={handleChange}
               value={registerData.weightOption}>
               <MenuItem value="lb">lb</MenuItem>
               <MenuItem value="kg">kg</MenuItem>
               </Select>
               </FormControl>
                </Grid>

                <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
               <InputLabel id="activity-level-label">Activity Level</InputLabel>
               <Select
               labelId="activity-level-label"
               label="Activity Level"
               name="activityLevel"
               onChange={handleChange}
               value={registerData.activityLevel}>
               <MenuItem value="beginner">Beginner</MenuItem>
               <MenuItem value="intermediate">Intermediate</MenuItem>
               <MenuItem value="advanced">Advanced</MenuItem>
               </Select>
               </FormControl>
                </Grid>

              
              
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    sx={{padding: "12px"}}
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    sx={{padding: "12px"}}
                    disableElevation
                    color="primary"
                  >
                   Register {isLoading ? <CircularProgress color="inherit" size={20} sx={{ marginLeft: "15px" }} /> : null}
                  </Button>
                </Grid>
              </Grid>
            )}
          </form>

          
          <Stack mt={2}>

<Typography
component="span"
variant="span"
width="100%"
color="gray"
mr={2}

>
Already have an account?
<Typography
onClick={() => router.push("/login")}
component="span"

variant="span"
color="#2d7fb5"
sx={{ cursor: "pointer", marginLeft: "3px" }}
>
Login
</Typography>
</Typography>

</Stack>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </div>
      </div>
    </Stack>
  );
};

export default Register;
