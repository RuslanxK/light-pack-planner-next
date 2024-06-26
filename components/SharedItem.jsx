"use client"

import { Stack, TextField, Select, MenuItem, IconButton, Typography, Tooltip, Link, Dialog, DialogContent, DialogTitle} from '@mui/material'
import NordicWalkingIcon from '@mui/icons-material/NordicWalking';
import { useTheme } from '@emotion/react';
import React, { useState } from 'react';
import CloseIcon from "@mui/icons-material/Close";

const SharedItem = (props) => {

  const [picPopupOpen, setPicPopupOpen] = useState(false)
  

    const theme = useTheme()


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

        setPicPopupOpen(false)
        
      };


  return (

    
    <div className="scroll-div">
    
      
      <Stack  mb={0.5} pb={0.5} pl={1} pr={1} flexDirection="row" alignItems={theme.end}>

      {props.itemData.productImageKey ? <img src={`${process.env.NEXT_PUBLIC_PROFILE_URL}/${props.itemData.productImageKey}`} onClick={() => setPicPopupOpen(true)} style={{marginRight: "10px"}} width="50px" height="50px" alt='item'/> : null }

      {props.itemData.link ? (
          <Link href={props.itemData.link} target="_blank" rel="noopener" underline="none" sx={{ width: '50%', marginRight: "15px", borderBottom: theme.palette.mode === "dark" ? `1px solid ${theme.main.darkColor}` : "1px solid #C0C0C0", fontSize: 12, color: theme.palette.info.main }}>
            {props.itemData.name}
          </Link>
        ) : (
          <TextField size='small' variant='standard' placeholder='name' name='name' sx={{ width: '50%', marginRight: "15px", borderBottom: theme.palette.mode === "dark" ? `1px solid gray` : "1px solid #C0C0C0" }} value={props.itemData.name} InputLabelProps={{ style: { fontSize: 12 } }} InputProps={{ disableUnderline: true, readOnly: true }} inputProps={{ style: { fontSize: 12 } }} />
        )}
      <TextField size='small' variant='standard' placeholder='note' name='description' sx={{ width: '100%', marginRight: "15px", borderBottom: theme.palette.mode === "dark" ? `1px solid gray` : "1px solid #C0C0C0"}} value={props.itemData.description} InputLabelProps={{style : {fontSize: 12}}} inputProps={{readOnly: true, style: {fontSize: 12}}} InputProps={{disableUnderline: true}} />
      <TextField size='small' variant='standard' type='number' name='price' label="$ price" step="any" sx={{width: '10%', marginRight: "15px", borderBottom: theme.palette.mode === "dark" ? `1px solid gray` : "1px solid #C0C0C0"}} value={props.itemData.price} InputLabelProps={{ style : {fontSize: 12}}} InputProps={{disableUnderline: true, readOnly: true}} inputProps={{ min: 1, max: 99, style: {fontSize: 12} }} />
      <TextField size='small' variant='standard' type='number' name='qty' label="qty" sx={{width: '10%', marginRight: "15px", borderBottom: theme.palette.mode === "dark" ? `1px solid gray` : "1px solid #C0C0C0"}} value={props.itemData.qty} InputLabelProps={{ style : {fontSize: 12}}} InputProps={{disableUnderline: true, readOnly: true}} inputProps={{ min: 1, max: 99, style: {fontSize: 12} }} />
      <TextField size='small' variant='standard' type='number' name='weight' label='weight' sx={{width: '12%', marginRight: "10px", borderBottom: theme.palette.mode === "dark" ? `1px solid gray` : "1px solid #C0C0C0"}} value={props.itemData.weight} InputLabelProps={{ style : {fontSize: 12}}} InputProps={{disableUnderline: true, readOnly: true}} inputProps={{ min: 0.1, max: 99, style: {fontSize: 12} }} />
       <Typography fontSize="12px" variant='span' component="span" border="1px solid gray" borderRadius="3px" padding="7px">{props?.weightOption}</Typography>

      
      <Select size='small' variant='outlined' disabled name='priority' sx={{width: '12%', fontSize: "12px",  marginRight: "10px", marginLeft: "15px", backgroundColor: getBackgroundColor(props.itemData.priority)}} value={props.itemData.priority}>  
       <MenuItem sx={{fontSize: "12px"}} value="low">Low priority</MenuItem>
       <MenuItem sx={{fontSize: "12px"}} value="medium">Med priority</MenuItem>
       <MenuItem sx={{fontSize: "12px"}} value="high">High priority</MenuItem>
      </Select>
      


      <Stack display={theme.flexBox} flexDirection="row">
          
            <Tooltip title={ props.itemData.worn ? "I wear it" : null }>
              <IconButton>
                <NordicWalkingIcon sx={{ fontSize: "14px", color: props.itemData.worn ? theme.green : null, '&:hover': { color: theme.green } }} />
              </IconButton>
            </Tooltip>
      
            
          </Stack>
          </Stack>
    
      

    

{picPopupOpen ? (
  <Dialog
  open={picPopupOpen}
  onClose={closePopup}
  maxWidth="lg"
  PaperProps={{
    style: {
      overflow: "hidden",
      position: "relative",
      background: "transparent"
    }
  }}
>
  <DialogTitle sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
    <IconButton onClick={closePopup} sx={{ zIndex: 1000, color: theme.palette.text.primary}}>
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  <DialogContent>
    <img
      src={`${process.env.NEXT_PUBLIC_PROFILE_URL}/${props.itemData.productImageKey}`}
      alt="item"
      style={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
    />
  </DialogContent>
 
</Dialog>
) : null}




        </div>

  )
}

export default React.memo(SharedItem)