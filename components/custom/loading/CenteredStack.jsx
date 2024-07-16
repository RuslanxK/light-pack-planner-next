// CenteredStack.js

import React from 'react';
import { Stack } from '@mui/material';

const CenteredStack = ({ children, justifyContent = 'center', alignItems = 'center', height = '100vh', width = '100%', ...rest }) => {
  return (
    <Stack
      display="flex"
      justifyContent={justifyContent}
      alignItems={alignItems}
      height={height}
      width={width}
      {...rest}
    >
      {children}
    </Stack>
  );
};

export default CenteredStack;
