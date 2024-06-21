"use client"

import { Stack, Typography, IconButton, Box, TextField, Button, Container, Tooltip, Badge } from '@mui/material'
import Category from '../components/Category'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useTransition, useState, useEffect, useRef } from 'react';
import { useTheme } from '@emotion/react';
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import MuiPopup from './custom/MuiPopup';
import CloseIcon from "@mui/icons-material/Close";
import MonitorWeightOutlinedIcon from "@mui/icons-material/MonitorWeightOutlined";
import DataSaverOffOutlinedIcon from "@mui/icons-material/DataSaverOffOutlined";
import NordicWalkingIcon from '@mui/icons-material/NordicWalking';
import { PieChart, pieArcLabelClasses} from "@mui/x-charts/PieChart";
import SideItem from '../components/SideItem'
import FlipCameraIosOutlinedIcon from '@mui/icons-material/FlipCameraIosOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { DndContext, closestCenter, closestCorners,  KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors} from '@dnd-kit/core';
import {SortableContext, arrayMove, verticalListSortingStrategy} from "@dnd-kit/sortable"



const InnerBag = ({bagData, items, session}) => {

  const router = useRouter();
  const theme = useTheme()

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [editedBag, setEditedBag] = useState({tripId: bagData?.bag?.tripId, name: bagData?.bag?.name, goal: bagData?.bag?.goal, description: bagData?.bag?.description})
  const [showSideBarMobile, setShowSideBarMobile] = useState(false)
  const [categoriesData, setCategoriesData] = useState(bagData?.categories || []);
  const [isScrolling, setIsScrolling] = useState(false);



  useEffect(() => {
    const handleTouchStart = () => setIsScrolling(true);
    const handleTouchEnd = () => setIsScrolling(false);

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);


  

  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });


  const sensors = useSensors(
    mouseSensor,
    touchSensor,
    
  );


  const handleChange = (event) => {
    let { name, value } = event.target;
    setEditedBag({ ...editedBag, [name]: value });
  };



  useEffect(() => {
    setCategoriesData(bagData?.categories || []);
  }, [bagData]);

  
  const allBagsItems = items.map((item) => { return <SideItem key={item._id} itemData={item} color="white" categoryData={bagData?.categories} update={() => router.refresh()}  /> }) 

  const itemsTotal = bagData?.items?.reduce((acc, item) => acc + item.qty, 0) 

  const categoryWeightsArr = bagData?.totalWeightCategory 
  const categoryPieChartData = bagData?.categories?.map((category) => {  
  const categoryWeight = categoryWeightsArr?.categoriesTotalWeight?.find((item) => item.categoryId === category._id)

  

        return {
          id: category._id,
          value: categoryWeight?.totalWeight || 0 ,
          label: category?.name?.length > 10 ? `${category?.name?.substring(0, 10)}...` : `${category?.name}`
        };
      })
    ;

  const TOTAL = categoryWeightsArr?.categoriesTotalWeight?.map((category) => category.totalWeight).reduce((a, b) => a + b, 0) 
  const getArcLabel = (params) => {
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(0)}%`;
  };


  const addCategory = async () => {
    const newCategory = {userId: session?.user?.id, bagId: bagData?.bag?._id, tripId: bagData?.bag?.tripId, name: 'new category' };
    try {
      const res = await axios.post('/categories/new', newCategory);
      router.refresh();
    } catch (err) {
      console.log(err);
    }
  };


  const openPopup = () => {
      setPopupOpen(true)
  }

  const closePopup = () => {
    setPopupOpen(false);
    setDeletePopupOpen(false)
  };

  const openRemovePopup = () => {
    setDeletePopupOpen(true)
}


  const updateBag = async (e) => {
     e.preventDefault()
    try {
        await axios.put(`/bags/${bagData.bag._id}/${session?.user?.id}`, editedBag)
        setPopupOpen(false)
        router.refresh();
    }
     catch (error) {
        console.log(error)
     }
  }


  const removeBag = async () => {
    try {
      await axios.delete(`/bags/${bagData.bag._id}/${session?.user?.id}`);
      setDeletePopupOpen(false)
      router.push(`/trips?id=${bagData.bag.tripId}`)
      router.refresh();
      
    }
     catch (error) {
        console.log(error)
     }
  }


  const showHideSideBar  = () => {
    setShowSideBarMobile(!showSideBarMobile)
  }




  const moveCategory = async (fromIndex, toIndex) => {
    try {
      const updatedCategories = [...categoriesData];
      const movedCategory = updatedCategories[fromIndex];
  
      // Remove the moved category from the original position
      updatedCategories.splice(fromIndex, 1);
  
      // Insert the moved category into the new position
      updatedCategories.splice(toIndex, 0, movedCategory);
  
      // Update the order property to start from 1
      const reorderedCategories = updatedCategories.map((category, index) => ({
        ...category,
        order: index + 1 // Start indexing from 1
      }));
  
      setCategoriesData(reorderedCategories); // Update state with reordered categories
  
      // Send reordered categories to backend to save the order
      await saveCategoriesOrder(reorderedCategories);
    } catch (error) {
      console.error('Failed to move category:', error);
    }
  };


  
  const onDragEnd = (event) => {
    console.log(event);
    const { active, over } = event;

    if (active.id === over.id) {
      return;
    }

    const fromIndex = categoriesData.findIndex(category => category.order === active.id);
    const toIndex = categoriesData.findIndex(category => category.order === over.id);

    if (fromIndex !== -1 && toIndex !== -1) {
      moveCategory(fromIndex, toIndex);
    }
  };



  const saveCategoriesOrder = async (updatedCategories) => {
    try {
      const arr = { categories: updatedCategories };
      await axios.put('/categories', arr);
      console.log("Updated categories order successfully");
    } catch (error) {
      console.error('Failed to save categories order:', error);
      throw new Error('Failed to save categories order');
    }
  };


  return (

    <Container sx={{display: "flex"}} maxWidth={false} disableGutters>
    { items?.length ? <div className="side-bar-icon-mobile"><IconButton onClick={showHideSideBar} sx={{ width: "40px", height: "40px", zIndex: "99", borderRadius: "100%", position: "fixed", bottom: "15px", left: "15px", backgroundColor: theme.green, color: "white", "&:hover": {backgroundColor: "#32CD32"}}}>{showSideBarMobile === true ? <CloseIcon /> : <FlipCameraIosOutlinedIcon sx={{fontSize: "20px"}}/> }</IconButton></div> : null }
    <div className="share-icon-mobile"><IconButton onClick={() => window.open(`/share?id=${bagData.bag._id}`, '_blank')} sx={{ width: "40px", height: "40px", zIndex: "99", borderRadius: "100%", position: "fixed", bottom: "15px", right: "15px", backgroundColor: theme.palette.primary.dark, color: "white", "&:hover": {backgroundColor: theme.palette.info.main}}}><OpenInNewIcon sx={{fontSize: "20px"}}/></IconButton></div>


    <Box display="flex" flexDirection="row" width={theme.fullWidth} minHeight="100vh"height="100%">

    <Stack display={theme.flexBox} justifyContent={theme.start} width={theme.fullWidth} pb={3}>

        <div className="main-info">

       <Stack display={theme.flexBox} width="100%" flexDirection={theme.row} alignItems={theme.between} justifyContent={theme.between} boxShadow={'rgba(33, 35, 38, 0.1) 0px 10px 10px -10px;'}  backgroundColor={ theme.palette.mode === "dark" ? theme.main.darkColor : "#f2f2f2"} pt={1.5} pb={1.5} mb={3} borderRadius="7px">

        <Stack display="flex" direction="row" justifyContent={theme.between} width="100%" flexWrap="wrap">

        <Stack direction="row" alignItems="center">
        <IconButton sx={{backgroundColor: theme.palette.mode === "dark" ? theme.main.darkColor : "#f2f0f0", marginRight: "5px"}} onClick={() => router.push(`/trips?id=${bagData.bag.tripId}`)}><ArrowBackIcon sx={{fontSize: "20px"}}/></IconButton>
        <Typography component="h3" variant='span' fontWeight="600" mr={1}>{bagData?.bag?.name}</Typography>
        <Badge color="secondary" badgeContent={bagData.bag.likes || "0" } sx={{zIndex: 0}}>
        <Tooltip title="Total likes"><IconButton><FavoriteIcon sx={{fontSize: "20px"}}/></IconButton></Tooltip>
        </Badge>
        </Stack>
       

        <Stack direction="row">

       <div class="share-link-desktop"> <Tooltip title="Share Bag"><IconButton onClick={() => window.open(`/share?id=${bagData.bag._id}`, '_blank')}><OpenInNewIcon sx={{fontSize: "20px"}}/></IconButton></Tooltip> </div>
        <Tooltip title="Edit"><IconButton onClick={openPopup}><EditIcon sx={{fontSize: "20px", cursor: "pointer", "&:hover": { color: theme.orange }}}  /></IconButton> </Tooltip>
        <Tooltip title="Delete"><IconButton onClick={openRemovePopup}><DeleteOutlineOutlinedIcon sx={{ fontSize: "20px", cursor: "pointer", "&:hover": { color: "red" }}}  /></IconButton></Tooltip>
        </Stack>
        </Stack>
      
    
        </Stack>
        <Typography component="p" variant="p">
          {bagData?.bag?.description}
        </Typography>

        <div className='innerBagData'>
  
        <Stack justifyContent="center" alignItems="center">
        <IconButton><MonitorWeightOutlinedIcon sx={{fontSize: "22px"}}/> </IconButton>
        { bagData?.totalBagWeight > bagData?.bag?.goal ?  <Typography variant="span" component="span" sx={{ fontWeight: "bold", color: "red" }}>{bagData?.totalBagWeight?.toFixed(1)} / {bagData?.bag?.goal} {session?.user?.weightOption} </Typography> :  <Typography variant="span" component="span" sx={{ color: bagData?.totalBagWeight > 0.00 ? theme.green : null }}> {bagData?.totalBagWeight?.toFixed(1)} / {bagData?.bag?.goal} {session?.user?.weightOption} </Typography>  }
        </Stack>
        
        <Stack justifyContent="center" alignItems="center" pl={4} pr={4} >
        <IconButton><NordicWalkingIcon sx={{fontSize: "22px"}}/></IconButton>
        
        <Typography variant="span" component="span"> { bagData?.worn ? bagData?.worn?.toFixed(1) + "  " + session?.user?.weightOption : '0.0 ' + session?.user?.weightOption}</Typography>
        </Stack>

        <Stack justifyContent="center" alignItems="center">
        <IconButton><DataSaverOffOutlinedIcon sx={{fontSize: "22px"}}/></IconButton> {itemsTotal} items 
        </Stack>
        
         </div> 
         
      </div>

    { itemsTotal ?  <Stack>
      <PieChart 
    margin={{ top: 0, left:0, right:0, bottom: 0}} 
    series={[{
      data: categoryPieChartData,
      faded: {innerRadius: 30, additionalRadius: -15, color: 'gray'},
      highlightScope: { faded: 'global', highlighted: 'item' },
      arcLabel: getArcLabel,
      innerRadius: 35,
      outerRadius: 110,
      paddingAngle: 5,
      cornerRadius: 5,
      startAngle: -180,
      endAngle: 180,
      cx: 180,
      cy: 150,
      showLegend: false
    }]}
    sx={{[`& .${pieArcLabelClasses.root}`]: { fill: 'white', fontSize: 14, fontWeight: "300"}, visibility: itemsTotal ? "visible" :  "hidden"}}
    height={335}
    slotProps={{ legend: { hidden: true } }}
    tooltip={isScrolling ? { trigger: 'none' } : { trigger: 'item' }} 
  />

      </Stack> : null }


    <div className="categories">
    <Stack border="1px dashed gray" borderRadius={theme.radius} display={theme.flexBox} justifyContent={theme.center} alignItems={theme.center}
      width={theme.category.width} height={theme.category.height} mb={1} sx={{cursor: "pointer"}} onClick={addCategory}>
     <Tooltip title="Add category"><IconButton><AddOutlinedIcon sx={{fontSize: "20px", color: "gray" }}/></IconButton></Tooltip>
    </Stack>


    <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd} sensors={sensors}>

      <SortableContext items={categoriesData.map(category => category.order)} strategy={verticalListSortingStrategy}>

    {categoriesData.sort((a, b) => a.order - b.order).map((category, index) => (
                 <Category key={category._id} categoryData={category} items={bagData?.items} session={session} />
                ))}

</SortableContext>
    </DndContext>

  
    </div>

    </Stack>
   

    
     {items?.length && bagData?.categories.length ? 
     <div className="recent-desktop">
     <Stack width={theme.nav.width} height={theme.nav.height}>
     <Stack pt={2} display={theme.flexBox} alignItems={theme.left} position={theme.nav.fixed} height={theme.nav.height} width={theme.nav.width}  sx={{backgroundColor: theme.palette.mode === "dark" ? theme.main.darkColor : theme.green}}>
     <Typography component="h3" variant="span" textAlign="center" color="white">Recent Items</Typography>
     <Typography component="span" variant="span" textAlign="center" mb={3} color={theme.main.lightGray}>added to your plans</Typography>
     <Stack sx={{overflowY: "scroll"}} height="85.5vh" pl={3}>
     {allBagsItems}
     </Stack>
     </Stack>
     </Stack> 
     </div> : null }


     {items?.length && showSideBarMobile  ? 

     
     <div className="recent-mobile">
     <Stack width="185px" height={theme.nav.height}>
     <Stack pt={2} display={theme.flexBox} alignItems={theme.left} position={theme.nav.fixed} height={theme.nav.height} width="185px" sx={{backgroundColor: theme.green, borderTopLeftRadius: "25px"}}>
     <Typography component="h3" variant="span" textAlign="center" color="white">Recent Items</Typography>
     <Typography component="span" variant="span" textAlign="center" mb={3} color={theme.main.lightGray}>added to your plans</Typography>
     <Stack sx={{overflowY: "scroll"}} height="70vh" pl={3}>
     {allBagsItems}
     </Stack>
     </Stack>
     </Stack> 
     </div> : null }
    

     { isPopupOpen ?  <MuiPopup isOpen={isPopupOpen} onClose={closePopup} >
        <form onSubmit={updateBag}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">
             <Stack width="90%">
             <Typography variant='span' component="h2">Update Bag</Typography>
             <Typography variant='span' component="span" mb={3}>Popup content goes here</Typography>
             </Stack>
             <CloseIcon onClick={closePopup} sx={{cursor: "pointer"}}/>
             <TextField label="Bag name" name="name" required onChange={handleChange} sx={{width: "48.5%", marginBottom: "20px"}} value={editedBag.name || ""} inputProps={{ maxLength: 26 }}/>
             <TextField label={`Weight goal - ${session?.user?.weightOption}`} type="number" required name="goal" onChange={handleChange} sx={{width: "48.5%", marginBottom: "20px"}} value={editedBag.goal || ""} inputProps={{ min: 1 }} />
            <TextField multiline label="Description" name="description" onChange={handleChange} sx={{width: "100%"}} value={editedBag.description || "" } inputProps={{ maxLength: 200 }} /> 
            <Button type="submit"  sx={{color: theme.palette.mode === "dark" ? "white" : null, marginTop: "20px", width: "100%", fontWeight: "500", backgroundColor: theme.green}} variant="contained" disableElevation>Update</Button>
          </Stack>
      </form>
  </MuiPopup> : null }

{ isDeletePopupOpen ? <MuiPopup isOpen={isDeletePopupOpen} onClose={closePopup}>
<Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">
<Stack width="90%">
<Typography variant='span' component="h2" mb={1.5}>Delete Bag</Typography>
<Typography variant='span' component="span">
   Are you sure you want to delete this bag? This action cannot be undone.
   Deleting this bag will permanently remove it from the system, and any associated data will be lost.</Typography>
</Stack>


<CloseIcon onClick={closePopup} sx={{cursor: "pointer"}}/>
<Button sx={{marginTop: "20px", width: "100%", fontWeight: "500", color: theme.palette.mode === "dark" ? "white" : null, backgroundColor: theme.red, '&:hover': {backgroundColor: theme.redHover}}} variant="contained" onClick={removeBag} disableElevation>Delete</Button>
</Stack>
</MuiPopup> : null }
    </Box>
    </Container>
  )
}

export default InnerBag