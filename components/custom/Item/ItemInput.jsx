import React from 'react';
import { TextField } from '@mui/material';
import { useTheme } from '@emotion/react';

const ItemInput = ({
  size = 'small',
  variant = 'standard',
  placeholder,
  name,
  value,
  type,
  width,
  linkColor,
  onChange,
  onBlur,
  ...rest
}) => {
  const theme = useTheme();

  return (
    <TextField
      size={size}
      type={type}
      variant={variant}
      placeholder={placeholder}
      name={name}
      value={value}
      sx={{
        width: width,
        marginRight: "15px",
        borderBottom: theme.palette.mode === "dark" ? `1px solid gray` : "1px solid #C0C0C0"
      }}
      InputLabelProps={{ style: { fontSize: 12 } }}
      inputProps={{min: name === "qty" ? 1 : 0.1}}
      InputProps={{
        disableUnderline: true,
        style: {
          width: '100%',
          color: linkColor ? linkColor : "white",
          fontSize: 12,
          ...rest.InputProps,
        },
      }}
      onChange={onChange}
      onBlur={onBlur}
      {...rest}
    />
  );
};

export default ItemInput;
