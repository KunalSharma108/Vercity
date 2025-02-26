import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} timeout={300} />;
});

const BlogDialog = ({ open, handleClose, Type }) => {
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
          {Type.heading}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom sx={{ textAlign: 'center' }}>
          {Type.text}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            aligntItems: 'center',
            color: '#ffffff',
            backgroundColor: 'transparent',
            border: '2px solid #ff4d4d',
            '&:hover': {
              backgroundColor: '#ff4d4d',
              boxShadow: '0 0 30px rgba(247, 52, 52, 0.5)',
            },
          }}
        >
          close
        </Button>
        <Button
          onClick={Type.handleClick}
          variant="contained"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            aligntItems: 'center',
            backgroundColor: '#11998a',
            border: '2px solid rgb(54, 207, 190)',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: 'transparent',
              border: '2px solid rgb(54, 207, 190)',
              boxShadow: '0 0 30px rgba(54, 207, 190, 0.5)',
            },
            '&:disabled': {
              backgroundColor: '#C72C2C',
              cursor: 'not-allowed',
              opacity: 0.6,
            },
          }}
        >
          {Type.clickAction}
        </Button>

      </DialogActions>
    </Dialog>
  );
};

export default BlogDialog;