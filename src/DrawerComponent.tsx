import React from 'react';
import Drawer from '@mui/material/Drawer';

interface DrawerComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

const DrawerComponent: React.FC<DrawerComponentProps> = ({ isOpen, onClose }) => {
  return (
    <Drawer anchor="left" open={isOpen} onClose={onClose}>
      <div style={{ width: 250, padding: 16 }}>
        Test Something
      </div>
    </Drawer>
  );
};

export default DrawerComponent;
