"use client";

import {
  Stack,
  Typography,
  IconButton,
  Autocomplete,
  Button,
  Box,
  Tooltip,
  TextField,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";
import Trip from "./Trip";
import axios from "axios";
import { useRouter } from "next/navigation";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import { useTheme } from "@emotion/react";
import MonitorWeightOutlinedIcon from "@mui/icons-material/MonitorWeightOutlined";
import HorizontalSplitOutlinedIcon from "@mui/icons-material/HorizontalSplitOutlined";
import DataUsageOutlinedIcon from "@mui/icons-material/DataUsageOutlined";
import LatestBagStack from "../components/custom/LatestBackStack";
import CloseIcon from "@mui/icons-material/Close";
import MuiPopup from "./custom/MuiPopup";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { useState, useMemo, useRef } from "react";
import useRefresh from "./hooks/useRefresh";
import useCountries from './hooks/useCountries'


const Trips = ({ trips, bags, session }) => {

  const theme = useTheme();
  const router = useRouter();

  const { countryNameArr } = useCountries();


  const [isPopupOpen, setPopupOpen] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);

  const { refresh } = useRefresh();

  const nameRef = useRef();
  const distanceRef = useRef();
  const aboutRef = useRef();
  const startDateRef = useRef(dayjs().add(1, "day"));
  const endDateRef = useRef(dayjs().add(2, "day"));


  const filteredTrips = useMemo(() => {
    return trips?.tripsWithPictures
      .filter((trip) =>
        trip.name.toLowerCase().includes(searchInput.toLowerCase())
      )
      .sort((a, b) => {
        const aStartDate = new Date(a.startDate);
        const bStartDate = new Date(b.startDate);
        const aEndDate = new Date(a.endDate);
        const bEndDate = new Date(b.endDate);
        if (aStartDate < bStartDate) return 1;
        if (aStartDate > bStartDate) return -1;
        if (aEndDate < bEndDate) return 1;
        if (aEndDate > bEndDate) return -1;
        return 0;
      })
      .map((trip) => <Trip key={trip._id} tripData={trip} />);
  }, [trips, searchInput]);


  const itemsTotal = trips?.totalItems?.reduce((acc, item) => acc + item.qty,0);

 

  const createTrip = async (e) => {
   
    e.preventDefault()

    if (loading) return;

    try {
      setLoading(true);

      const newTripData = {
        startDate: startDateRef.current,
        endDate: endDateRef.current,
        name: nameRef.current.value,
        distance: distanceRef.current.value,
        about: aboutRef.current.value,
        userId: session?.user?.id,
      };

     
      await axios.post(`/api/trips/new`, newTripData);
      await refresh();
      e.target.reset()

      setPopupOpen(false);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };




  const navigateToLatestBag = () => {
    localStorage.setItem("tripId", trips?.latestBag.tripId);
    localStorage.setItem("bagId", trips?.latestBag._id);
    router.push(`bag?id=${trips?.latestBag._id}`);
  };

  const openPopup = () => setPopupOpen(true);

  const closePopup = () => {
    setPopupOpen(false);
    setLoading(false);
  };

  

  return (
    <Box width="100%">
      <Stack
        display={theme.flexBox}
        justifyContent={theme.start}
        width={theme.trips.width}
        pb={5}
        minHeight="100vh"
      >
        <div className="main-info">
          <div className="search-content">
            <Stack width="100%" mb={1}>
              <Typography
                component="h2"
                fontWeight="600"
                variant="span"
                fontSize="20px"
                mb={0.5}
              >
                Welcome, { session.user.isAdmin ?  "Admin" + " " + session.user.username.split(" ")[0] :  session.user.username.split(" ")[0] }
              </Typography>
              <Typography component="p" variant="p" mb={2.5}>
                The journey of a thousand miles begins with a single step.
              </Typography>
              <Typography
                component="h3"
                variant="span"
                fontWeight="500"
                mb={0.5}
              >
                My last planned trips
              </Typography>
              <Typography component="p" variant="p">
                Seamless Trip Planning and Bag Organization Made Simple.
              </Typography>
            </Stack>

            {trips?.tripsWithPictures.length ? (
              <Stack width="100%">
                <TextField
                  label="Search"
                  variant="filled"
                  fullWidth
                  size="small"
                  InputLabelProps={{ style: { fontSize: 14 } }}
                  InputProps={{ disableUnderline: true }}
                  inputProps={{ style: { fontSize: 14 } }}
                  sx={{ fontSize: "14px", maxWidth: "700px" }}
                  margin="normal"
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </Stack>
            ) : null}
          </div>

          {!trips?.tripsWithPictures.length ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              Get started with your first trip!
            </Alert>
          ) : null}
        </div>

        <div className="boxes">
          <Stack
            border="2px dashed gray"
            display={theme.flexBox}
            justifyContent={theme.center}
            alignItems={theme.center}
            height={theme.trips.height}
            borderRadius={theme.radius}
            backgroundColor={ theme.palette.mode === "dark" ? null : "#FAFAFA"}
            sx={{ cursor: "pointer" }}
            onClick={openPopup}
          >
            <Tooltip title="Add trip">
              <IconButton>
                <AddLocationAltOutlinedIcon
                  sx={{ fontSize: "25px", color: "gray" }}
                />
              </IconButton>
            </Tooltip>
          </Stack>
          {filteredTrips}
        </div>

        {bags?.length >= 1 && (
          <div className="latestBag">
            <Stack
              display={theme.flexBox}
              flexDirection={theme.row}
              alignItems={theme.center}
              justifyContent={theme.center}
              mb={1}
            >
              <Typography component="h3" variant="span" fontWeight="500" mr={1}>
                {" "}
                My last bag status{" "}
              </Typography>
              <Typography
                component="h3"
                variant="span"
                fontWeight="500"
                sx={{
                  color: theme.green,
                  textDecoration: "underline",
                  cursor: "pointer",
                  "&:hover": { color: "#32cd32" },
                }}
                onClick={navigateToLatestBag}
              >
                {trips?.latestBag?.name?.length > 6
                  ? `${trips?.latestBag?.name.substring(0, 6)}...`
                  : trips?.latestBag?.name}
              </Typography>
            </Stack>
            <Typography component="p" variant="p" mb={4} textAlign="center">
              {" "}
              Streamline Your Gear, Simplify Your Adventure.{" "}
            </Typography>
            <div id="boxes" className="boxes">
              <LatestBagStack>
                <Typography component="h4" variant="span" fontWeight="300">
                  Total weight
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <MonitorWeightOutlinedIcon
                    sx={{ fontSize: "30px", color: theme.green }}
                  />
                  {trips?.latestBagTotalWeight > trips?.latestBag?.goal ? (
                    <Stack direction="row">
                      <BlockOutlinedIcon
                        sx={{ marginRight: "5px", color: "red" }}
                      />
                      <Typography fontWeight="600" color="red">
                        Failed
                      </Typography>
                    </Stack>
                  ) : (
                    <Stack direction="row">
                      <CheckCircleOutlineOutlinedIcon
                        sx={{ marginRight: "5px", color: theme.green }}
                      />
                      <Typography fontWeight="600" color={theme.green}>
                        Passed
                      </Typography>
                    </Stack>
                  )}
                </Stack>
                <Typography
                  component="h3"
                  variant="span"
                  fontWeight="600"
                  sx={{
                    color:
                      trips?.latestBagTotalWeight > trips?.latestBag?.goal
                        ? "red"
                        : theme.green,
                  }}
                >
                  {trips?.latestBagTotalWeight
                    ? trips?.latestBagTotalWeight.toFixed(2)
                    : 0.0}{" "}
                  / {trips?.latestBag?.goal || 0.0}{" "}
                  {session?.user?.weightOption}
                </Typography>
              </LatestBagStack>
              <LatestBagStack>
                <Typography component="h4" variant="span" fontWeight="300">
                  Total categories{" "}
                </Typography>
                <HorizontalSplitOutlinedIcon
                  sx={{ fontSize: "30px", color: theme.green }}
                />
                <Typography component="h3" variant="span" fontWeight="600">
                  {trips?.totalCategories || 0}
                </Typography>
              </LatestBagStack>
              <LatestBagStack>
                <Typography component="h4" variant="span" fontWeight="300">
                  Total items
                </Typography>
                <DataUsageOutlinedIcon
                  sx={{ fontSize: "30px", color: theme.green }}
                />
                <Typography component="h3" variant="span" fontWeight="600">
                  {itemsTotal || 0}
                </Typography>
              </LatestBagStack>
            </div>
          </div>
        )}

      
          <MuiPopup isOpen={isPopupOpen} onClose={closePopup}>
            <form onSubmit={createTrip}>
              <Grid container spacing={2}>
                <Grid item xs={11}>
                  <Typography variant="h6" component="h2" mb={0.5}>
                    Plan Your Adventure
                  </Typography>
                  <Typography variant="span" component="span" mb={3}>
                    Fill in the details below to create a new trip
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                 <CloseIcon onClick={closePopup} sx={{ cursor: "pointer" }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                     
                     onChange={(event, newValue) => {
                     nameRef.current.value = newValue || ""
                    }}
                    options={countryNameArr || []}
                    renderInput={(params) => (
                      <TextField required {...params} label="Destination"  inputRef={nameRef} />
                    )}
                    sx={{ width: "100%" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label={`Distance (${session?.user?.distance})`}
                    type="number"
                    name="distance"
                    required
                    inputRef={distanceRef}
                    sx={{ width: "100%" }}
                    inputProps={{ min: 1, max: 999999 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    multiline
                    label="Description"
                    name="about"
                    inputRef={aboutRef}
                    sx={{ width: "100%" }}
                    inputProps={{ maxLength: 300 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Start Date"
                      name="startDate"
                      onChange={(date) => (startDateRef.current = date)}
                      sx={{ width: "100%" }}
                      defaultValue={dayjs().add(1, "day")}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="End Date"
                      name="endDate"
                      onChange={(date) => (endDateRef.current = date)}
                      sx={{ width: "100%" }}
                      defaultValue={dayjs().add(2, "day")}
                      minDate={startDateRef.current}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    sx={{
                      width: "100%",
                      fontWeight: "500",
                      backgroundColor: theme.green,
                      color: theme.palette.mode === "dark" ? "white" : null,
                    }}
                    variant="contained"
                    disableElevation
                  >
                    Plan Trip{" "}
                    {loading && (
                      <CircularProgress
                        color="inherit"
                        size={16}
                        sx={{ marginLeft: "10px" }}
                      />
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </MuiPopup>
     
      </Stack>
    </Box>
  );
};

export default Trips;
