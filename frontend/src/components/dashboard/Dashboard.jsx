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
  Tooltip,
  FormControl,
  InputLabel,
  Select
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
  Warning,
  Upload as UploadIcon,
  Analytics as AnalyticsIcon,
  Edit as EditIcon,
  Brightness4,
  Brightness7
} from '@mui/icons-material';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import DashboardContent from './DashboardContent';
import CurrencySelector from '../CurrencySelector';

const drawerWidth = 240;

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [notifications, setNotifications] = useState(3);
  const socket = useSocket();
  const { user, logout } = useAuth();
  const { currency, updateCurrency } = useCurrency();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

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

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleProfile = () => {
    // Navigate to profile page (you can create this route)
    navigate('/profile');
    handleClose();
  };

  const handleSettings = () => {
    // Navigate to settings page (you can create this route)
    navigate('/settings');
    handleClose();
  };

  const handleLogout = () => {
    // Call the logout function from auth context
    logout();
    handleClose();
  };

  // Define menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
      { text: 'Products', icon: <CategoryIcon />, path: '/products' },
      { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
      { text: 'Suppliers', icon: <SupplierIcon />, path: '/suppliers' },
      { text: 'Reports', icon: <ReportIcon />, path: '/reports' },
      { text: 'Analytics', icon: <TrendingUp />, path: '/analytics' },
      { text: 'Alerts', icon: <Warning />, path: '/alerts' },
      { text: 'Role Test', icon: <PeopleIcon />, path: '/role-test' },
      { text: 'Route Test', icon: <MenuIcon />, path: '/route-test' } // Add this line
    ];

    // Add admin/manager specific items
    if (user && (user.role === 'admin' || user.role === 'manager')) {
      baseItems.splice(6, 0, 
        { text: 'Excel Import', icon: <UploadIcon />, path: '/excel-import' },
        { text: 'Data Analysis', icon: <AnalyticsIcon />, path: '/data-analysis' },
        { text: 'Data Manipulation', icon: <EditIcon />, path: '/data-manipulation' }
      );
    }

    // Add Users item only for admin users
    if (user && user.role === 'admin') {
      baseItems.splice(5, 0, { text: 'Users', icon: <PeopleIcon />, path: '/users' });
    }

    return baseItems;
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          VYTRA
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {getMenuItems().map((item) => (
          <ListItem 
            button 
            key={item.text}
            onClick={() => handleNavigation(item.path)}
          >
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
            VYTRA – Real-Time Inventory Intelligence
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CurrencySelector />
            <Tooltip title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
              <IconButton 
                onClick={toggleDarkMode}
                color="inherit"
                sx={{ 
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(15deg)'
                  }
                }}
              >
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
          </Box>
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
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <AccountIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleSettings}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
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