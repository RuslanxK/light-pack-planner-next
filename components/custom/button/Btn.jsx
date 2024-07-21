import React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

const Btn = ({ text, isLoading, type, variant, color = 'primary', ...props }) => {
  return (
    <Button
      type={type}
      fullWidth
      variant={variant}
      disableElevation
      sx={{ p: '12px', background: color}}
      {...props}
    >
      {text} {isLoading && <CircularProgress color="inherit" size={20} sx={{ marginLeft: '15px' }} />}
    </Button>
  );
};

export default Btn;
