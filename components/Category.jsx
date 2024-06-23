"use client"

import { Stack, Typography, IconButton, Button, TextField, Tooltip} from "@mui/material";
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useTheme } from '@emotion/react';
import PlusOneIcon from '@mui/icons-material/PlusOne';
import Item from './Item'
import axios from "axios";
import React from "react";
import MuiPopup from "./custom/MuiPopup";
import CloseIcon from "@mui/icons-material/Close";
import Divider from '@mui/material/Divider';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import FolderDeleteOutlinedIcon from '@mui/icons-material/FolderDeleteOutlined';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, closestCorners} from '@dnd-kit/core';
import {SortableContext, verticalListSortingStrategy, useSortable} from "@dnd-kit/sortable"

import { CSS } from "@dnd-kit/utilities";

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const Category = (props) => {

  const theme = useTheme()
  const router = useRouter();

  const [showItems, setShowItems] = useState(true);
  const [removePopupOpen ,setRemovePopupOpen] = useState(false)
  const [updatedCategory, setUpdatedCategory] = useState({name: props?.categoryData?.name})
  const [itemsData, setItemsData] = useState(props.items || []);
  const [checkedItems, setCheckedItems] = useState([]);


  const handleUpdateChecked = (id, checked) => {
    setCheckedItems(prevItems => {
      if (checked) {
        return [...prevItems, { id, checked }];
      } else {
        return prevItems.filter(item => item.id !== id);
      }
    });
  };



  useEffect(() => {
    setItemsData(props.items || []);
  }, [props.items]);


  const mouseSensor = useSensor(MouseSensor, {
   
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });



  const sensors = useSensors(
    mouseSensor,
    touchSensor,
  );




  const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id: props.categoryData.order})

  const style = {

      transition,
      transform: CSS.Translate.toString(transform),
      opacity: isDragging ? 0.5 : 1,
  }


  const itemsOfCategory = itemsData?.filter((item) => item.categoryId === props.categoryData._id);



  const removeItems = async () => {
    try {
      for (const item of checkedItems) {
        await axios.delete(`/items/${item.id}/${props.session.user.id}`);
      }
      router.refresh();
      setCheckedItems([]); 
      
    } catch (error) {
      console.error('Failed to delete items:', error);
    }
  };





  const moveItem = async (fromIndex, toIndex) => {

    try {
    
    const updatedItems = [...itemsData];

    const itemsOfCategory = updatedItems.filter((item) => item.categoryId === props.categoryData._id);

    const movedItem = itemsOfCategory[fromIndex];

    itemsOfCategory.splice(fromIndex, 1);
    itemsOfCategory.splice(toIndex, 0,  movedItem);

    const reorderedItems = itemsOfCategory.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    setItemsData(reorderedItems); 

    await saveItemsOrder(reorderedItems);

  } 

  catch (error) {
    console.error('Failed to move item:', error);
  }

  };



  const onDragEnd = (event) => {
    const { active, over } = event;
  
    if (!over) return;
  
    const fromIndex = itemsOfCategory.findIndex(item => item.order === active.id);
    const toIndex = itemsOfCategory.findIndex(item => item.order === over.id);
  
    if (fromIndex !== -1 && toIndex !== -1) {
      moveItem(fromIndex, toIndex);
    }
  };



