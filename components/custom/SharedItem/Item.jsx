import React from "react";
import { TextField } from "@mui/material";
import { useTheme } from "@emotion/react";

const Item = ({
  size = "small",
  variant = "standard",
  placeholder,
  name,
  value,
  readOnly = true,
  width,
  linkColor,
  ...rest
}) => {
  const theme = useTheme();

  return (
    <TextField
      size={size}
      variant={variant}
      placeholder={placeholder}
      name={name}
      value={value}
      sx={{ width: width, marginRight: "15px",  '& input': { cursor:  linkColor ? 'pointer' : null }}}
      InputLabelProps={{ style: { fontSize: 12 } }}
      InputProps={{
        disableUnderline: true,
        readOnly: readOnly,
        style: {
          width: "100%",
          cursor: "pointer",
          color: theme.palette.mode === "dark" ? "white" : "black",
          borderBottom:
            theme.palette.mode === "dark"
              ? `1px solid gray`
              : `1px solid #C0C0C0`,
          fontSize: 12,
          ...rest.InputProps,
        },
      }}
      {...rest}
    />
  );
};

export default Item;
