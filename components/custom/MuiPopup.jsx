import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MuiPopup = ({isOpen, onClose, children}) => {
  return (
    <Dialog open={isOpen} disableScrollLock onClose={onClose} TransitionComponent={Transition} sx={{
      "& .MuiDialog-container": {
        "& .MuiPaper-root": {
          width: "100%",
          margin: "10px"
          
        },
      },
    }}>
      <DialogContent>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default MuiPopup;
