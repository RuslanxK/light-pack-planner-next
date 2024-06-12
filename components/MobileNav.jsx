import { IconButton, Stack, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { styled } from "@mui/material/styles";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordion from "@mui/material/Accordion";
import Image from 'next/image';
import { signOut } from "next-auth/react"
import { useTheme } from '@emotion/react';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';

const MobileNav = ({session, bags}) => {

  const [openHamburger, setOpenHamburger] = useState(false)

 const router = useRouter()
 const theme = useTheme()

 const [expanded, setExpanded] = useState("panel1");


 const sortedBags = bags?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
const filteredBags = sortedBags.slice(0, 6)


const bagData = filteredBags?.map((bag) => {
      return <Typography onClick={() =>  navigateToBag(bag)} fontSize="14px" variant='span'component="span" mt={1} 
      sx={{ cursor: "pointer" ,"&:hover": { color: theme.green }}} key={bag._id}> <Image src="/backpack.png" alt='backpack' width={14} height={14} style={{marginRight: "3px"}} /> {bag?.name?.length > 8 ? `${bag?.name?.substring(0, 8)}...` : bag?.name}</Typography>
  })


const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  
  border: "0px",
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
  borderTop: "2px solid #F2F2F2",
  display: theme.flexBox,
  flexDirection: "column",
  alignItems: theme.start,
  marginLeft: theme.spacing(1),
}));


const handleChange = (panel) => (event, newExpanded) => {
  setExpanded(newExpanded ? panel : false);
};


const logOut = () => {
  signOut({ callbackUrl: `/login` })
}


const navigateToBag = (bag) => {

  localStorage.setItem('tripId', bag.tripId);
  router.push(`/bag?id=${bag._id}`)
}


  return (
     <div className="menu-mobile">
         <img src='./logo.png' width="90px" height="58px" className="logo-mobile" onClick={() => router.push('/')} />

         <Stack display={theme.flex} direction="row" justifyContent={theme.center} alignItems={theme.center}>
         <IconButton onClick={() => setOpenHamburger(!openHamburger)}>{ openHamburger ? <CloseIcon /> : <MenuIcon />}</IconButton>


         {openHamburger ? <Stack p={2} display={theme.flex}  alignItems="flex-start" backgroundColor="white" top="80px" right="35px" zIndex="99" position="absolute" width="190px" height="auto" borderRadius="7px" boxShadow="rgba(0, 0, 0, 0.1) -4px 9px 25px -6px;">

  
         <Accordion expanded={expanded === "panel1"} onChange={handleChange("panel1")} onClick={() => router.push("/")}>
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography fontSize="14px" variant='span' width="100%" sx={{ display: theme.flexBox, justifyContent: theme.between,"&:hover": { color: theme.green }}}>
              Home 
            </Typography>
          </AccordionSummary>
        </Accordion>
        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
            <Typography fontSize="14px" variant='span' width={theme.fullWidth} sx={{ display: theme.flexBox, justifyContent: theme.between, "&:hover": { color: theme.green }, }} >
              Recent Bags 
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {bagData?.length > 0 ? ( bagData) : ( <Typography component="p" fontSize="13px"> No bags yet</Typography> )}
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
        >
          <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
            <Typography fontSize="14px" variant='span' width="100%" sx={{ display: theme.flexBox, justifyContent: theme.between, alignItems: theme.contentCenter, "&:hover": { color: theme.green },}}>
              Articles 
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography fontSize="13px" variant='span'component="span"> Lorem ipsum </Typography>
            <Typography fontSize="13px" variant='span'component="span"> Lorem ipsum </Typography>
            <Typography fontSize="13px" variant='span'component="span"> Lorem ipsum </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion onClick={() => router.push('/settings')}>
          <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
            <Typography fontSize="14px" variant='span' width="100%" sx={{ display: theme.flexBox, justifyContent: theme.between, alignItems: theme.contentCenter, "&:hover": { color: theme.green },}}>
              Settings 
            </Typography>            
          </AccordionSummary>
        </Accordion>
        <Accordion>
          <AccordionSummary aria-controls="panel5d-content" id="panel5d-header">
            <Typography fontSize="14px" variant='span' width="100%" sx={{ display: theme.flexBox, justifyContent: theme.between, alignItems: theme.contentCenter, "&:hover": { color: theme.green },}}>
            <Stack display={theme.flex} direction="row" justifyContent={theme.center} alignItems={theme.center} mb={0.5}>
            <IconButton sx={{marginRight: "5px"}}><Image src={session?.user?.image} alt='user' style={{ borderRadius: "100%" }} width={30} height={30} /></IconButton>
            <button className='logout' onClick={logOut}> <LogoutIcon sx={{fontSize: "14px", marginRight: "5px"}}/> Log out</button>
            </Stack>
            </Typography>            
          </AccordionSummary>
        </Accordion>
         </Stack> : null }
      
         </Stack>
         
     </div>
  )
}

export default MobileNav