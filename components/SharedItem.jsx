"use client"

import { Stack, Select, MenuItem, IconButton, Typography, Tooltip, Link, Dialog, DialogContent, DialogTitle, useMediaQuery} from '@mui/material'
import NordicWalkingIcon from '@mui/icons-material/NordicWalking';
import { useTheme } from '@emotion/react';
import React, { useState } from 'react';
import CloseIcon from "@mui/icons-material/Close";
import Item from './custom/SharedItem/Item';

const SharedItem = (props) => {

  const [picPopupOpen, setPicPopupOpen] = useState(false)
  
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    <Stack mb={0.5} pb={0.5} flexDirection="row" justifyContent={theme.between} alignItems={theme.end}>
      {props.itemData.productImageKey ? <img src={`${process.env.NEXT_PUBLIC_PROFILE_URL}/${props.itemData.productImageKey}`} onClick={() => setPicPopupOpen(true)} style={{marginRight: "10px", objectFit: "cover"}} width="50px" height="40px" alt='item'/> : null }
      {props.itemData.link ? (
          <Link 
          href={props.itemData.link} 
          target="_blank" 
          rel="noopener" 
          underline="none" 
          cursor="pointer"
          sx={{ 
            width: '50%', 
            marginRight: "15px", 
            fontSize: 12, 
            color: theme.palette.info.main, 
            cursor: "pointer",
          }}
        >
          <Item size='small' linkColor={theme.palette.info.main} variant='standard' placeholder='name' name='name' value={props.itemData.name} width="100%" readOnly />

        </Link>
        ) : (
          <Item size='small' variant='standard' placeholder='name' name='name' value={props.itemData.name} readOnly width="50%" />
        )}
        
        <Item size='small' variant='standard' placeholder='note' name='description' value={props.itemData.description} readOnly width="100%" />
        <Item size='small' variant='standard' placeholder='price' name='price' label="$ price" value={props.itemData.price} readOnly width="12%" />
        <Item size='small' variant='standard' placeholder='qty' name='qty' label="qty" value={props.itemData.qty} readOnly width="12%" />
        <Item size='small' variant='standard' placeholder='weight' name='weight' label="weight" value={props.itemData.weight} readOnly width="12%" />

       <Typography fontSize="12px" variant='span' component="span" border="1px solid gray" borderRadius="3px" padding="7px">{props?.weightOption}</Typography>

      <Select size='small' variant='outlined' disabled name='priority' sx={{width: '15%', fontSize: "12px",  marginRight: "15px", marginLeft: "15px", backgroundColor: getBackgroundColor(props.itemData.priority)}} value={props.itemData.priority}>  
       <MenuItem sx={{fontSize: "12px"}} value="low">Low priority</MenuItem>
       <MenuItem sx={{fontSize: "12px"}} value="medium">Med priority</MenuItem>
       <MenuItem sx={{fontSize: "12px"}} value="high">High priority</MenuItem>
      </Select>
      
            <Tooltip title={ props.itemData.worn ? "I wear it" : null }>
              <IconButton>
                <NordicWalkingIcon sx={{ fontSize: "14px", color: props.itemData.worn ? theme.green : null, '&:hover': { color: theme.green } }} />
              </IconButton>
            </Tooltip>
            </Stack>
  
{picPopupOpen ? (
  <Dialog
  open={picPopupOpen}
  onClose={closePopup}
  maxWidth="lg"
  PaperProps={{
    style: {
      overflow: "hidden",
      width:  isMobile ? "100%" : "500px"
     
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
      style={{width: "100%", height: "300px", objectFit: "contain"}}
    />
  </DialogContent>
 
</Dialog>
) : null}


        </div>

  )
}

export default React.memo(SharedItem)