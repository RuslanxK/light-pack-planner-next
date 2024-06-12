"use client"

import { Stack, Typography, IconButton, Autocomplete, TextField, Button, Container, Tooltip } from '@mui/material'
import Bag from './Bag'
import axios from 'axios';
import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useTheme } from '@emotion/react';
import MuiPopup from './custom/MuiPopup'
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import SportsScoreOutlinedIcon from '@mui/icons-material/SportsScoreOutlined';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const InnerTrip = ({tripData, trips, session}) => {


const countriesApi = "https://restcountries.com/v3.1/all?fields=name,flags"

const [isTransitionStarted, startTransition] = useTransition();
const [isPopupOpen, setPopupOpen] = useState(false);
const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
const [countries, setCounties] = useState([])
const [isAddPopupOpen, setAddPopupOpen] = useState(false)
const [editedTrip, setEditedTrip] = useState({name: tripData?.trip?.name, about:tripData?.trip?.about, distance: tripData?.trip?.distance, startDate: dayjs(tripData?.trip?.startDate), endDate: dayjs(tripData?.trip?.endDate) });
const [newBag, setNewBag] = useState({})

const router = useRouter();
const theme = useTheme()

useEffect(() => {
  const getCountries = async () => {
       const { data } = await axios.get(countriesApi)
       setCounties(data)
  }
   getCountries()

   localStorage.setItem('tripId', tripData.trip._id);

}, []);



const calculateDuration = () => {

  if (tripData && tripData?.trip?.startDate && tripData?.trip?.endDate) {
    const startDate = dayjs(tripData.trip.startDate);
    const endDate = dayjs(tripData.trip.endDate);
    const durationInHours = endDate.diff(startDate, 'hour');
      const durationInDays = Math.ceil(durationInHours / 24);
    return durationInDays;
  }
  return null;
};


const calculateDaysLeft = (tripData) => {
  if (tripData && tripData.startDate && tripData.endDate) {
    const startDate = dayjs(tripData.startDate);
    const today = dayjs().startOf('day'); 
    const daysLeft = startDate.diff(today, 'day');
    return daysLeft;
  }
  return null;
};


const handleChange = (event) => {
  let { name, value } = event.target;
  setEditedTrip({ ...editedTrip, [name]: value });
};


const handleBagChange = (event) => {
  let { name, value } = event.target;
  setNewBag({ ...newBag, [name]: value });
};


const handleDateChange = (date, fieldName) => {
  setEditedTrip((prevData) => ({
    ...prevData,
    [fieldName]: date,
  }));
};


const bags = tripData?.bags?.map((bag) => <Bag key={bag._id} bagData={bag} trips={trips} session={session} />)


const addBag = async (e) => {
  e.preventDefault();
  try {
    const newTripDataWithUserId = {...newBag, tripId: tripData?.trip?._id, userId: session?.user?.id};
    await axios.post('/bags/new', newTripDataWithUserId);

    startTransition(router.refresh)
    setAddPopupOpen(false);
   
  } catch (err) {
    console.log(err);
  }
};


const updateTrip =  async (e) => {
  e.preventDefault()
  try {
    await axios.put(`/api/trips/${tripData.trip._id}/${session?.user?.id}`, editedTrip);

    startTransition(router.refresh)
    setPopupOpen(false)
    
  }
  catch (err) {
      console.log(err)
  }
}

const removeTrip = async () => {

  try {
    await axios.delete(`/api/trips/${tripData.trip._id}/${session?.user?.id}`);
    setDeletePopupOpen(false)
    router.push('/')
    startTransition(router.refresh)
  }

   catch (error) {
      console.log(error)
   }
}


const openRemovePopup = () => {
    setDeletePopupOpen(true)
}

const openAddPopup = () => {
     setAddPopupOpen(true)
}

const openPopup = () => {
  setPopupOpen(true);
};

const closePopup = () => {
  setPopupOpen(false);
  setDeletePopupOpen(false)
  setAddPopupOpen(false)
};


const countriesArr = countries?.map((x) => x.name)
const countryNameArr = countriesArr?.map((x) => x.common) 

  return (
    <Container sx={{display: "flex"}} maxWidth={false} disableGutters>
      

    <Stack display={theme.flexBox} justifyContent={theme.start} width={theme.fullWidth}  minHeight="100vh">

        <div className="main-info">
        <Stack>
        <Stack display={theme.flexBox} flexDirection={theme.row} justifyContent={theme.between} flexWrap="wrap" alignItems={theme.center} boxShadow={'rgba(33, 35, 38, 0.1) 0px 10px 10px -10px;'}  backgroundColor={ theme.palette.mode === "dark" ? theme.main.darkColor : "#f2f2f2"} pt={1.5} pb={1.5} mb={3} borderRadius="7px">

        <Stack direction="row" alignItems={theme.center}>
        <IconButton sx={{ marginRight: "5px", backgroundColor: theme.palette.mode === "dark" ? theme.main.darkColor : "#f2f0f0"}} onClick={() => router.push('/')}><ArrowBackIcon sx={{fontSize: "20px"}}/></IconButton>
        <Typography component="h3"variant='span' fontWeight="600" mr={1}>{tripData?.trip?.name}</Typography>
        </Stack>
        <Stack direction="row">
          <Tooltip title="Edit"><IconButton onClick={openPopup}><EditLocationOutlinedIcon sx={{fontSize: "20px", cursor: "pointer", "&:hover": { color: theme.orange }}}  /></IconButton> </Tooltip>
          <Tooltip title="Delete"><IconButton onClick={openRemovePopup}><DeleteOutlineOutlinedIcon sx={{fontSize: "20px", cursor: "pointer", "&:hover": { color: "red" }}}  /></IconButton></Tooltip>
          </Stack>
        </Stack>
        <Typography component="p" variant="p"> {tripData?.trip?.about} </Typography>

       <Stack mt={3}>
       <Stack direction="row" borderRadius={theme.radius} width="fit-content" alignItems="center" justifyContent="center">
       <IconButton sx={{marginRight: "2px"}}><SportsScoreOutlinedIcon sx={{fontSize: "22px"}} /></IconButton> {tripData?.trip?.distance} km <IconButton sx={{marginRight: "2px", marginLeft: "2px"}}><MoreTimeIcon sx={{fontSize: "22px"}} /></IconButton> {calculateDaysLeft(tripData.trip) <= 0 ? (
       <Typography variant="span" sx={{ color: theme.black, fontWeight: "bold" }}>Traveled </Typography> ) : ( <Typography variant='span' sx={{ color: theme.green, fontWeight: "bold" }}> Starts in {calculateDaysLeft(tripData.trip)} {calculateDaysLeft(tripData.trip) > 0 ? 'day' : 'days'} </Typography>)}
       <IconButton sx={{marginRight: "2px", marginLeft: "2px"}}><WbSunnyOutlinedIcon sx={{fontSize: "22px"}}/></IconButton> {calculateDuration()} {calculateDuration() === 1 ? 'day' : 'days'}
       </Stack>
       <Typography component="h3" variant="h6" mb={0.3} mt={4}>My Bags</Typography>
       <Typography component="p" variant="p" >Lorem ipsum dolor sit amet</Typography>
      </Stack>
        </Stack>
        </div>

    <div className="boxes">
     
     <Stack border="2px dashed gray" alignItems={theme.center} display={theme.flexBox} justifyContent={theme.center} width={theme.bags.width} height={theme.bags.height} borderRadius={theme.radius} sx={{cursor: "pointer"}} onClick={openAddPopup}>
      <Tooltip title="Add bag"><IconButton><AddOutlinedIcon sx={{fontSize: "25px", color: "gray" }}/></IconButton></Tooltip>
     </Stack>
      {bags}
     </div>


    { isAddPopupOpen ?  <MuiPopup isOpen={isAddPopupOpen} onClose={closePopup} >
        <form onSubmit={addBag}>

          <Stack direction="row"  justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">
             <Stack width="90%">
             <Typography variant='span' component="h2">Add new bag</Typography>
             <Typography variant='span' component="span" mb={3}>Popup content goes here</Typography>
             </Stack>

             <CloseIcon onClick={closePopup} sx={{cursor: "pointer"}}/>
             <TextField label="Bag name" name="name" required onChange={handleBagChange} sx={{width: "48.5%", marginBottom: "20px"}}  inputProps={{ maxLength: 26 }}/>
             <TextField label={`Weight goal - ${session?.user?.weightOption}`} type="number" required name="goal" onChange={handleBagChange} sx={{width: "48.5%", marginBottom: "20px"}} inputProps={{ min: 1 }} />
            <TextField multiline label="Description" name="description" onChange={handleBagChange} sx={{width: "100%"}} inputProps={{ maxLength: 200 }} /> 

            <Button type="submit"  sx={{marginTop: "20px", width: "100%", fontWeight: "500", backgroundColor: theme.green, color: theme.palette.mode === "dark" ? "white" : null }} variant="contained" disableElevation>Add</Button>
          </Stack>
      </form>

  </MuiPopup> : null }



    { isPopupOpen ?  <MuiPopup isOpen={isPopupOpen} onClose={closePopup} >
        <form onSubmit={updateTrip}>

          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">
             <Stack width="90%">
             <Typography variant='span' component="h2">Update Trip</Typography>
             <Typography variant='span' component="span" mb={3}>Popup content goes here</Typography>
             </Stack>

             <CloseIcon onClick={closePopup} sx={{cursor: "pointer"}}/>
             <Autocomplete
              onChange={(event, newValue) => setEditedTrip((prevData) => ({ ...prevData, name: newValue || '' }))}
              value={countryNameArr?.includes(editedTrip.name) ? editedTrip.name : null}
              options={countryNameArr || []}
              renderInput={(params) => <TextField required {...params} label="Location" />}
              sx={{width: "48%", marginBottom: "20px"}} />

            <TextField
              label={`Distance - ${session?.user?.distance}`}
              type="number"
              value={editedTrip.distance}
              name="distance"
              onChange={handleChange}
              sx={{ width: "48.5%", marginBottom: "20px" }}
              inputProps={{ min: 1, max: 999999 }} />

            <TextField
              multiline
              label="Description"
              name="about"
              value={editedTrip.about}
              onChange={handleChange}
              sx={{ width: "100%", marginBottom: "20px" }}
              inputProps={{ maxLength: 300 }} />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start date"
                name="startDate"
                value={editedTrip.startDate || null }
                onChange={(date) => handleDateChange(date, "startDate")}
                sx={{ width: "48.5%" }}
                 />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End date"
                name="endDate"
                onChange={(date) => handleDateChange(date, "endDate")}
                value={editedTrip.endDate || null } 
                sx={{ width: "48.5%" }}
                minDate={editedTrip.startDate || null} />
            </LocalizationProvider>

            <Button type="submit"  sx={{marginTop: "20px", width: "100%", fontWeight: "500", backgroundColor: theme.green, color: theme.palette.mode === "dark" ? "white" : null }} variant="contained" disableElevation>Update</Button>
          </Stack>
      </form>

  </MuiPopup> : null }


{ isDeletePopupOpen ? <MuiPopup isOpen={isDeletePopupOpen} onClose={closePopup}>
<Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">

<Stack width="90%">
<Typography variant='span' component="h2" mb={1.5}>Delete Trip</Typography>
<Typography variant='span' component="span">
   Are you sure you want to delete this trip? This action cannot be undone.
   Deleting this trip will permanently remove it from the system, and any associated data will be lost.</Typography>
</Stack>

<CloseIcon onClick={closePopup} sx={{cursor: "pointer"}}/>
<Button sx={{marginTop: "20px", width: "100%", fontWeight: "500", color: theme.palette.mode === "dark" ? "white" : null, backgroundColor: theme.red, '&:hover': {backgroundColor: theme.redHover}}} variant="contained" onClick={removeTrip} disableElevation>Delete</Button>
</Stack>

    </MuiPopup> : null }
    </Stack>

    </Container>

  )
}

export default InnerTrip