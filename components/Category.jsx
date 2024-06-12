import { Stack, Typography, IconButton, Button, TextField, Tooltip} from "@mui/material";
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import { useState, useTransition, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { useTheme } from '@emotion/react';
import PlusOneIcon from '@mui/icons-material/PlusOne';
import Item from './Item'
import axios from "axios";
import React from "react";
import MuiPopup from "./custom/MuiPopup";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import {useDrag, useDrop } from "react-dnd";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import FolderDeleteOutlinedIcon from '@mui/icons-material/FolderDeleteOutlined';


const Category = (props) => {

  const theme = useTheme()
  const router = useRouter();

  const [showItems, setShowItems] = useState(true);
  const [removePopupOpen ,setRemovePopupOpen] = useState(false)
  const [updatedCategory, setUpdatedCategory] = useState({name: props?.categoryData?.name})
  const [isShowingEdit, setIsShowingEdit] = useState(false)
  const [isDragging, setIsDragging] = useState(false);
  const [itemsData, setItemsData] = useState(props.items || []);
  const [selectedItems, setSelectedItems] = useState([]);




  const itemsOfCategory = itemsData?.filter((item) => item.categoryId === props.categoryData._id);

  const itemsSelected = itemsOfCategory?.some((item) => item.selected === true);

  const type = "Item";

  useEffect(() => {
    setItemsData(props.items || []);
  }, [props.items, selectedItems]);



  const DraggableItem = ({ item, index, moveItems, setIsDragging }) => {

    const ref = useRef(null);
  
    const [, drop] = useDrop({
      accept: type,
      hover(item) {
        if (item.index !== index) {
          moveItems(item.index, index);
          item.index = index;

        }
      },
    });

  
    const [{ isDragging }, drag] = useDrag({
      type,
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: () => {
        setIsDragging(false);
      },
    });


    useEffect(() => {
      if (isDragging) {
        setIsDragging(true);
      }
    }, [isDragging]);
    
  
    drag(drop(ref));

   
      
    return (
      <Stack
       width="100%"
       ref={ref}>
        <Stack>
        <Item key={item._id} itemData={item} session={props.session} drag={drag} />
        </Stack>
      </Stack>
    );
  }




  const removeItems = async () => {
    
    const itemsToDelete = itemsOfCategory.filter(item => item.selected === true);
  
    try {
      itemsToDelete.forEach(async item => {
        await axios.delete(`/items/${item._id}/${props.session.user.id}`);
      });
      router.refresh();
    } catch (error) {
      console.error('Failed to delete items:', error);
    }
  };




  const moveItems = (fromIndex, toIndex) => {
    
    const categoryItems = itemsData.filter(item => item.categoryId === props.categoryData._id);
    const movedItem = categoryItems.splice(fromIndex, 1)[0];
    categoryItems.splice(toIndex, 0, movedItem);

    const reorderedItems = categoryItems.map((item, index) => ({
      ...item,
      order: index,
    }));

  
    setItemsData(reorderedItems);
    saveItemsOrder(reorderedItems);
    
  };




const saveItemsOrder = async (updatedItems) => {
  try {

  const arr = {items: updatedItems}

    await axios.put('/items', arr);
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
    <Stack width={theme.category.width}  display={theme.flexBox} mb={0.5} justifyContent={theme.center} borderBottom="1px solid gray" onClick={() => console.log(selectedItems)}>
 
      <Stack display={theme.flexBox} direction="row" justifyContent={theme.between} alignItems={theme.center} pt={0.8} pb={0.3}>


      <Stack display="flex" direction="row" alignItems="center" justifyContent="flex-start" width="100%" >
     { isShowingEdit ? <EditIcon sx={{fontSize: "12px", color: "gray", marginBottom: "5px", marginLeft: "5px"}}/> : null}
      <TextField size="small" placeholder="Category name" variant="standard" name="name" sx={{width: "100%", paddingLeft: "3px"}} value={updatedCategory.name} 
      inputProps={{maxLength: 94, style: {fontSize: 13 }}} InputProps={{ disableUnderline: true }} onChange={handleChange} onBlur={saveCategoryName} />
      </Stack>
  
      
  
      <Stack display={theme.flexBox} direction="row"  mr={1}>
    { itemsSelected ? <Tooltip title="Delete items"><IconButton onClick={removeItems}><DeleteOutlinedIcon sx={{ fontSize: "18px", '&:hover':{color: "red"}}} /> </IconButton> </Tooltip> : null }
     <Tooltip title="Delete category"><IconButton onClick={openPopup}><FolderDeleteOutlinedIcon sx={{ fontSize: "18px", '&:hover':{color: "red"}}} /> </IconButton> </Tooltip>
      <IconButton onClick={() => setShowItems(!showItems)}>{showItems ? <ExpandLessOutlinedIcon sx={{fontSize: "18px"}} /> : <ExpandMoreOutlinedIcon sx={{fontSize: "18px"}} />}</IconButton>
       </Stack>

       </Stack>

      {showItems && (
        <Stack sx={{ borderBottomRightRadius: theme.radius, borderBottomLeftRadius: theme.radius}} pb={1} width="100%" height={theme.auto}>

        <Divider sx={{marginBottom: "5px"}}/>

       
          {itemsOfCategory.sort((a, b) => a.order - b.order).map((item, index) => (
                 <Stack width="100%" key={item._id} sx={{ backgroundColor: isDragging ? "rgba(0, 172, 28, 0.2);" : null, boxShadow: isDragging ? "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px" : null , borderRadius: "7px", marginBottom: isDragging ? "10px" : null}}><DraggableItem  item={item} index={index} moveItems={moveItems} isDragging={isDragging} setIsDragging={setIsDragging}  /></Stack>
                ))}
    

        <Typography variant="span" component="span" pt={1.5} pb={0.5} pl={0.5} fontSize="12px" display={theme.flexBox} width="145px" flexDirection="row"
           sx={{cursor: 'pointer', '&:hover': { textDecoration: 'underline', color: theme.green}}} onClick={addItem}>Add new item <PlusOneIcon sx={{ fontSize: "13px", marginLeft: "3px"}}/></Typography>
        </Stack>
      )}



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
