"use client"

import { Stack, Typography, IconButton, Box, TextField, Button, Container, Tooltip, Badge, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Switch, Link} from '@mui/material'
import Category from '../components/Category'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect} from 'react';
import { useTheme } from '@emotion/react';
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import MuiPopup from './custom/MuiPopup';
import CloseIcon from "@mui/icons-material/Close";
import NordicWalkingIcon from '@mui/icons-material/NordicWalking';
import { PieChart, pieArcLabelClasses} from "@mui/x-charts/PieChart";
import SideItem from '../components/SideItem'
import FlipCameraIosOutlinedIcon from '@mui/icons-material/FlipCameraIosOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { DndContext, closestCorners, MouseSensor, TouchSensor, useSensor, useSensors} from '@dnd-kit/core';
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable"
import ShareIcon from '@mui/icons-material/Share';
import BackpackOutlinedIcon from '@mui/icons-material/BackpackOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';


const InnerBag = ({bagData, items, session}) => {

  const router = useRouter();
  const theme = useTheme()

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isDeletePopupOpen, setDeletePopupOpen] = useState(false);
  const [editedBag, setEditedBag] = useState({tripId: bagData?.bag?.tripId, name: bagData?.bag?.name, goal: bagData?.bag?.goal, description: bagData?.bag?.description})
  const [showSideBarMobile, setShowSideBarMobile] = useState(false)
  const [categoriesData, setCategoriesData] = useState(bagData?.categories || []);
  const [confirmPopupOpen, setConfirmPopupOpen] = useState(false)




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
          label: category?.name,
          color: category.color
        };
      })
    ;

  const TOTAL = categoryWeightsArr?.categoriesTotalWeight?.map((category) => category.totalWeight).reduce((a, b) => a + b, 0) 
  const getArcLabel = (params) => {
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(1)}%`;
  };



  const categoryTableData = categoryPieChartData.map((category) => ({
    id: category.id,
    value: category.value,
    label: category.label,
    color: category.color
    
  }));


  function getRandomDarkColor() {
    let color;
    const existingColors = categoriesData.map(category => category.color);

    do {
      color = '#';
      for (let i = 0; i < 3; i++) {
        const part = Math.floor(Math.random() * 256 * 0.6); 
        color += ('0' + part.toString(16)).slice(-2);
      }
    } while (existingColors.includes(color));

    return color;
  }




  const addCategory = async () => {
    const newCategory = {userId: session?.user?.id, bagId: bagData?.bag?._id, tripId: bagData?.bag?.tripId, name: 'new category', color: getRandomDarkColor() };
    try {
      const res = await axios.post('/categories/new', newCategory);
      router.refresh();
    } catch (err) {
      console.log(err);
    }
  };


  const handleSwitchChange = async (e) => {

    if(bagData?.totalBagWeight === 0) {

       return alert("You must add categories and items to publish")
       
    }
    

    if(e.target.checked === true) {

      setConfirmPopupOpen(true); 
    }

    else {

      try {
        await axios.put(`/bags/${bagData.bag._id}/${session?.user.id}`, { exploreBags: false });
        setConfirmPopupOpen(false)
        router.refresh()
      } catch (error) {
        console.log(error);
      }
    }
   
  };


  
  const confirmSwitchChange = async () => {
    try {
      await axios.put(`/bags/${bagData.bag._id}/${session?.user.id}`, { exploreBags: true });
      setConfirmPopupOpen(false)
      router.refresh()
    } catch (error) {
      console.log(error);
    }
  };
  
  



  const openPopup = () => {
      setPopupOpen(true)
  }

  const closePopup = () => {
    setPopupOpen(false);
    setDeletePopupOpen(false)
    setConfirmPopupOpen(false);
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
    { items?.length ? <div className="side-bar-icon-mobile"><IconButton onClick={showHideSideBar} sx={{ width: "40px", height: "40px", zIndex: "99", borderRadius: "0px", borderTopRightRadius: "30%", position: "fixed", bottom: "0px", left: "0px", backgroundColor: theme.green, color: "white", "&:hover": {backgroundColor: "#32CD32"}}}>{showSideBarMobile === true ? <CloseIcon /> : <FlipCameraIosOutlinedIcon sx={{fontSize: "20px"}}/> }</IconButton></div> : null }


    <Box display="flex" flexDirection="row" width={theme.fullWidth} minHeight="100vh"height="100%">

    <Stack display={theme.flexBox} justifyContent={theme.start} width={theme.fullWidth} pb={3}>

        <div className="main-info">

       <Stack display={theme.flexBox} width="100%" flexDirection={theme.row} alignItems={theme.between} justifyContent={theme.between}  backgroundColor={ theme.palette.mode === "dark" ? theme.main.darkColor : "#f2f2f2"} pt={1.5} pb={1.5} mb={3} borderRadius="7px">

        <Stack display="flex" direction="row" justifyContent={theme.between} width="100%" flexWrap="wrap">

        <Stack direction="row" alignItems="center">
        <IconButton sx={{backgroundColor: theme.palette.mode === "dark" ? theme.main.darkColor : "#f2f0f0", marginRight: "5px"}} onClick={() => router.push(`/trips?id=${bagData.bag.tripId}`)}><ArrowBackIcon sx={{fontSize: "20px"}}/></IconButton>
        <Typography component="h3" variant='span' fontWeight="600" mr={1}>{bagData?.bag?.name}</Typography>
        <Badge color="success" badgeContent={bagData.bag.likes || "0" } sx={{zIndex: 0}}>
        <Tooltip title="Total likes"><IconButton><FavoriteIcon sx={{fontSize: "20px"}}/></IconButton></Tooltip>
        </Badge>
        </Stack>
       

        <Stack direction="row">

        <Tooltip title={bagData.bag.exploreBags ? "Remove this bag from 'Explore Bags'" : "Share this bag in 'Explore Bags'"}><Switch onChange={handleSwitchChange} checked={bagData.bag.exploreBags}/></Tooltip>
        <Link href={`/share?id=${bagData.bag._id}`} target="_blank" rel="noopener noreferrer" underline="none"> <Tooltip title="Share Link"><IconButton><ShareIcon sx={{fontSize: "20px"}}/></IconButton></Tooltip></Link>
        <Tooltip title="Edit"><IconButton onClick={openPopup}><EditIcon sx={{fontSize: "20px", cursor: "pointer", "&:hover": { color: theme.orange }}}  /></IconButton> </Tooltip>
        <Tooltip title="Delete"><IconButton onClick={openRemovePopup}><DeleteOutlineOutlinedIcon sx={{ fontSize: "20px", cursor: "pointer", "&:hover": { color: "red" }}}  /></IconButton></Tooltip>
        </Stack>
        </Stack>
      
    
        </Stack>


        <Typography component="p" variant="p">
          {bagData?.bag?.description}
        </Typography>


        { itemsTotal ?  <div className='pieChart-table'>
      <PieChart 
    margin={{ top: 0, left:0, right:0, bottom: 0}} 
    series={[{
      data: categoryPieChartData,
      faded: {innerRadius: 30, additionalRadius: -15, color: 'gray'},
      highlightScope: { faded: 'global', highlighted: 'item' },
      arcLabel: getArcLabel,
      innerRadius: 35,
      outerRadius: 120,
      paddingAngle: 2,
      cornerRadius: 2,
      startAngle: -180,
      endAngle: 180,
      cx: 150,
      cy: 150,
      colorAccessor: (datum) => datum.color,
      
      
    }]}
    
    sx={{[`& .${pieArcLabelClasses.root}`]: { fill: 'white', fontSize: 14, fontWeight: "300"}, visibility: itemsTotal ? "visible" :  "hidden"}}
    height={300}
    slotProps={{ legend: { hidden: true } }}
    tooltip={{ hidden: true }}
    
   
  />

<TableContainer>
  <Table size="small">
    <TableHead>
      <TableRow>
        <TableCell>Category</TableCell>
        <TableCell align="right">Weight ({session.user.weightOption})</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {categoryTableData.map((row) => (
        <TableRow key={row.id}>
          <TableCell component="th" scope="row">
            <Stack direction="row" alignItems="center">
              <Stack backgroundColor={row.color} width="15px" height="15px" mr={1} sx={{ borderRadius: '50%' }}></Stack>
              {row.label}
            </Stack>
          </TableCell>
          <TableCell align="right">{row.value.toFixed(2)} {session?.user?.weightOption}</TableCell>
        </TableRow>
      ))}

  

       <TableRow>
       <TableCell component="th" scope="row">
       <Stack direction="row" alignItems="center">
        <BackpackOutlinedIcon sx={{fontSize: "18px", marginRight: "4px"}}/> Total
        </Stack>

       </TableCell>

       <TableCell component="th" scope="row" align='right'>

       { bagData?.totalBagWeight > bagData?.bag?.goal ?  <Typography variant="span" component="span" sx={{ fontWeight: "bold", color: "red" }}>{bagData?.totalBagWeight?.toFixed(2)} / {bagData?.bag?.goal} {session?.user?.weightOption} </Typography> :  <Typography variant="span" component="span" sx={{ color: bagData?.totalBagWeight > 0.00 ? theme.green : null }}> {bagData?.totalBagWeight?.toFixed(2)} / {bagData?.bag?.goal} {session?.user?.weightOption} </Typography>  }

        </TableCell>
       </TableRow>

       <TableRow>
       <TableCell component="th" scope="row">
       <Stack direction="row" alignItems="center">
       <NordicWalkingIcon sx={{fontSize: "18px", marginRight: "4px"}}/> Worn
        </Stack>

       </TableCell>

       <TableCell component="th" scope="row" align='right'>

       <Typography variant="span" component="span"> { bagData?.worn ? bagData?.worn?.toFixed(2) + "  " + session?.user?.weightOption : '0.0 ' + session?.user?.weightOption}</Typography>

        </TableCell>
       </TableRow>

       <TableRow>
       <TableCell component="th" scope="row">
       <Stack direction="row" alignItems="center">
       <InventoryOutlinedIcon sx={{fontSize: "18px", marginRight: "4px"}}/> Items
        </Stack>

       </TableCell>

       <TableCell component="th" scope="row" align='right'>

       {itemsTotal}

        </TableCell>
       </TableRow>

    </TableBody>
  </Table>

  
</TableContainer>



      </div> : null }
  
         
      </div>

   



    <div className="categories">
    <Stack border="1px dashed gray" display={theme.flexBox} direction="row" justifyContent={theme.center} alignItems={theme.center} height={theme.category.height} mb={1} sx={{cursor: "pointer"}} onClick={addCategory}>
     <Tooltip title="Add category"><IconButton><AddOutlinedIcon sx={{fontSize: "20px", color: "gray" }}/></IconButton></Tooltip>
     { categoriesData.length ? null : <Typography>Add your first category</Typography>}

     
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


{confirmPopupOpen ? (
  <MuiPopup isOpen={confirmPopupOpen} onClose={closePopup}>
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">
      <Stack width="90%">
        <Typography variant='span' component="h2" mb={1.5}>Notice</Typography>
        <Typography variant="body1" component="span">
          You are about to publish <b style={{ color: theme.green }}>{bagData.bag.name}</b> to the "Explore Bags".
          Please note that confirming this action will make your bag details visible to everyone and allow them to react to it.
        </Typography>
      </Stack>
      <CloseIcon onClick={closePopup} sx={{ cursor: "pointer" }} />
      <Button
        sx={{ marginTop: "20px", width: "100%", fontWeight: "500", color: theme.palette.mode === "dark" ? "white" : null, backgroundColor: theme.green }}
        variant="contained"
        onClick={confirmSwitchChange}
        disableElevation
      >
        Publish
      </Button>
    </Stack>
  </MuiPopup>
) : null}



    </Box>
    </Container>
  )
}

export default InnerBag