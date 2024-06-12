"use client"

import { createTheme } from '@mui/material';

const commonProperties = {
  flexBox: "flex",
  row: "row",
  center: "center",
  start: "flex-start",
  end: "flex-end",
  between: "space-between",
  grid: "grid",
  auto: "0 auto",
  radius: "7px",
  boxShadow: "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px;",
  boxShadowHover: "rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;",
  transition: "0.3s",
  cover: "cover",
  fullWidth: "100%",
  green: "#00ac1c",
  red: "#DC143C",
  redHover: "#B22222",
  orange: "#ff731c",
  main: {
    lightGray: "#f4f4f4",
    lightestGray: "#fcfcfc",
    darkColor: "#2A2A2A"
  },
  logo: {
    marginTop: "10px"
  },
  nav: {
    fixed: "fixed",
    width: "210px",
    height: "100vh"
  },
  trips: {
    height: "auto",
    borderLeft: "7px",
    borderRight: "7px",
    width: "100%",
    height: "190px",
    columns: "repeat(auto-fit, 290px);"
  },
  bags: {
    height: "170px",
    width: "100%",
    columns: "repeat(auto-fit, 240px);"
  },
  latestBagBoxes: {
    height: "130px",
    boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;",
    hover: "rgba(0, 172, 28, 0.05) 0px 6px 24px 0px, rgba(0, 172, 28, 1) 0px 0px 0px 1px",
    white: "rgba(255, 255, 255, 0.05) 0px 6px 24px 0px, rgba(255, 255, 255, 1) 0px 0px 0px 1px",
    borderRadius: "7px",
    columns: "repeat(auto-fit, 240px);"
  },
  category: {
    width: "100%",
    height: "45px",
    size: "13px",
    border: "1px solid #d3d3d3"
  },
  items: {
    size: "13px",
    borderTop: "1px solid #d3d3d3"
  }
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light'
  },
  ...commonProperties
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  },
  ...commonProperties
});

  
