"use client"

import { Stack, Typography, Box, Container, IconButton, Badge, Button} from '@mui/material'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@emotion/react';
import MonitorWeightOutlinedIcon from "@mui/icons-material/MonitorWeightOutlined";
import DataSaverOffOutlinedIcon from "@mui/icons-material/DataSaverOffOutlined";
import NordicWalkingIcon from '@mui/icons-material/NordicWalking';
import { PieChart, pieArcLabelClasses} from "@mui/x-charts/PieChart";
import ShareCategory from '../components/ShareCategory'
import ThumbUpOffAltOutlinedIcon from '@mui/icons-material/ThumbUpOffAltOutlined';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import axios from 'axios';


const Share = ({bagData, user, session}) => {



  const router = useRouter();
  const theme = useTheme()


  const [liked, setLiked] = useState(false);

  const likedKey = `liked_${bagData.bag._id}`;



  useEffect(() => {
    const isLiked = localStorage.getItem(likedKey) === 'true';
    setLiked(isLiked);
  }, [likedKey]);



  const toggleLike = async () => {

    const isLiked = !liked;
    if (isLiked) {
      localStorage.setItem(likedKey, 'true');
    } else {
      localStorage.removeItem(likedKey);
    }

    let updatedLikes = isLiked ? bagData.bag.likes + 1 : bagData.bag.likes - 1;
    const likes = { likes: updatedLikes };

    try {
      await axios.put(`/api/like/${bagData.bag._id}`, likes);
      bagData.bag.likes = updatedLikes;
      setLiked(isLiked);
      router.refresh();
    } catch (error) {
      console.error('Error updating likes:', error);
      
      if (isLiked) {
        localStorage.removeItem(likedKey);
      } else {
        localStorage.setItem(likedKey, 'true');
      }
      setLiked(!isLiked);
    }
  };


  const itemsTotal = bagData?.items?.reduce((acc, item) => acc + item.qty, 0) 

  const categoryWeightsArr = bagData?.totalWeightCategory 
  const categoryPieChartData = bagData?.categories?.map((category) => {  
  const categoryWeight = categoryWeightsArr?.categoriesTotalWeight?.find((item) => item.categoryId === category._id)

  

        return {
          id: category._id,
          value: categoryWeight?.totalWeight || 0 ,
          label: category?.name?.length > 6 ? `${categoryWeight?.totalWeight?.toFixed(2) || 0.00}  - ${category?.name?.substring(0, 6)}...` : `${categoryWeight?.totalWeight?.toFixed(2) || 0.00} - ${category?.name}`
        };
      })
    ;

  const TOTAL = categoryWeightsArr?.categoriesTotalWeight?.map((category) => category.totalWeight).reduce((a, b) => a + b, 0) 
  const getArcLabel = (params) => {
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(0)}%`;
  };




  return (

    <Container maxWidth={false} sx={{minHeight: "100vh", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "75%"}}>
     <Stack margin="0 auto" width="100%" mt={3} pb={3} direction="row" justifyContent="space-between" alignItems="center">
    <img src={ theme.palette.mode === "dark" ? "/white-logo.png" : "/logo.png"} onClick={() => router.push('/')} alt='Light Pack - Planner' width={110} height={70}/>
    {session?.user?.id ? null : <Button disableElevation variant="contained" color="primary" onClick={() => window.open('/register', '_blank')}> Join Now </Button> }
    </Stack> 
  
    <Box display="flex" flexDirection="row" width={"100%"} minHeight="100vh" height="100%">
    <Stack display={theme.flexBox} justifyContent={theme.start} width={theme.fullWidth} pb={5}>

      
       <Stack display={theme.flexBox} flexDirection={theme.row} alignItems={theme.center } boxShadow={'rgba(33, 35, 38, 0.1) 0px 10px 10px -10px;'}  backgroundColor={ theme.palette.mode === "dark" ? theme.main.darkColor : "#f2f2f2"}  pl={2} pr={2} pt={1.5} pb={1.5} mb={3} borderRadius="7px">
        <Stack display="flex" direction="row" justifyContent={theme.between} alignItems="center" width="100%">
        <Typography component="h2" variant='span' fontWeight="600" mr={1}>{bagData?.bag?.name}</Typography>
        <Typography>By {user.username}</Typography>
        <Badge badgeContent={bagData.bag.likes || "0"} color="primary">
        <IconButton onClick={toggleLike}> {liked ? <ThumbUpAltIcon /> : <ThumbUpOffAltOutlinedIcon />} </IconButton>
        </Badge>
        </Stack>
        </Stack>

        <Typography component="p" variant="p">
          {bagData?.bag?.description}
        </Typography>

        <Stack display={theme.flexBox} direction="row" justifyContent={theme.center} alignItems="center" mt={3} width="fit-content" borderRadius={theme.radius}>
    
        <IconButton sx={{marginRight: "2px"}}><MonitorWeightOutlinedIcon sx={{fontSize: "22px"}}/> </IconButton>

        { bagData?.totalBagWeight > bagData?.bag?.goal ?  <Typography variant="span" component="span" sx={{ fontWeight: "bold", color: "red" }}>{bagData?.totalBagWeight?.toFixed(1)} / {bagData?.bag?.goal} {user?.weightOption} </Typography> :  <Typography variant="span" component="span" sx={{ color: bagData?.totalBagWeight > 0.00 ? theme.green : null }}> {bagData?.totalBagWeight?.toFixed(1)} / {bagData?.bag?.goal} {user?.weightOption} </Typography>  }
        <IconButton sx={{marginRight: "2px", marginLeft: "2px"}} ><NordicWalkingIcon sx={{fontSize: "22px"}}/></IconButton>

        <Typography variant="span" component="span"> { bagData?.worn ? "worn " + bagData?.worn?.toFixed(1) + "  " + user?.weightOption : '0.0 ' + user?.weightOption}</Typography>
        <IconButton sx={{marginRight: "2px", marginLeft: "2px"}} ><DataSaverOffOutlinedIcon sx={{fontSize: "22px"}}/></IconButton> {itemsTotal} items 
         </Stack> 
   

    { itemsTotal ?  <Stack mb={2}>
      <PieChart margin={{ top: 0, left:0, right:0, bottom: 0}} 
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
         },
       ]}
       sx={{[`& .${pieArcLabelClasses.root}`]: { fill: 'white', fontSize: 14, fontWeight: "300"}, visibility: itemsTotal ? "visible" :  "hidden"}}
    
       height={300}
       tooltip={{}}
       slotProps={{ legend: { direction: "column", position: { vertical: "top", horizontal: "center" }}}}
       
       />

      </Stack> : null }


    <div className="categories">

    {bagData.categories.sort((a, b) => a.order - b.order).map((category, index) => (
                 <ShareCategory key={category._id} categoryData={category} items={bagData?.items} weightOption={user.weightOption}  />
                ))}
    
    </div>

    </Stack>
   


    </Box>
    </Container>
  )
}

export default Share