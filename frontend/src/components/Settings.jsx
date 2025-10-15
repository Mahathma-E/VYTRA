import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Tabs,
  Tab,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Storage as StorageIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState({
    // Notification settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    lowStockAlerts: true,
    orderUpdates: true,
    
    // Security settings
    twoFactorAuth: false,
    passwordExpiry: 90,
    
    // Display settings
    theme: 'light',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    
    // Inventory settings
    defaultLocation: 'warehouse-a',
    lowStockThreshold: 10,
    autoReorder: true
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSave = () => {
    // In a real app, you would save these settings to the backend
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  const renderNotificationsTab = () => (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Notification Preferences" />
        <Divider />
        <CardContent>
          <FormControlLabel
            control={
              <Switch
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              />
            }
            label="Email Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.smsNotifications}
                onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
              />
            }
            label="SMS Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.pushNotifications}
                onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
              />
            }
            label="Push Notifications"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Alert Settings" />
        <Divider />
        <CardContent>
          <FormControlLabel
            control={
              <Switch
                checked={settings.lowStockAlerts}
                onChange={(e) => handleSettingChange('lowStockAlerts', e.target.checked)}
              />
            }
            label="Low Stock Alerts"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.orderUpdates}
                onChange={(e) => handleSettingChange('orderUpdates', e.target.checked)}
              />
            }
            label="Order Updates"
          />
        </CardContent>
      </Card>
    </Box>
  );

  const renderSecurityTab = () => (
    <Card>
      <CardHeader title="Security Settings" />
      <Divider />
      <CardContent>
        <FormControlLabel
          control={
            <Switch
              checked={settings.twoFactorAuth}
              onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
            />
          }
          label="Two-Factor Authentication"
        />
        
        <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
          <InputLabel>Password Expiry (days)</InputLabel>
          <Select
            value={settings.passwordExpiry}
            onChange={(e) => handleSettingChange('passwordExpiry', e.target.value)}
          >
            <MenuItem value={30}>30 days</MenuItem>
            <MenuItem value={60}>60 days</MenuItem>
            <MenuItem value={90}>90 days</MenuItem>
            <MenuItem value={180}>180 days</MenuItem>
          </Select>
        </FormControl>
        
        <Button variant="outlined" color="primary">
          Change Password
        </Button>
      </CardContent>
    </Card>
  );

  const renderDisplayTab = () => (
    <Card>
      <CardHeader title="Display Settings" />
      <Divider />
      <CardContent>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Theme</InputLabel>
          <Select
            value={settings.theme}
            onChange={(e) => handleSettingChange('theme', e.target.value)}
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
            <MenuItem value="auto">Auto</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Language</InputLabel>
          <Select
            value={settings.language}
            onChange={(e) => handleSettingChange('language', e.target.value)}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="es">Spanish</MenuItem>
            <MenuItem value="fr">French</MenuItem>
            <MenuItem value="de">German</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth>
          <InputLabel>Date Format</InputLabel>
          <Select
            value={settings.dateFormat}
            onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
          >
            <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
            <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
            <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
          </Select>
        </FormControl>
      </CardContent>
    </Card>
  );

  const renderInventoryTab = () => (
    <Card>
      <CardHeader title="Inventory Settings" />
      <Divider />
      <CardContent>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Default Location</InputLabel>
          <Select
            value={settings.defaultLocation}
            onChange={(e) => handleSettingChange('defaultLocation', e.target.value)}
          >
            <MenuItem value="warehouse-a">Warehouse A</MenuItem>
            <MenuItem value="warehouse-b">Warehouse B</MenuItem>
            <MenuItem value="store-1">Store 1</MenuItem>
            <MenuItem value="store-2">Store 2</MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          fullWidth
          label="Low Stock Threshold"
          type="number"
          value={settings.lowStockThreshold}
          onChange={(e) => handleSettingChange('lowStockThreshold', parseInt(e.target.value))}
          sx={{ mb: 2 }}
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={settings.autoReorder}
              onChange={(e) => handleSettingChange('autoReorder', e.target.checked)}
            />
          }
          label="Enable Auto Reorder"
        />
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Settings
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Configure your VYTRA preferences
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <AppBar position="static" color="default" elevation={0}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab icon={<NotificationsIcon />} label="Notifications" />
              <Tab icon={<SecurityIcon />} label="Security" />
              <Tab icon={<PaletteIcon />} label="Display" />
              <Tab icon={<StorageIcon />} label="Inventory" />
            </Tabs>
          </AppBar>
        </Grid>

        <Grid item xs={12}>
          {activeTab === 0 && renderNotificationsTab()}
          {activeTab === 1 && renderSecurityTab()}
          {activeTab === 2 && renderDisplayTab()}
          {activeTab === 3 && renderInventoryTab()}
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              size="large"
            >
              Save Settings
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;