const saveItemsOrder = async (updatedItems) => {
  try {

  const arr = {items: updatedItems}

    await axios.put('/items', arr);
    console.log("updated")
  } catch (error) {
    console.error('Failed to save items order:', error);
  }
};



  const addItem =  async () => {

    const itemObj = { userId: props.session.user.id, tripId: props.categoryData.tripId, bagId: props.categoryData.bagId, categoryId: props.categoryData._id, name: "new item", qty: 1, weight: 0.1, price: 0.00}
     
    try {
      await axios.post('/items/new', itemObj);
      router.refresh();
    }
     catch (error) {
          console.log(error)
     }
    }



    const openPopup = () => {
       setRemovePopupOpen(true)
    }


    const closePopup = () => {
      setRemovePopupOpen(false);
    };

    const removeCategory = async () => {

        try {
          const categoryId = props.categoryData._id;
          await axios.delete(`/categories/${categoryId}/${props?.session?.user?.id}`);
          setRemovePopupOpen(false)
          router.refresh();
        }
         catch (error) {
            console.log(error)
         }
    }


    const handleChange = (e) => {
      setUpdatedCategory({ name: e.target.value });
    };
  

     const saveCategoryName = async () => {
       
      try {
        await axios.put(`/categories/${props.categoryData._id}/${props?.session?.user?.id}`, updatedCategory);
        router.refresh();
      }
       catch (error) {
            console.log(error)
       }
     }


  return (
    <Stack width={theme.category.width}  display={theme.flexBox} mb={1}  backgroundColor={ theme.palette.mode === "dark" ? theme.main.darkColor : "#f5f5f5" } ref={setNodeRef} style={style} boxShadow={"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;"}>

  
      <Stack display={theme.flexBox} direction="row" pt={0.8} pb={0.3}>


      <Stack display="flex" direction="row" alignItems="center" justifyContent="center" width="100%" >
      <IconButton {...attributes} {...listeners} sx={{cursor: "grabbing"}} >
          <DragIndicatorIcon sx={{fontSize: "15px"}}/>
        </IconButton> 
 
      <TextField size="small" placeholder="Category name" variant="standard" name="name" sx={{width: "100%", paddingLeft: "5px"}} value={updatedCategory.name}
      inputProps={{maxLength: 94, style: {fontSize: 13 }}} InputProps={{ disableUnderline: true }} onChange={handleChange} onBlur={saveCategoryName} />
      </Stack>
  
      
  
      <Stack display={theme.flexBox} direction="row" >
    { checkedItems.length ? <Tooltip title="Delete items"><IconButton onClick={removeItems}><DeleteOutlinedIcon sx={{ fontSize: "18px", '&:hover':{color: "red"}}} /> </IconButton> </Tooltip> : null }
     <Tooltip title="Delete category"><IconButton onClick={openPopup}><FolderDeleteOutlinedIcon sx={{ fontSize: "18px", '&:hover':{color: "red"}}} /> </IconButton> </Tooltip>
      <IconButton onClick={() => setShowItems(!showItems)}>{showItems ? <ExpandLessOutlinedIcon sx={{fontSize: "18px"}} /> : <ExpandMoreOutlinedIcon sx={{fontSize: "18px"}} />}</IconButton>
       </Stack>

       </Stack>


       <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd} sensors={sensors}>

      {showItems && (
        <Stack sx={{ borderBottomRightRadius: theme.radius, borderBottomLeftRadius: theme.radius}} pt={0.5} pb={1} borderTop="1px solid gray" width="100%" height={theme.auto}>

        

        <SortableContext items={itemsOfCategory.map(item => item.order)} strategy={verticalListSortingStrategy}>
          {itemsOfCategory.sort((a, b) => a.order - b.order).map((item, index) => (
                <Item key={item._id} itemData={item} session={props.session}  onUpdateChecked={handleUpdateChecked} />
                ))}

        </SortableContext>
    

       

        <Typography variant="span" component="span" pt={1.5} pb={0.5} pl={0.5} fontSize="12px" display={theme.flexBox} width="145px" flexDirection="row"
           sx={{cursor: 'pointer',marginLeft: "7px", '&:hover': { textDecoration: 'underline', color: theme.green}}} onClick={addItem}>Add new item <PlusOneIcon sx={{ fontSize: "13px", marginLeft: "3px"}}/></Typography>
        </Stack>
      )}

     </DndContext>



{ removePopupOpen ? <MuiPopup isOpen={removePopupOpen} onClose={closePopup}>
<Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">

<Stack width="90%">
<Typography variant='span' component="h2" fontWeight="600" mb={1.5}>Delete Category </Typography>
<Typography variant='span' component="span">
   Are you sure you want to delete this category? This action cannot be undone.
   Deleting this category will permanently remove it from the system, and any associated data will be lost.</Typography>
</Stack>

<CloseIcon onClick={closePopup} sx={{cursor: "pointer"}}/>
<Button sx={{color: theme.palette.mode === "dark" ? "white" : null, marginTop: "20px", width: "100%", fontWeight: "500", backgroundColor: theme.red, '&:hover': {backgroundColor: theme.redHover}}} variant="contained" onClick={removeCategory} disableElevation>Delete</Button>
</Stack>

</MuiPopup> : null }

    </Stack>
  );
};

export default React.memo(Category);