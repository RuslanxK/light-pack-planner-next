"use client"

import { Stack, Typography, IconButton, Switch, Divider } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useTheme } from '@emotion/react';
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { styled } from "@mui/material/styles";
import { Fragment, useState, useEffect, useRef} from 'react';
import WindowOutlinedIcon from '@mui/icons-material/WindowOutlined';
import HikingOutlinedIcon from "@mui/icons-material/HikingOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { signOut } from "next-auth/react"
import { Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { usePathname } from "next/navigation"
import { disableNavBar } from "../utils/disableNavBar"
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';import axios from 'axios';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ReportIcon from '@mui/icons-material/Report';
import useRefresh from './hooks/useRefresh'
import CircularProgress from '@mui/material/CircularProgress';

import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

const Nav = ({bags, session, user}) => {

const { refresh } = useRefresh();

const theme = useTheme()
const router = useRouter()
const path = usePathname()

const menuRef = useRef(null);


const [mode, setMode] = useState(user.mode);
const [isOpenMenu, setOpenMenu] = useState(false)
const [ loading, setLoading] = useState(false)
const [ nestedMenuOpen, setNestedMenuOpen] = useState(false)


const profileImageUrl = session?.user?.profileImageKey ? `${process.env.NEXT_PUBLIC_PROFILE_URL}/${session?.user?.profileImageKey}` : null;


useEffect(() => {

  setMode(user.mode)
  
}, [user.mode]);


const handleMenuClick = () => {
  
    setNestedMenuOpen(!nestedMenuOpen)
};



useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpenMenu(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);



const toggleTheme = async () => {
      
  const newMode = mode === "light" ? "dark" : "light";
  setMode(newMode);

  const obj = {mode: newMode}
  try {

         setLoading(true)
         await axios.put(`/api/user/${session?.user.id}`, obj)
         await refresh()
         setLoading(false)
       }
         catch(err) {
           console.log(err)
       }
};

const sortedBags = bags?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
const filteredBags = sortedBags?.slice(0, 4)


const bagData = filteredBags?.map((bag) => {
      return <Stack onClick={() =>  navigateToBag(bag)}> <Typography fontSize="14px" variant='span'component="span" ml={0.8} mb={1}
      sx={{ cursor: "pointer" ,"&:hover": { color: theme.green }}} key={bag._id}>{bag?.name?.length > 15 ? `${bag?.name?.substring(0, 15)}...` : bag?.name}</Typography></Stack>
  })





const logOut = () => {
  signOut({ callbackUrl: `/login` })
}


const [expanded, setExpanded] = useState("panel1");

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: theme.palette.mode === "dark" ? `1px solid ${theme.main.darkColor}` : "1px solid #F2F2F2",
  background: "none",
  borderRight: "0px",
  borderLeft: "0px",
  "&:not(:last-child)": { borderBottom: 0 },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary {...props} />
))(({ theme }) => ({
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  borderTop: theme.palette.mode === "dark" ? `1px solid ${theme.main.darkColor}` : "1px solid #F2F2F2",
  display: theme.flexBox,
  flexDirection: "column",
  alignItems: theme.start,
 
}));



const handleChange = (panel) => (event, newExpanded) => {
  setExpanded(newExpanded ? panel : false);
};


const navigateToBag = (bag) => {

     setOpenMenu(false)
     localStorage.setItem('tripId', bag.tripId);
     localStorage.setItem('bagId', bag._id);
     router.push(`/bag?id=${bag._id}`)
}


