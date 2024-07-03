"use client"

import { Stack, TextField, Select, MenuItem, IconButton, Typography, Button, Tooltip, Checkbox} from '@mui/material'
import LinkIcon from '@mui/icons-material/Link';
import NordicWalkingIcon from '@mui/icons-material/NordicWalking';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useTheme } from '@emotion/react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import MuiPopup from './custom/MuiPopup';
import CloseIcon from "@mui/icons-material/Close";
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {useSortable} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities";
import useRefresh from './hooks/useRefresh'


const Item = (props) => {

  const [popupOpen, setPopupOpen] = useState(false)
  const [picPopupOpen, setPicPopupOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showEditIcon, setShowEditIcon] = useState(false)
  const [itemData, setItem] = useState({ userId: props.itemData.creator, _id: props.itemData._id, tripId: props.itemData.tripId, bagId: props.itemData.bagId, categoryId: props.itemData.categoryId, name: props.itemData.name, selected: props.itemData.selected,
    priority: props.itemData.priority, description: props.itemData.description || '',  qty: +props.itemData.qty || 1, weight: +props.itemData.weight || 0.1, link: props.itemData.link, worn: props.itemData.worn, productImageKey: props.itemData.productImageKey, image: null, price: props.itemData.price || 0,});

    const theme = useTheme()
    const router = useRouter();

    const { refresh } = useRefresh();


    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id: props.itemData.order})

    const style = {

      transition,
      transform: CSS.Translate.toString(transform),
      opacity: isDragging ? 0.9 : 1,
  }


   const closePopup = () => {
     setLoading(false)
     setPopupOpen(false)
     setPicPopupOpen(false)
     
   };


   const updateChecked = async (e) => {

    setItem({...itemData, checked: e.target.checked})
    props.onUpdateChecked(itemData._id, e.target.checked);
         
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

        props.loading(true)
        await axios.put(`/items/${itemData._id}/${props?.session?.user?.id}`, { ...itemData, worn: !itemData.worn });
        await refresh();
        props.loading(false)
      }
       catch (error) {
            console.log(error)
       }
    };


    const duplicateItem = async () => {

    const duplicatedItem = { ...itemData };
    delete duplicatedItem._id;
    try {
      props.loading(true)
      await axios.post('/items/new', duplicatedItem);
     await refresh();
     props.loading(false)
    }
     catch (error) {
          console.log(error)
     }
      
    }

  

    const saveLink = async (e) => {
      
      e.preventDefault()
      try {
        setLoading(true)
        await axios.put(`/items/${itemData._id}/${props?.session?.user?.id}`, itemData);
        setPopupOpen(false)
        setLoading(false)
        
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

    
    <div className="scroll-div" sx={{ overflowX: "scroll"}}  ref={setNodeRef} style={style}>
        
      <Stack mb={0.5} pb={0.5} flexDirection="row" justifyContent={theme.between} alignItems={theme.end}  boxShadow={isDragging ? "rgba(0, 0, 0, 0.15) 0px 2px 8px;" : null}>

      <IconButton {...attributes} {...listeners} sx={{cursor: "grabbing"}} >
          <DragIndicatorIcon sx={{fontSize: "14px"}}/>
        </IconButton> 
     
      <Checkbox size="small" name='selected' sx={{transform: "scale(0.8)", marginBottom: "-4px"}} onChange={updateChecked} checked={itemData.checked} /> 
      <TextField size='small' variant='standard' placeholder='name' name='name' sx={{ width: '50%', marginRight: "15px", borderBottom: theme.palette.mode === "dark" ? `1px solid gray` : "1px solid #C0C0C0"}} value={itemData.name} InputLabelProps={{ style : {fontSize: 12}}} InputProps={{disableUnderline: true}} inputProps={{style: {fontSize: 12}}} onChange={handleChange} onBlur={saveItemData}/>
      <TextField size='small' variant='standard' placeholder='note' name='description' sx={{ width: '100%', marginRight: "15px", borderBottom: theme.palette.mode === "dark" ? `1px solid gray` : "1px solid #C0C0C0"}} value={itemData.description} InputLabelProps={{ style : {fontSize: 12}}} inputProps={{style: {fontSize: 12}}} InputProps={{disableUnderline: true}} onChange={handleChange} onBlur={saveItemData} />
      <TextField size='small' variant='standard' type='number' name='price' label="$ price" step="any" sx={{width: '10%', marginRight: "15px", borderBottom: theme.palette.mode === "dark" ? `1px solid gray` : "1px solid #C0C0C0"}} value={itemData.price} onChange={handleChange} InputLabelProps={{ style : {fontSize: 12}}} InputProps={{disableUnderline: true}} inputProps={{ min: 1, max: 99, style: {fontSize: 12} }} onBlur={saveItemData}/>
      <TextField size='small' variant='standard' type='number' name='qty' label="qty" sx={{width: '10%', marginRight: "15px", borderBottom: theme.palette.mode === "dark" ? `1px solid gray` : "1px solid #C0C0C0"}} value={itemData.qty} onChange={handleChange} InputLabelProps={{ style : {fontSize: 12}}} InputProps={{disableUnderline: true}} inputProps={{ min: 1, max: 99, style: {fontSize: 12} }} />
      <TextField size='small' variant='standard' type='number' name='weight' label='weight' sx={{width: '12%', marginRight: "10px", borderBottom: theme.palette.mode === "dark" ? `1px solid gray` : "1px solid #C0C0C0"}} value={itemData.weight} onChange={handleChange} InputLabelProps={{ style : {fontSize: 12}}} InputProps={{disableUnderline: true}} inputProps={{ min: 0.1, max: 99, style: {fontSize: 12} }} />
       <Typography fontSize="12px" variant='span' component="span" border="1px solid gray" borderRadius="3px" padding="7px">{props?.session?.user?.weightOption}</Typography>
      <Select size='small' variant='outlined' name='priority' sx={{width: '15%', fontSize: "12px",  marginRight: "10px", marginLeft: "15px", backgroundColor: getBackgroundColor(itemData.priority)}} value={itemData.priority} onChange={handleChange} onBlur={saveItemData}>  
       <MenuItem sx={{fontSize: "12px"}} value="low">Low priority</MenuItem>
       <MenuItem sx={{fontSize: "12px"}} value="medium">Med priority</MenuItem>
       <MenuItem sx={{fontSize: "12px"}} value="high">High priority</MenuItem>
      </Select>
 

      <Stack display={theme.flexBox} flexDirection="row" justifyContent="space-between" alignItems="space-between">

            <Tooltip title="Picture">
              <IconButton onClick={() => setPicPopupOpen(true)}>
                <ImageOutlinedIcon sx={{ fontSize: "15px", color: itemData.image || itemData.productImageKey ? theme.green : null, '&:hover': { color: theme.green } }} />
              </IconButton>
            </Tooltip>
            <Tooltip title={itemData.worn ? "I wear it" : null }>
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
    



<MuiPopup isOpen={popupOpen} onClose={closePopup}>
   <form onSubmit={saveLink}>
          <Stack direction="column">
            <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6" component="h2" mb={0.5}>
             Attach a link
            </Typography>
            <CloseIcon onClick={closePopup} />
            </Stack>
            <Typography variant='span' component="span" mb={2}>
            Provide a link that relates to this item for further reference.</Typography>
          </Stack>
          <TextField
            name="link"
            label="Link"
            variant="outlined"
            value={itemData.link}
            onChange={handleChange}
            sx={{ marginBottom: "15px", width: "100%" }} />
          
          <Button type="submit" sx={{ color: theme.palette.mode === "dark" ? "white" : null, width: "100%", fontWeight: "500", backgroundColor: theme.green}} variant="contained" disableElevation>Save {loading ?  <CircularProgress color="inherit" size={16} sx={{marginLeft: "10px"}} /> : null}</Button> 
      </form>
</MuiPopup> 



  <MuiPopup isOpen={picPopupOpen} onClose={closePopup}>
    <form onSubmit={savePicture}>
      <Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" component="h2">
           Upload item picture
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

    { showEditIcon ? <ChangeCircleOutlinedIcon sx={{position: "absolute", fontSize: 50, color: theme.palette.text.secondary }} /> : null }
    </>
  ) : (
    <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 50, color: theme.palette.text.secondary }} />
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
  Save {loading ?  <CircularProgress color="inherit" size={16} sx={{marginLeft: "10px"}} /> : null}
 </Button>

      </Stack>
    </form>
  </MuiPopup>





        </div>

  )
}

export default React.memo(Item)