"use client"

import { Stack, TextField, Select, MenuItem, IconButton, Typography, Button, Tooltip, Checkbox} from '@mui/material'
import LinkIcon from '@mui/icons-material/Link';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import NordicWalkingIcon from '@mui/icons-material/NordicWalking';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useTheme } from '@emotion/react';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import MuiPopup from './custom/MuiPopup';
import CloseIcon from "@mui/icons-material/Close";
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';


const Item = (props) => {

  const [popupOpen, setPopupOpen] = useState(false)
  const [picPopupOpen, setPicPopupOpen] = useState(false)
  const [removePopupOpen ,setRemovePopupOpen] = useState(false)
  const [itemHover, setItemHover] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showEditIcon, setShowEditIcon] = useState(false)
  const [itemData, setItem] = useState({ userId: props.itemData.creator, _id: props.itemData._id, tripId: props.itemData.tripId, bagId: props.itemData.bagId, categoryId: props.itemData.categoryId, name: props.itemData.name, selected: props.itemData.selected,
    priority: props.itemData.priority, description: props.itemData.description || '',  qty: +props.itemData.qty || 1, weight: +props.itemData.weight || 0.1, link: props.itemData.link, worn: props.itemData.worn, productImageKey: props.itemData.productImageKey, image: null, price: props.itemData.price || 0,});

    const theme = useTheme()
    const router = useRouter();



    const openRemovePopupOpen = () => {
      setRemovePopupOpen(true)
   }

   const closePopup = () => {
     setRemovePopupOpen(false);
     setPopupOpen(false)
     setPicPopupOpen(false)
     
   };




   const updateChecked = async (e) => {

       
    const obj = {...itemData, selected: e.target.checked}

    try {
      await axios.put(`/items/${itemData._id}/${props?.session?.user?.id}`, obj)
      router.refresh()
  
     }
      catch (error) {
           console.log(error)
      }
         
   }



    const saveItemData =  async () => {

      try {
       await axios.put(`/items/${itemData._id}/${props?.session?.user?.id}`, itemData)
      }
       catch (error) {
            console.log(error)
       }
    };


   

  
    const handleChange = async (event) => {
      let { name, value } = event.target;
      setItem({ ...itemData, [name]: value });
    
      if (name === 'qty' || name === 'weight') {
        try {
          await axios.put(`/items/${itemData._id}/${props?.session?.user?.id}`, { ...itemData, [name]: value });
          router.refresh();
        } catch (error) {
          console.log(error);
        }
      }
    };
  



    const handleFileChange = (event) => {
      const { name } = event.target;
      const selectedFile = event.target.files[0];
    
      if (selectedFile) {
        setItem((prevItemData) => ({
          ...prevItemData,
          image: selectedFile,
        }));
      }
    };


    const updateAsWorn =  async () => {
      setItem((prevItemData) => ({ ...prevItemData, worn: !prevItemData.worn }));
      try {
        await axios.put(`/items/${itemData._id}/${props?.session?.user?.id}`, { ...itemData, worn: !itemData.worn });
        router.refresh();
      }
       catch (error) {
            console.log(error)
       }
    };


    const duplicateItem = async () => {

    const duplicatedItem = { ...itemData };
    delete duplicatedItem._id;
    try {
      await axios.post('/items/new', duplicatedItem);
      router.refresh();
    }
     catch (error) {
          console.log(error)
     }
      
    }

    const removeItem = async () => {
      try {
        await axios.delete(`/items/${props.itemData._id}/${props?.session?.user?.id}`);
        router.refresh();
      }
       catch (error) {
            console.log(error)
       }
    }


    const saveLink = async (e) => {
      
      e.preventDefault()
      try {
        await axios.put(`/items/${itemData._id}/${props?.session?.user?.id}`, itemData);
        setPopupOpen(false)
        router.refresh();
        
      }
       catch (error) {
            console.log(error)
       }
    }


    const savePicture = async (e) => {
      e.preventDefault();

      const key = itemData.productImageKey
    
      try {

        setLoading(true)
        const data = await axios.put(`/items/${itemData._id}/${props?.session?.user?.id}/image`, key);
    
        const awsUrl = data.data.signedUrl;
    
        await fetch(awsUrl, {
          method: "PUT",
          body: itemData.image,
          headers: {
            "Content-Type": itemData.image.type,
          },
        });



        router.refresh();
        setPicPopupOpen(false);
        setLoading(false)
  
      } catch (error) {
        console.log(error);
      }
    };


    const getBackgroundColor = (priority) => {
      switch (priority) {
        case 'low':
          return "rgba(0, 172, 28, 0.1)";
        case 'medium':
          return "rgba(255, 165, 0, 0.1)";
        default:
          return "rgba(255, 0, 0, 0.1)";
      }
    };


  return (

    
    <div className="scroll-div" sx={{ overflowX: "scroll"}}>
        
      <Stack mb={0.5}e flexDirection="row" justifyContent={theme.between} alignItems={theme.center} onMouseOver={() => setItemHover(true)}  onMouseLeave={() => setItemHover(false)}>
     
        <Checkbox size="small" name='selected' sx={{marginTop: "5px", transform: "scale(0.8)"}} onChange={updateChecked} checked={itemData.selected} /> 
      <TextField size='small' variant='standard' placeholder='name' name='name' sx={{ marginTop: "16px", width: '50%', marginRight: "15px", borderBottom: theme.palette.mode === "dark" ? `1px solid ${theme.main.darkColor}` : "1px solid #C0C0C0"}} value={itemData.name} InputLabelProps={{ style : {fontSize: 12}}} InputProps={{disableUnderline: true}} inputProps={{style: {fontSize: 12}}} onChange={handleChange} onBlur={saveItemData}/>
      <TextField size='small' variant='standard' placeholder='note' name='description' sx={{ marginTop: "16px", width: '100%', marginRight: "15px", borderBottom: theme.palette.mode === "dark" ? `1px solid ${theme.main.darkColor}` : "1px solid #C0C0C0"}} value={itemData.description} InputLabelProps={{ style : {fontSize: 12}}} inputProps={{style: {fontSize: 12}}} InputProps={{disableUnderline: true}} onChange={handleChange} onBlur={saveItemData} />
      <TextField size='small' variant='standard' type='number' name='price' label="$ price" step="any" sx={{width: '10%', marginRight: "15px", borderBottom: theme.palette.mode === "dark" ? `1px solid ${theme.main.darkColor}` : "1px solid #C0C0C0"}} value={itemData.price} onChange={handleChange} InputLabelProps={{ style : {fontSize: 12}}} InputProps={{disableUnderline: true}} inputProps={{ min: 1, max: 99, style: {fontSize: 12} }} onBlur={saveItemData}/>
      <TextField size='small' variant='standard' type='number' name='qty' label="qty" sx={{width: '10%', marginRight: "15px", borderBottom: theme.palette.mode === "dark" ? `1px solid ${theme.main.darkColor}` : "1px solid #C0C0C0"}} value={itemData.qty} onChange={handleChange} InputLabelProps={{ style : {fontSize: 12}}} InputProps={{disableUnderline: true}} inputProps={{ min: 1, max: 99, style: {fontSize: 12} }} />
      <TextField size='small' variant='standard' type='number' name='weight' label='weight' sx={{width: '12%', marginRight: "10px", borderBottom: theme.palette.mode === "dark" ? `1px solid ${theme.main.darkColor}` : "1px solid #C0C0C0"}} value={itemData.weight} onChange={handleChange} InputLabelProps={{ style : {fontSize: 12}}} InputProps={{disableUnderline: true}} inputProps={{ min: 0.1, max: 99, style: {fontSize: 12} }} />
       <Typography fontSize="12px" variant='span' component="span">{props?.session?.user?.weightOption}</Typography>
      <Select size='small' variant='outlined' name='priority' sx={{width: '10%', fontSize: "12px",  marginRight: "10px", marginLeft: "15px", backgroundColor: getBackgroundColor(itemData.priority)}} value={itemData.priority} onChange={handleChange} onBlur={saveItemData}>  
       <MenuItem sx={{fontSize: "12px"}} value="low">Low priority</MenuItem>
       <MenuItem sx={{fontSize: "12px"}} value="medium">Med priority</MenuItem>
       <MenuItem sx={{fontSize: "12px"}} value="high">High priority</MenuItem>
      </Select>


      <Stack display={theme.flexBox} flexDirection="row">

            <Tooltip title="Picture">
              <IconButton onClick={() => setPicPopupOpen(true)}>
                <ImageOutlinedIcon sx={{ fontSize: "15px", color: itemData.image || itemData.productImageKey ? theme.green : null, '&:hover': { color: theme.green } }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="I wear it">
              <IconButton onClick={updateAsWorn}>
                <NordicWalkingIcon sx={{ fontSize: "14px", color: itemData.worn ? theme.green : null, '&:hover': { color: theme.green } }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Duplicate">
              <IconButton onClick={duplicateItem}>
                <ContentCopyIcon sx={{ fontSize: "13px", '&:hover': { color: theme.green } }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Link">
              <IconButton onClick={() => setPopupOpen(true)}>
                <LinkIcon sx={{ fontSize: "15px", color: itemData.link ? "blue" : null, '&:hover': { color: "blue" } }} />
              </IconButton>
            </Tooltip>
         
          </Stack>

          </Stack>
    

      { removePopupOpen ? <MuiPopup isOpen={removePopupOpen} onClose={closePopup}>
       <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">

      <Stack width="90%">
      <Typography variant='span' component="h2" mb={1.5}>Delete item</Typography>
      <Typography variant='span' component="span">
       Are you sure you want to delete this item? This action cannot be undone.
       Deleting this item will permanently remove it from the system, and any associated data will be lost.</Typography>
      </Stack>

<CloseIcon onClick={closePopup} sx={{cursor: "pointer"}}/>
<Button sx={{color: theme.palette.mode === "dark" ? "white" : null, marginTop: "20px", width: "100%", fontWeight: "500", backgroundColor: theme.red, '&:hover': {backgroundColor: theme.redHover}}} variant="contained" onClick={removeItem} disableElevation>Delete</Button>
</Stack>

</MuiPopup> : null }



{popupOpen ? <MuiPopup isOpen={popupOpen} onClose={closePopup}>

   <form onSubmit={saveLink}>
        <Stack spacing={2}>
          <Stack flex={1} direction="row" justifyContent="space-between">
            <Typography variant="span" component="h2" marginBottom="10px">
              Add a link for this item
            </Typography>
            <CloseIcon onClick={closePopup} />
          </Stack>
          <TextField
            name="link"
            label="Link"
            variant="outlined"
            value={itemData.link}
            onChange={handleChange}
            sx={{ marginBottom: "10px" }} />
          
          <Button type="submit" sx={{ color: theme.palette.mode === "dark" ? "white" : null, width: "100%", fontWeight: "500", backgroundColor: theme.green}} variant="contained" disableElevation>Save</Button>

        </Stack>
      </form>


</MuiPopup> : null }


{picPopupOpen ? (
  <MuiPopup isOpen={picPopupOpen} onClose={closePopup}>
    <form onSubmit={savePicture}>
      <Stack>
        <Stack flex={1} direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="span" component="h2" marginBottom="10px">
            Add a picture for this item
          </Typography>
          <IconButton onClick={closePopup}><CloseIcon /></IconButton>
        </Stack>

        <Button
  component="label"
  disableElevation
  role={undefined}
  variant="outlined"
  onMouseLeave={() => setShowEditIcon(false)}
  onMouseEnter={() => setShowEditIcon(true)}
  sx={{
    width: "100%",
    background: theme.palette.mode === "dark" ? theme.main.darkColor : "#e3e3e3",
    height: "300px",
    marginBottom: "15px",
    border: "none",
    padding: "0px",
    '&:hover': { border: "none" },
    position: "relative", 
  }}
>
  {itemData.productImageKey || itemData.image ? (
    <>
      <img
        width="100%"
        height="300px"
        style={{ objectFit: "contain" }}
        src={itemData.image ? URL.createObjectURL(itemData.image) : `${process.env.NEXT_PUBLIC_PROFILE_URL}/${itemData.productImageKey}`}
      />

    { showEditIcon ? <ChangeCircleOutlinedIcon sx={{position: "absolute", fontSize: 100, color: theme.palette.text.secondary }} /> : null }
    </>
  ) : (
    <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 100, color: theme.palette.text.secondary }} />
  )}

  <input
    type="file"
    name="image"
    style={{ width: "0px", borderRadius: "5px" }}
    accept="image/jpeg,image/png,image/webp"
    onChange={handleFileChange}
  />
</Button>

<Button
  type="submit"
  disabled={itemData.image ? false : true }
  sx={{ color: theme.palette.mode === "dark" ? "white" : null, width: "100%", fontWeight: "500", backgroundColor: theme.green }}
  variant="contained"
  disableElevation
>
  Save {loading ?  <CircularProgress color="inherit" size={20} sx={{marginLeft: "10px"}} /> : null}
 </Button>

      </Stack>
    </form>
  </MuiPopup>
) : null}




        </div>

  )
}

export default React.memo(Item)