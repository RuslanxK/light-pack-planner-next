import React, { useState } from 'react'
import { Stack, Typography, IconButton} from '@mui/material'
import { useTheme } from '@emotion/react';
import { useRouter } from 'next/navigation';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';



const Article = ({articleData}) => {

    const theme = useTheme()
    const router = useRouter()

    const [articleHover, setArticleHover] = useState(false)


    const truncateTitle = (title) => {
        if (title.length > 21) {
            return title.slice(0, 21) + "...";
        } else {
            return title;
        }
    };


    const NavigateToInnerArticle = () => {

        router.push(`/article?id=${articleData._id}`)
    }

  return (

    <Stack backgroundColor={theme.palette.mode === "dark" ? theme.main.darkColor : null } height="222px" borderRadius="7px" boxShadow={theme.boxShadow}  sx={{transition: theme.transition, cursor: "pointer", "&:hover": {boxShadow: theme.boxShadowHover}}} onClick={NavigateToInnerArticle}  onMouseOver={() => setArticleHover(true)} onMouseLeave={() => setArticleHover(false)}>

  <img src={`${process.env.NEXT_PUBLIC_ARTICLE_URL}/${articleData.imageKey}`} width="100%" height={150} alt='article'  style={{borderTopRightRadius: "7px", borderTopLeftRadius: "7px", objectFit: "cover"}} />

      <Typography component="h2" variant='span' pt={1} pl={2} fontWeight="500" fontSize="18px">{truncateTitle(articleData.title)}</Typography>
      <Typography component="span" variant='span' pl={2}>{truncateTitle(articleData.description)} {articleHover ? <IconButton size='small' sx={{marginLeft: "5px"}}><NearMeOutlinedIcon sx={{fontSize: "17px"}} /></IconButton> : null }</Typography>

    </Stack>
  )
}

export default Article