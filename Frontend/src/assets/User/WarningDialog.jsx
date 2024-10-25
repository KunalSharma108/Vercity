import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} timeout={300} />;
});

const WarningDialog = ({ open, handleClose, handleLogout, LoggingOut, userState }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      aria-labelledby="warning-dialog-title"
      maxWidth="sm"
      fullWidth
      sx={{
        margin: '0 20px',
        '& .MuiBackdrop-root': {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
        '& .MuiPaper-root': {
          backgroundColor: '#000000',
          borderRadius: '10px',
          color: '#ffffff',
          border: '4px solid transparent',
          borderImage: 'linear-gradient(to bottom right, rgb(236, 72, 153) 40%, #00f) 1',
          backgroundClip: 'padding-box',
          backdropFilter: 'blur(4px)',
          padding: '24px',
        }
      }}
    >
      <DialogTitle id="warning-dialog-title" sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Warning!
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom sx={{ textAlign: 'center' }}>
          You are already logged in. To {userState} again, please log out first.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            color: '#3B82F6',
            borderColor: '#3B82F6',
            '&:hover': {
              backgroundColor: '#3B82F6',
              color: '#ffffff',
              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleLogout}
          variant="contained"
          disabled={LoggingOut}
          sx={{
            backgroundColor: LoggingOut ? '#C72C2C' : '#EF4444',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: LoggingOut ? '#C72C2C' : '#D32F2F',
            },
            '&:disabled': {
              backgroundColor: '#C72C2C',
              cursor: 'not-allowed',
              opacity: 0.6,
            },
          }}
        >
          Log Out
        </Button>

      </DialogActions>
    </Dialog>
  );
};

export default WarningDialog;
