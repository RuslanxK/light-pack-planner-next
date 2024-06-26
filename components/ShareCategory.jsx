"use client"


import { Stack, IconButton, Typography} from "@mui/material";
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import { useState, useEffect } from "react";
import { useTheme } from '@emotion/react';
import React from "react";
import Divider from '@mui/material/Divider';
import SharedItem from "./SharedItem"


const ShareCategory = (props) => {

  const theme = useTheme()

  const [showItems, setShowItems] = useState(true);
  const [itemsData, setItemsData] = useState(props.items || []);


  useEffect(() => {
    setItemsData(props.items || []);
  }, [props.items]);



  const itemsOfCategory = itemsData?.filter((item) => item.categoryId === props.categoryData._id);


  return (
    <Stack width={theme.category.width}  display={theme.flexBox} mb={1.3} borderBottom={ showItems ? null : "1px solid gray"}>
 
      <Stack display={theme.flexBox} direction="row" justifyContent={theme.between} alignItems={theme.center} pt={0.8} pb={0.3}>

      <Stack display="flex" direction="row" alignItems="center" justifyContent="flex-start" width="100%" >

      <Typography variant="span" component="span" fontSize="13px" sx={{width: "100%", paddingLeft: "10px"}}>{props.categoryData.name}</Typography>

      </Stack>
  
      
  
      <Stack display={theme.flexBox} direction="row">
   
      <IconButton onClick={() => setShowItems(!showItems)}>{showItems ? <ExpandLessOutlinedIcon sx={{fontSize: "18px"}} /> : <ExpandMoreOutlinedIcon sx={{fontSize: "18px"}} />}</IconButton>
       </Stack>

       </Stack>

      {showItems && (
        <Stack  pb={1} width="100%" height={theme.auto}>

        <Divider sx={{marginBottom: "5px"}}/>

       
          {itemsOfCategory.sort((a, b) => a.order - b.order).map((item, index) => (
                 <Stack width="100%" key={item._id} ><SharedItem key={item._id} itemData={item} weightOption={props.weightOption} /></Stack>
                ))}
    

      <Divider sx={{marginTop: "25px"}}/>

        </Stack>
      )}


    </Stack>
  );
};

export default React.memo(ShareCategory);
