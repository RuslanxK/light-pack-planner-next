import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";


export const Accordion = styled((props) => (

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

export const AccordionSummary = styled((props) => (
  <MuiAccordionSummary {...props} />
))(({ theme }) => ({
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(0),
    justifyContent: theme.between
  },
}));



export const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 400,
  color: theme.palette.text.primary,
  display: theme.flexBox,
  justifyContent: theme.between,
  alignItems: theme.contentCenter,
  "&:hover": { color: theme.green }


}));

export const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  borderTop: theme.palette.mode === "dark" ? `1px solid ${theme.main.darkColor}` : "1px solid #F2F2F2",
  display: theme.flexBox,
  flexDirection: "column",
  alignItems: theme.start,
}));