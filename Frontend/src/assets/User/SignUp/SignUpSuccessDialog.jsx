import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import Slide from '@mui/material/Slide';

// Custom transition to slow down the animation
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} timeout={300} />;  // Adjusted the timeout for slower animation
});

const SignUpSuccessDialog = ({ open, handleClose }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      aria-labelledby="sign-up-success-title"
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
      <DialogTitle id="sign-up-success-title" sx={{ textAlign: 'center', mb: 2 }}>
        <Typography
          variant="h4"
          sx={{
            background: 'linear-gradient(90deg, #f50057, #3B82F6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '2px 2px 8px rgba(255, 255, 255, 0.3)',
            fontWeight: 'bold',
            fontSize: '3rem'
          }}
        >
          Sign Up Successful!
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" className='' gutterBottom sx={{
          textAlign: 'center',
          fontFamily: 'Lucida Sans, Lucida Sans Regular, Lucida Grande, Lucida Sans Unicode, Geneva, Verdana, sans-serif',
          fontSize:'18px',
          fontWeight:'medium'
        }}>
          Welcome! You're ready to start Blogging.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            backgroundColor: '#3B82F6',
            color: '#ffffff',
            width: '100%',
            '&:hover': {
              backgroundColor: '#2563EB',
            }
          }}
        >
          Start Blogging
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignUpSuccessDialog;
