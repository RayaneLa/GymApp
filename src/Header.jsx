import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Select, Box, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { auth, signOut } from './firebase';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
    handleClose();
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerList = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button component={NavLink} to="/profile">
          <ListItemText primary={t('profile')} />
        </ListItem>
        <ListItem button component={NavLink} to="/reservations">
          <ListItemText primary={t('reservations')} />
        </ListItem>
        <ListItem button component={NavLink} to="/booking">
          <ListItemText primary={t('booking')} />
        </ListItem>
        <ListItem button component={NavLink} to="/subscription_info">
          <ListItemText primary={t('subscription_info')} />
        </ListItem>
        <ListItem button component={NavLink} to="/diary_schedule">
          <ListItemText primary={t('diary_schedule')} />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemText primary={t('logout')} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {t('menu')}
          </Typography>
          <Select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            sx={{ color: 'white', marginRight: '16px' }}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="nl">Nederlands</MenuItem>
            <MenuItem value="fr">Français</MenuItem>
          </Select>
          <IconButton edge="end" color="inherit" onClick={handleMenu}>
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose} component={NavLink} to="/profile">
              {t('profile')}
            </MenuItem>
            <MenuItem onClick={handleClose} component={NavLink} to="/reservations">
              {t('reservations')}
            </MenuItem>
            <MenuItem onClick={handleClose} component={NavLink} to="/booking">
              {t('booking')}
            </MenuItem>
            <MenuItem onClick={handleClose} component={NavLink} to="/subscription_info">
              {t('subscription_info')}
            </MenuItem>
            <MenuItem onClick={handleClose} component={NavLink} to="/diary_schedule">
              {t('diary_schedule')}
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              {t('logout')}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerList}
      </Drawer>
    </>
  );
};

export default Header;