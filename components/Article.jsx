import React, { useState } from 'react'
import { Stack, Typography, IconButton} from '@mui/material'
import { useTheme } from '@emotion/react';
import { useRouter } from 'next/navigation';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import Image from 'next/image';


const Article = ({articleData}) => {

    const theme = useTheme()
    const router = useRouter()

    const [articleHover, setArticleHover] = useState(false)

    const truncateTitle = (title) => {
        if (title?.length > 25) {
            return title?.slice(0, 25) + "...";
        } else {
            return title;
        }
    };


    const NavigateToInnerArticle = () => {
        router.push(`/article?id=${articleData._id}`)
    }

  return (

    <Stack height="220px" backgroundColor={theme.palette.mode === "dark" ? theme.main.darkColor : null } borderRadius="7px" boxShadow={theme.boxShadow}  sx={{transition: theme.transition, cursor: "pointer", "&:hover": {boxShadow: theme.boxShadowHover}}} onClick={NavigateToInnerArticle}  onMouseOver={() => setArticleHover(true)} onMouseLeave={() => setArticleHover(false)}>
    <Image src={`${process.env.NEXT_PUBLIC_ARTICLE_URL}/${articleData.imageKey}`} width={0} height={150} sizes="100vw" alt='article' style={{width: '100%', borderTopRightRadius: "7px", borderTopLeftRadius: "7px", objectFit: "cover"}} />

    <Typography backgroundColor={ theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.70)" : "rgba(255, 255, 255, 0.70)"} fontSize="13px" fontWeight="500" sx={{borderTopLeftRadius: "7px", borderBottomRightRadius: "7px"}} p={0.5} position="absolute"> {new Date(articleData.createdAt).toDateString()}</Typography>
    <Typography component="h2" variant='span' pt={0.5} pl={2} fontWeight="500" fontSize="18px">{truncateTitle(articleData.title)}</Typography>
    <Typography component="span" variant='span' pl={2} color="gray">{truncateTitle(articleData.description)} {articleHover ? <IconButton size='small' sx={{marginLeft: "5px"}}><NearMeOutlinedIcon sx={{fontSize: "17px"}} /></IconButton> : null }</Typography>

    </Stack>
  )
}

export default React.memo(Article)