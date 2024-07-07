'use client';

import { useState, Fragment, useEffect } from 'react';
import { Typography, Stack, TextField, Container, useTheme, Button, Select, MenuItem, Alert, IconButton, Autocomplete} from '@mui/material';
import Divider from '@mui/material/Divider';
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import dayjs from "dayjs";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from "@mui/icons-material/Edit";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { DemoItem  } from '@mui/x-date-pickers/internals/demo';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import useCountries from './hooks/useCountries'



const Settings = ({ session, user }) => {
  const theme = useTheme();
  const router = useRouter();

  const profileImageUrl = session?.user?.profileImageKey ? `${process.env.NEXT_PUBLIC_PROFILE_URL}/${session?.user?.profileImageKey}` : null;

  const [userDetails, setUserDetails] = useState({
    username: user.username,
    birthdate: dayjs(user.birthdate),
    weightOption: user.weightOption,
    distance: user.distance,
    gender: user.gender || '',
    activityLevel: user.activityLevel || '',
    country: user.country || '',
    image: null, 
    profileImageUrl 
  });
  const [savedMessage, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isHover, setIsHover] = useState(false);


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
      setUserDetails({ ...userDetails, [name]: selectedFile, profileImageUrl: null });
      setError("");
      setMessage("");
    }
  };

  const saveDetails = async () => {
    try {
      const updatedDetails = { ...userDetails };

      if (userDetails.image && userDetails.image instanceof File) {
        const formData = new FormData();
        formData.append('file', userDetails.image);
        const uploadResponse = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
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
    }
  };

  return (
    <Container sx={{ display: theme.flexBox }} maxWidth={false} disableGutters>
      <Stack display={theme.flexBox} justifyContent={theme.start} width={theme.fullWidth} minHeight="100vh">
        <div className="main-info">
          <Stack direction="row" alignItems="center" mb={1}>
            <IconButton sx={{ marginRight: "5px" }} onClick={() => router.push('/')}>
              <ArrowBackIcon />
            </IconButton>
            <Typography component="h2" variant="h6">
              Settings
            </Typography>
          </Stack>
          <Typography component="p" variant="body2" mb={3} color="gray">

            Update your details here.
          </Typography>

          <Divider light />

          <Stack flexDirection="row" alignItems="flex-start" mt={3} mb={4}>
            <Stack mr={9.5}>
              <Typography component="span" variant="span" fontWeight="600" mb={0.5} sx={{ fontSize: "14px" }}>
                Full name
              </Typography>
            </Stack>
            <TextField
              type='text'
              inputProps={{ style: { fontSize: 14 } }}
              onChange={handleChange}
              size='small'
              name='username'
              value={userDetails.username}
            />
          </Stack>

          <Divider light />

          <Stack flexDirection="row" alignItems="center" mb={4}>
            <Stack mr={9.5}>
              <Typography component="span" variant="span" fontWeight="600" mb={0.5} sx={{ fontSize: "13px" }}>
                Profile Picture
              </Typography>
            </Stack>
            <Button
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
              component="label"
              role={undefined}
              variant="outlined"
              sx={{
                width: "200px",
                marginTop: "15px",
                height: "120px",
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
              {userDetails.image ? (
                <Fragment>
                  <img
                    width="100%"
                    height="100%"
                    style={{ objectFit: "contain" }}
                    src={URL.createObjectURL(userDetails.image)}
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
                userDetails.profileImageUrl ? (
                  <Fragment>
                    <img
                      width="100%"
                      height="100%"
                      style={{ objectFit: "contain" }}
                      src={userDetails.profileImageUrl}
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
                      Upload Photo
                    </Typography>
                  </Fragment>
                )
              )}
              <input
                type="file"
                name="image"
                style={{ display: "none" }}
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
              />
            </Button>
          </Stack>

          <Divider light />

          <Stack display="flex" flexDirection="row" pt={3} mb={4}>
            <Stack mr={14.5}>
              <Typography component="span" variant="span" fontWeight="600" mb={0.5} sx={{ fontSize: "14px" }}>
                Email
              </Typography>
            </Stack>
            <TextField
              type='text'
              size='small'
              inputProps={{ style: { fontSize: 14 } }}
              disabled
              value={session?.user?.email}
              sx={{ width: "400px", fontSize: "13px", '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: "black" }, }, }}
            />
          </Stack>

          <Divider light />

          <Stack display="flex" flexDirection="row" pt={3} mb={4}>
            <Stack mr={8.5}>
              <Typography component="span" variant="span" fontWeight="600" mb={0.5} sx={{ fontSize: "14px" }}>
                Weight unit
              </Typography>
            </Stack>
            <Select
              size='small'
              variant='outlined'
              name='weightOption'
              onChange={handleChange}
              value={userDetails.weightOption}
              sx={{ width: '10%', marginRight: "15px", fontSize: "13px", boxShadow: "none" }}
            >
              <MenuItem sx={{ fontSize: "13px" }} value="kg">kg</MenuItem>
              <MenuItem sx={{ fontSize: "13px" }} value="lb">lb</MenuItem>
              <MenuItem sx={{ fontSize: "13px" }} value="g">g</MenuItem>
              <MenuItem sx={{ fontSize: "13px" }} value="oz">oz</MenuItem>
            </Select>
          </Stack>

          <Divider light />

          <Stack display="flex" flexDirection="row" pt={3} mb={4}>
            <Stack mr={11.5}>
              <Typography component="span" variant="span" fontWeight="600" mb={0.5} sx={{ fontSize: "14px" }}>
                Distance unit
              </Typography>
            </Stack>

            <Select
              size='small'
              variant='outlined'
              name='distance'
              onChange={handleChange}
              value={userDetails.distance}
              sx={{ width: '10%', marginRight: "15px", fontSize: "13px", boxShadow: "none" }}
            >
              <MenuItem sx={{ fontSize: "13px" }} value="miles">Miles</MenuItem>
              <MenuItem sx={{ fontSize: "13px" }} value="km">Kilometers</MenuItem>
             
            </Select>

          </Stack>

          <Divider light />

          <Stack display="flex" flexDirection="row" pt={3} mb={4}>
            <Stack mr={9.5}>
              <Typography component="span" variant="span" fontWeight="600" mb={0.5} sx={{ fontSize: "14px" }}>
                Birthdate
              </Typography>
            </Stack>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoItem components={['DatePicker']} sx={{ m: 0, pt: 0 }}>
                      <MobileDatePicker
                        label="Birthdate"
                        name="birthdate"
                        onChange={(date) => handleDateChange(date, "birthdate")}
                        value={userDetails.birthdate || null}
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
          </Stack>

          <Divider light />

          <Stack display="flex" flexDirection="row" pt={3} mb={4}>
            <Stack mr={9.5}>
              <Typography component="span" variant="span" fontWeight="600" mb={0.5} sx={{ fontSize: "14px" }}>
                Gender
              </Typography>
            </Stack>
            <Select
              size='small'
              variant='outlined'
              name='gender'
              onChange={handleChange}
              value={userDetails.gender}
              sx={{ width: '10%', marginRight: "15px", fontSize: "13px", boxShadow: "none" }}
            >
              <MenuItem sx={{ fontSize: "13px" }} value="male">Male</MenuItem>
              <MenuItem sx={{ fontSize: "13px" }} value="female">Female</MenuItem>
              <MenuItem sx={{ fontSize: "13px" }} value="other">Other</MenuItem>
            </Select>
          </Stack>

          <Divider light />

          <Stack display="flex" flexDirection="row" pt={3} mb={4}>
            <Stack mr={9.5}>
              <Typography component="span" variant="span" fontWeight="600" mb={0.5} sx={{ fontSize: "14px" }}>
                Activity Level
              </Typography>
            </Stack>
            <Select
              size='small'
              variant='outlined'
              name='activityLevel'
              onChange={handleChange}
              value={userDetails.activityLevel}
              sx={{ marginRight: "15px", fontSize: "13px", boxShadow: "none" }}
            >
              <MenuItem sx={{ fontSize: "13px" }} value="beginner">Beginner</MenuItem>
              <MenuItem sx={{ fontSize: "13px" }} value="intermediate">Intermediate</MenuItem>
              <MenuItem sx={{ fontSize: "13px" }} value="advanced">Advanced</MenuItem>
            </Select>
          </Stack>

          <Divider light />

          <Stack display="flex" flexDirection="row" pt={3} mb={4}>
            <Stack mr={9.5}>
              <Typography component="span" variant="span" fontWeight="600" mb={0.5} sx={{ fontSize: "14px" }}>
                Country
              </Typography>
            </Stack>
          

                   <Autocomplete
                    onChange={(event, newValue) => setUserDetails((prevData) => ({...prevData, country: newValue}))}
                    options={countryNameArr || []}
                    value={userDetails.country}
                    renderInput={(params) => (
                      <TextField {...params} label="Your Country" />
                    )}
                    sx={{ width: "100%" }}
                  />
          </Stack>

          <Divider light />

          {error && (
            <Alert severity="error" sx={{ width: "500px", marginBottom: "16px" }}>
              {error}
            </Alert>
          )}

          <Stack mt={4} display={theme.flexBox} justifyContent={theme.start} width="fit-content">
            <Button
              onClick={saveDetails}
              variant="contained"
              color="primary"
              sx={{
                fontWeight: 600,
                borderRadius: '8px',
                padding: "6px 12px",
                fontSize: "0.8rem",
                textTransform: "capitalize"
              }}
            >
              {savedMessage ? savedMessage : "Save"}
            </Button>
          </Stack>
        </div>
      </Stack>
    </Container>
  );
};

export default Settings;
