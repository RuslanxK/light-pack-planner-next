"use client"

import { Stack, TextField, Select, MenuItem, IconButton, Typography, Button, Tooltip} from '@mui/material'
import LinkIcon from '@mui/icons-material/Link';
import NordicWalkingIcon from '@mui/icons-material/NordicWalking';
import { useTheme } from '@emotion/react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import MuiPopup from './custom/MuiPopup';
import CloseIcon from "@mui/icons-material/Close";
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';

const SharedItem = (props) => {

  const [popupOpen, setPopupOpen] = useState(false)
  const [picPopupOpen, setPicPopupOpen] = useState(false)
  const [removePopupOpen ,setRemovePopupOpen] = useState(false)
  const [itemHover, setItemHover] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showEditIcon, setShowEditIcon] = useState(false)
  

    const theme = useTheme()
    const router = useRouter();


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


    const closePopup = () => {
        setRemovePopupOpen(false);
        setPopupOpen(false)
        setPicPopupOpen(false)
        
      };


  return (

    
    <div className="scroll-div" sx={{ overflowX: "scroll"}}>
    
      
      <Stack mb={0.5}e flexDirection="row" justifyContent={theme.between} alignItems={theme.center} onMouseOver={() => setItemHover(true)}  onMouseLeave={() => setItemHover(false)}>
      <TextField size='small' variant='standard' placeholder='name' name='name' sx={{ marginTop: "16px", width: '50%', marginRight: "15px", borderBottom: theme.palette.mode === "dark" ? `1px solid ${theme.main.darkColor}` : "1px solid #C0C0C0"}} value={props.itemData.name} InputLabelProps={{ style : {fontSize: 12}}} InputProps={{disableUnderline: true}} inputProps={{style: {fontSize: 12}}}/>
      <TextField size='small' variant='standard' placeholder='note' name='description' sx={{ marginTop: "16px", width: '100%', marginRight: "15px", borderBottom: theme.palette.mode === "dark" ? `1px solid ${theme.main.darkColor}` : "1px solid #C0C0C0"}} value={props.itemData.description} InputLabelProps={{ style : {fontSize: 12}}} inputProps={{style: {fontSize: 12}}} InputProps={{disableUnderline: true}} />
      <TextField size='small' variant='standard' type='number' name='price' label="$ price" step="any" sx={{width: '10%', marginRight: "15px", borderBottom: theme.palette.mode === "dark" ? `1px solid ${theme.main.darkColor}` : "1px solid #C0C0C0"}} value={props.itemData.price} InputLabelProps={{ style : {fontSize: 12}}} InputProps={{disableUnderline: true}} inputProps={{ min: 1, max: 99, style: {fontSize: 12} }} />
      <TextField size='small' variant='standard' type='number' name='qty' label="qty" sx={{width: '10%', marginRight: "15px", borderBottom: theme.palette.mode === "dark" ? `1px solid ${theme.main.darkColor}` : "1px solid #C0C0C0"}} value={props.itemData.qty} InputLabelProps={{ style : {fontSize: 12}}} InputProps={{disableUnderline: true}} inputProps={{ min: 1, max: 99, style: {fontSize: 12} }} />
      <TextField size='small' variant='standard' type='number' name='weight' label='weight' sx={{width: '12%', marginRight: "10px", borderBottom: theme.palette.mode === "dark" ? `1px solid ${theme.main.darkColor}` : "1px solid #C0C0C0"}} value={props.itemData.weight} InputLabelProps={{ style : {fontSize: 12}}} InputProps={{disableUnderline: true}} inputProps={{ min: 0.1, max: 99, style: {fontSize: 12} }} />
       <Typography fontSize="12px" variant='span' component="span">{props?.weightOption}</Typography>
      <Select size='small' variant='outlined' name='priority' sx={{width: '10%', fontSize: "12px",  marginRight: "10px", marginLeft: "15px", backgroundColor: getBackgroundColor(props.itemData.priority)}} value={props.itemData.priority}>  
       <MenuItem sx={{fontSize: "12px"}} value="low">Low priority</MenuItem>
       <MenuItem sx={{fontSize: "12px"}} value="medium">Med priority</MenuItem>
       <MenuItem sx={{fontSize: "12px"}} value="high">High priority</MenuItem>
      </Select>


      <Stack display={theme.flexBox} flexDirection="row">
            <Tooltip title="Picture">
              <IconButton onClick={() => setPicPopupOpen(true)}>
                <ImageOutlinedIcon sx={{ fontSize: "15px", color: props.itemData.image || props.itemData.productImageKey ? theme.green : null, '&:hover': { color: theme.green } }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="I wear it">
              <IconButton>
                <NordicWalkingIcon sx={{ fontSize: "14px", color: props.itemData.worn ? theme.green : null, '&:hover': { color: theme.green } }} />
              </IconButton>
            </Tooltip>
        
            <Tooltip title="Link">
              <IconButton onClick={() => setPopupOpen(true)}>
                <LinkIcon sx={{ fontSize: "15px", color: props.itemData.link ? "blue" : null, '&:hover': { color: "blue" } }} />
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
<Button sx={{padding: "13px", marginTop: "20px", width: "100%", fontWeight: "500", backgroundColor: theme.red, '&:hover': {backgroundColor: theme.redHover}}} variant="contained" onClick={removeItem} disableElevation>Delete</Button>
</Stack>

</MuiPopup> : null }



{popupOpen ? <MuiPopup isOpen={popupOpen} onClose={closePopup}>

        <Stack>
          <Stack flex={1} direction="row" justifyContent="space-between">
            <Typography variant="span" component="h2" marginBottom="10px">
              Added link
            </Typography>
            <CloseIcon onClick={closePopup} />
          </Stack>
          <TextField
            name="link"
            label="Link"
            variant="outlined"
            value={props.itemData.link}
            sx={{ marginBottom: "10px" }} />
          

        </Stack>
   
</MuiPopup> : null }


{picPopupOpen ? (
  <MuiPopup isOpen={picPopupOpen} onClose={closePopup}>
      <Stack>
        <Stack flex={1} direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="span" component="h2" marginBottom="10px">
           Added picture 
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
  {props.itemData.productImageKey || props.itemData.image ? (
    <>
      <img
        width="100%"
        height="300px"
        style={{ objectFit: "contain" }}
        src={props.itemData.image ? URL.createObjectURL(props.itemData.image) : `${process.env.NEXT_PUBLIC_PROFILE_URL}/${props.itemData.productImageKey}`}
      />
    </>
  ) : (
    <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 100, color: theme.palette.text.secondary }} />
  )}

  <input
    type="file"
    name="image"
    style={{ width: "0px", borderRadius: "5px" }}
    accept="image/jpeg,image/png,image/webp"

  />
</Button>
 </Stack>
  </MuiPopup>
) : null}




        </div>

  )
}

export default React.memo(SharedItem)