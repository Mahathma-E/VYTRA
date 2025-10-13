import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Avatar,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  LocalShipping as SupplierIcon,
  Assessment as ReportIcon,
  Notifications as NotificationIcon,
  AccountCircle as AccountIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  People as PeopleIcon,
  Category as CategoryIcon,
  TrendingUp,
  Warning
} from '@mui/icons-material';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import DashboardContent from './DashboardContent';

const drawerWidth = 240;

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [notifications, setNotifications] = useState(3);
  const socket = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (socket) {
      socket.on('alertReceived', (data) => {
        // Update notification count when new alert is received
        setNotifications(prev => prev + 1);
        console.log('New alert received:', data);
      });

      socket.on('inventoryUpdated', (data) => {
        // Handle inventory updates
        console.log('Inventory updated:', data);
      });

      socket.on('dashboardUpdated', (data) => {
        // Handle dashboard updates
        console.log('Dashboard updated:', data);
      });

      return () => {
        socket.off('alertReceived');
        socket.off('inventoryUpdated');
        socket.off('dashboardUpdated');
      };
    }
  }, [socket]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenu = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setNotificationAnchor(null);
  };

  const handleNotificationClick = () => {
    // Reset notification count when menu is opened
    setNotifications(0);
    setNotificationAnchor(null);
  };

  // Define menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      { text: 'Dashboard', icon: <DashboardIcon /> },
      { text: 'Products', icon: <CategoryIcon /> },
      { text: 'Inventory', icon: <InventoryIcon /> },
      { text: 'Suppliers', icon: <SupplierIcon /> },
      { text: 'Reports', icon: <ReportIcon /> },
      { text: 'Analytics', icon: <TrendingUp /> },
      { text: 'Alerts', icon: <Warning /> }
    ];

    // Add Users item only for admin users
    if (user && user.role === 'admin') {
      baseItems.splice(5, 0, { text: 'Users', icon: <PeopleIcon /> });
    }

    return baseItems;
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          AIIS
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {getMenuItems().map((item) => (
          <ListItem button key={item.text}>
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Advanced Inventory Intelligence System
          </Typography>
          <Tooltip title="Notifications">
            <IconButton
              size="large"
              aria-label="notifications"
              color="inherit"
              onClick={handleNotificationMenu}
            >
              <Badge badgeContent={notifications} color="error">
                <NotificationIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Menu
            id="notification-menu"
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={handleClose}
            onClick={handleNotificationClick}
          >
            <MenuItem onClick={handleClose}>Low stock alert for Product A</MenuItem>
            <MenuItem onClick={handleClose}>New order received</MenuItem>
            <MenuItem onClick={handleClose}>Supplier delay notification</MenuItem>
          </Menu>
          <Tooltip title="Account settings">
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountIcon />
            </IconButton>
          </Tooltip>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <AccountIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <DashboardContent />
      </Box>
    </Box>
  );
};

export default Dashboard;