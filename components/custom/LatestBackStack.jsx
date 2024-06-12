import { Stack } from "@mui/material"
import { styled } from "@mui/system";

const LatestBagStack = styled(Stack)(({ theme }) => ({

    
    boxShadow: theme.latestBagBoxes.boxShadow,
    minHeight: theme.latestBagBoxes.height,
    borderRadius: theme.latestBagBoxes.borderRadius,
    padding: "25px",
    display: "flex",
    justifyContent: "space-between",
    background: theme.palette.mode === "dark" ? theme.main.darkColor : "white",
    "&:hover": {
        boxShadow: `${ theme.palette.mode === "dark" ? theme.latestBagBoxes.white : theme.latestBagBoxes.hover}`,
      },
}))

export default LatestBagStack