const navigateToUrl = (url) => {

    setOpenMenu(false)
    router.push(url)
}


  return (

    <Fragment>



{loading ? <div className='loading-overlay' style={{ background: theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.15)"}}> {<CircularProgress color="success" />}</div> : null }

    <>
    {!disableNavBar.includes(path) && (
   
    <Fragment>

      <div className='nav-mobile'>

      <Image src={ theme.palette.mode === "dark" ? "/white-logo.png" : "/logo.png"} alt='Light Pack - Planner' width={110} height={70} onClick={() => router.push('/')}/>
      <IconButton onClick={() => setOpenMenu(!isOpenMenu)}>{ isOpenMenu ? <CloseIcon /> : <MenuIcon />  }</IconButton>

      {isOpenMenu ? <Paper ref={menuRef} elevation={2} sx={{ width: "90%", maxWidth: '100%', position: "absolute", marginLeft: "auto", marginRight: "auto", top: 90, left: 0, right: 0,  zIndex: "9999", background: theme.palette.mode === "dark" ? "#171717" : "#f0f0f0"  }}>
      <MenuList>
        <MenuItem onClick={ () => navigateToUrl("/")}>
          <ListItemIcon>
            <WindowOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Home</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleMenuClick}>
          <ListItemIcon>
            <HikingOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Recent Bags</ListItemText>
          <ListItemIcon>
            { nestedMenuOpen ?  <ArrowDropUpIcon fontSize='small' /> : <ArrowDropDownIcon fontSize="small" /> }
          </ListItemIcon>
        </MenuItem>

       
       {  nestedMenuOpen ?  <MenuItem>
           <Stack ml={4}>{bagData.length ? bagData : "No bags yet"}</Stack>
         </MenuItem> :  null }
        
    
        <MenuItem onClick={ () => navigateToUrl("/articles")}>
          <ListItemIcon>
            <PublicOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Articles</ListItemText>
        </MenuItem>

        <MenuItem onClick={ () => navigateToUrl("/explore")}>
          <ListItemIcon>
            <StarOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Explore Bags</ListItemText>
        </MenuItem>

        <MenuItem onClick={ () => navigateToUrl("/settings")}>
          <ListItemIcon>
            <SettingsOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>

        <MenuItem onClick={ () => navigateToUrl("/changelog")}>
          <ListItemIcon>
            <NotificationImportantIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Changelog</ListItemText>
        </MenuItem>

        <MenuItem onClick={ () => navigateToUrl("/bug-report")}>
          <ListItemIcon>
            <ReportIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Bug Report</ListItemText>
        </MenuItem>

       { session.user.isAdmin ? <MenuItem onClick={ () => navigateToUrl("/admin")}>
          <ListItemIcon>
            <AdminPanelSettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Admin Settings</ListItemText>
        </MenuItem> : null }
        <Divider />

        

        <MenuItem>
        <ListItemIcon>
          <img src={session?.user?.image || profileImageUrl } alt='user' style={{ borderRadius: "100px", objectFit: "cover", width: "35px", height: "35px", marginRight: "15px" }} />
        </ListItemIcon>
          <ListItemText>{user.username}</ListItemText>
        
        </MenuItem>

        <Divider />
        
         <Stack display="flex" direction="row" justifyContent="space-between" alignItems="center">
         <MenuItem sx={{width: "100%"}}>
          <Stack direction="row" alignItems="center" sx={{width: "50%"}} justifyContent="flex-start">
          <LightModeIcon sx={{color: "#4a4a4a", marginRight: "5px"}}/> <Switch onChange={toggleTheme} checked={mode === "dark"} />  <DarkModeIcon sx={{color: "#4a4a4a", marginLeft: "5px"}}/> 
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{width: "50%"}} onClick={logOut}>
          <IconButton><LogoutIcon sx={{fontSize: "17px"}}/></IconButton>
          <Typography className='logout' fontSize="15px"> Log out</Typography>
          </Stack>
          </MenuItem>
          </Stack>
         


      
      </MenuList>
    </Paper> : null }
          
      </div>

    <div className="nav" style={{background: theme.palette.mode === "dark" ? "#171717" : "#fafafa"}}>
    <Stack  width={theme.nav.width} display={theme.flexBox}  height={theme.nav.height}> 
    <Stack position={theme.nav.fixed} justifyContent="space-between" height={theme.nav.height} borderRight={theme.palette.mode === "dark" ? `2px solid ${theme.main.darkColor}` : "1px solid #F2F2F2"} width={theme.nav.width}>
    <Stack>
    <Stack margin="0 auto" pt={2} pb={2} onClick={() => router.push('/')}>
    <Image src={ theme.palette.mode === "dark" ? "/white-logo.png" : "/logo.png"} alt='Light Pack - Planner' width={110} height={70}/>
    </Stack> 

    <Accordion expanded={expanded === "panel1"} onChange={handleChange("panel1")} onClick={() => router.push("/")}>
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography fontSize="14px" variant='span' width="100%" sx={{ display: theme.flexBox, justifyContent: theme.between,"&:hover": { color: theme.green }}}>
              Home 
            </Typography>
            <WindowOutlinedIcon sx={{fontSize: "20px", color: "#4a4a4a"}} />
          </AccordionSummary>
        </Accordion>
        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
            <Typography fontSize="14px" variant='span' width={theme.fullWidth} sx={{ display: theme.flexBox, justifyContent: theme.between, "&:hover": { color: theme.green }, }} >
              <Stack direction="row">Recent Bags { expanded === "panel2" ? <ArrowDropUpIcon sx={{marginLeft: "3px"}}/> : <ArrowDropDownIcon sx={{marginLeft: "3px"}}/> }</Stack>
            </Typography>
            <HikingOutlinedIcon sx={{fontSize: "20px", color: "#4a4a4a"}} />
          </AccordionSummary>
          <AccordionDetails>
            {bagData?.length > 0 ? ( bagData) : ( <Typography component="p" fontSize="13px" ml={1}> No bags yet</Typography> )}
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary aria-controls="panel3d-content" id="panel3d-header" onClick={() => router.push("/articles")}>
            <Typography fontSize="14px" variant='span' width="100%" sx={{ display: theme.flexBox, justifyContent: theme.between, alignItems: theme.contentCenter, "&:hover": { color: theme.green },}}>
              Articles 
            </Typography>
            <PublicOutlinedIcon sx={{fontSize: "20px", color: "#4a4a4a"}} />
          </AccordionSummary>
          
      
        </Accordion>

        <Accordion>
          <AccordionSummary aria-controls="panel3d-content" id="panel3d-header" onClick={() => router.push("/explore")}>
            <Typography fontSize="14px" variant='span' width="100%" sx={{ display: theme.flexBox, justifyContent: theme.between, alignItems: theme.contentCenter, "&:hover": { color: theme.green },}}>
             Explore Bags
            </Typography>
            <StarOutlinedIcon sx={{fontSize: "20px", color: "#4a4a4a"}} />
          </AccordionSummary>
        </Accordion>

        <Accordion onClick={() => router.push('/settings')}>
          <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
            <Typography fontSize="14px" variant='span' width="100%" sx={{ display: theme.flexBox, justifyContent: theme.between, alignItems: theme.contentCenter, "&:hover": { color: theme.green },}}>
              Settings 
            </Typography>
            <SettingsOutlinedIcon sx={{fontSize: "20px", color: "#4a4a4a"}} />
          </AccordionSummary>
        </Accordion>

        <Accordion onClick={() => router.push('/changelog')}>
          <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
            <Typography fontSize="14px" variant='span' width="100%" sx={{ display: theme.flexBox, justifyContent: theme.between, alignItems: theme.contentCenter, "&:hover": { color: theme.green },}}>
              Changelog 
            </Typography>
            <NotificationImportantIcon sx={{fontSize: "20px", color: "#4a4a4a"}} />
          </AccordionSummary>
        </Accordion>


        <Accordion onClick={() => router.push('/bug-report')}>
          <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
            <Typography fontSize="14px" variant='span' width="100%" sx={{ display: theme.flexBox, justifyContent: theme.between, alignItems: theme.contentCenter, "&:hover": { color: theme.green },}}>
             Bug Report
            </Typography>
            <ReportIcon sx={{fontSize: "20px", color: "#4a4a4a"}} />
          </AccordionSummary>
        </Accordion>

        { session.user.isAdmin ? <Accordion onClick={() => router.push('/admin')}>
          <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
            <Typography fontSize="14px" variant='span' width="100%" sx={{ display: theme.flexBox, justifyContent: theme.between, alignItems: theme.contentCenter, "&:hover": { color: theme.green },}}>
             Admin Settings
            </Typography>
            <AdminPanelSettingsIcon sx={{fontSize: "20px", color: "#4a4a4a"}} />
          </AccordionSummary>
        </Accordion> : null }


        {session && session?.user ? (
         <Stack display={theme.flexBox} pb={1} mt={1} alignItems={theme.center}>



    <Tooltip title={<><Typography p={0.2} variant='span' component="h3" fontWeight="300" color="inherit">{user.username}</Typography>
      <Typography variant='span'p={0.2} component="h3" fontWeight="300" color="inherit">{session?.user?.email}</Typography>
    </>
  }>
     <IconButton sx={{marginTop: "5px"}}><img src={session?.user?.image || profileImageUrl} alt='user' style={{ borderRadius: "100%", objectFit: "cover" }} width={35} height={35} /></IconButton>
     </Tooltip>
      <Typography className='logout' fontSize="15px" onClick={logOut}> <LogoutIcon sx={{fontSize: "17px", marginRight: "5px"}}/> Log out</Typography>


     </Stack>
     
) : null}


      </Stack>
       <Stack display="flex" direction="row" justifyContent="center" alignItems="center" mb={1}><LightModeIcon sx={{color: "#4a4a4a", marginRight: "5px"}}/> <Switch onChange={toggleTheme} checked={mode === "dark"} />  <DarkModeIcon sx={{color: "#4a4a4a", marginLeft: "5px"}}/></Stack>
        </Stack>
    
    </Stack>
    </div>

    </Fragment>
        
      )}
      </>

      </Fragment>
   )
   
}


export default Nav