import React, { Fragment, useState,  useEffect } from 'react'
import { Stack, Typography, Autocomplete, TextField, Button} from '@mui/material'
import FlipCameraIosOutlinedIcon from '@mui/icons-material/FlipCameraIosOutlined';
import { useTheme } from '@emotion/react';
import MuiPopup from './custom/MuiPopup';
import CloseIcon from "@mui/icons-material/Close";
import axios from 'axios';
import useRefresh from './hooks/useRefresh'
import CircularProgress from '@mui/material/CircularProgress';


const SideItem = ({itemData, categoryData, update}) => {

const [isPopupOpen, setPopupOpen] = useState(false);
const [itemToCategory, setItemToCategory] = useState({ tripId: null, bagId: null, categoryId: null});
const [selectedCategory, setSelectedCategory] = useState(null); // State to manage the selected category
const [loading, setLoading] = useState(false);


const theme = useTheme()
const { refresh } = useRefresh();


const categoryOptions = categoryData?.map((x) => ({ name: x.name, _id: x._id, key: x._id })) 
const isOptionEqualToValue = (option, value) => option._id === value?._id;


useEffect(() => {

  const tripId = localStorage.getItem('tripId');
  const bagId = localStorage.getItem('bagId');

  if (tripId && bagId) {
    setItemToCategory((prevData) => ({
      ...prevData,
      tripId: tripId,
      bagId: bagId
    }));
  }
}, [categoryData]);


const openPopup = () => {
  setPopupOpen(true)
}

const closePopup = () => {
    setPopupOpen(false);
};

const addItemToCategory = async (e) => {
    e.preventDefault()

  
    const itemObj = {userId: itemData.creator, tripId: itemToCategory.tripId, bagId: itemToCategory.bagId, categoryId: itemToCategory.categoryId, 
      name: itemData.name, description: itemData.description, link: itemData.link, priority: itemData.priority, qty: itemData.qty, weight: itemData.weight, wgtOpt: itemData.wgtOpt, worn: itemData.worn}

    try {
        
        setLoading(true)
        await axios.post('/items/new', itemObj);
        await refresh()
        update()
        setPopupOpen(false)
        setLoading(false)
        setSelectedCategory(null)
        
      }
       catch (error) {
            console.log(error)
       }
    }

  return (
    <Fragment>
    <Stack pl={1} pr={1} mb={1} pt={0.5} display="flex" flexDirection="row" alignItems='center'>
    <Stack onClick={openPopup}  p={0.7} mr={1} backgroundColor="white" width="20px" borderRadius="5px" sx={{cursor: "pointer", transition: "transform 0.2s ease-in-out", '&:hover': {transform: "scale(1.1)"}}}>
     <FlipCameraIosOutlinedIcon sx={{color: theme.green, fontSize: "20px"}} />
   </Stack>
   <Typography component="span" variant="span" fontSize="15px" color={theme.main.lightGray}>{itemData?.name?.length > 10 ? itemData?.name?.substring(0, 10) + "..." : itemData?.name}</Typography>
   </Stack>


 <MuiPopup isOpen={isPopupOpen} onClose={closePopup} >
  <form onSubmit={addItemToCategory}>
        <Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography component="h2" variant="span" mb={0.5}>Add item to category</Typography>
            <CloseIcon onClick={closePopup} />
          </Stack>
          <Typography component="p" variant="p" mb={3}> Select a category to add <Typography component="span" variant="span" color={theme.green}>{itemData.name}</Typography></Typography>
             <Autocomplete
              value={selectedCategory}
              renderInput={(params) => <TextField  required {...params} label="Categories" />}
              onChange={(event, newValue) => {
                setItemToCategory((prevData) => ({ ...prevData, categoryId: newValue ? newValue._id : '' }))
                setSelectedCategory(newValue);
                }
              }
              options={categoryOptions}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={isOptionEqualToValue}
              getOptionKey={(option) => option.key}/>
             <Button type="submit"  sx={{ marginTop: "20px", color: theme.palette.mode === "dark" ? "white" : null, width: "100%", fontWeight: "500", backgroundColor: theme.green}} variant="contained" disableElevation>Add to Category  {loading && <CircularProgress color="inherit" size={16} sx={{ marginLeft: "10px" }} />}</Button>
        </Stack>
      </form>
  </MuiPopup>



   </Fragment>
  )
}

export default React.memo(SideItem)