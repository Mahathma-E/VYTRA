import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert as MuiAlert
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const AlertsList = () => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [readFilter, setReadFilter] = useState('');
  const [resolvedFilter, setResolvedFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Mock data for demonstration
  const mockAlerts = [
    {
      id: 1,
      type: 'low_stock',
      title: 'Low Stock Alert',
      message: 'Product "Laptop" is below reorder point',
      severity: 'high',
      actionRequired: true,
      recommendedAction: 'Reorder 10 units',
      isRead: false,
      isResolved: false,
      createdAt: new Date()
    },
    {
      id: 2,
      type: 'overstock',
      title: 'Overstock Warning',
      message: 'Product "Keyboard" has excess inventory',
      severity: 'medium',
      actionRequired: false,
      isRead: true,
      isResolved: false,
      createdAt: new Date(Date.now() - 86400000)
    },
    {
      id: 3,
      type: 'expiry',
      title: 'Product Expiry Notification',
      message: 'Product "Perishable Item" expires in 3 days',
      severity: 'critical',
      actionRequired: true,
      recommendedAction: 'Mark for discount sale',
      isRead: false,
      isResolved: false,
      createdAt: new Date()
    }
  ];

  const alertTypes = ['low_stock', 'overstock', 'expiry', 'demand_spike', 'supplier_delay'];
  const severities = ['low', 'medium', 'high', 'critical'];

  useEffect(() => {
    // In a real app, you would fetch alerts from an API
    setAlerts(mockAlerts);
    setFilteredAlerts(mockAlerts);
  }, []);

  useEffect(() => {
    let filtered = alerts;
    
    if (typeFilter) {
      filtered = filtered.filter(alert => alert.type === typeFilter);
    }
    
    if (severityFilter) {
      filtered = filtered.filter(alert => alert.severity === severityFilter);
    }
    
    if (readFilter !== '') {
      filtered = filtered.filter(alert => alert.isRead === (readFilter === 'true'));
    }
    
    if (resolvedFilter !== '') {
      filtered = filtered.filter(alert => alert.isResolved === (resolvedFilter === 'true'));
    }
    
    setFilteredAlerts(filtered);
  }, [typeFilter, severityFilter, readFilter, resolvedFilter, alerts]);

  const handleTypeFilterChange = (e) => {
    setTypeFilter(e.target.value);
  };

  const handleSeverityFilterChange = (e) => {
    setSeverityFilter(e.target.value);
  };

  const handleReadFilterChange = (e) => {
    setReadFilter(e.target.value);
  };

  const handleResolvedFilterChange = (e) => {
    setResolvedFilter(e.target.value);
  };

  const handleMarkAsRead = (alertId) => {
    // In a real app, you would make an API call
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const handleMarkAsResolved = (alertId) => {
    // In a real app, you would make an API call
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, isResolved: true } : alert
    ));
  };

  const handleDeleteAlert = (alertId) => {
    // In a real app, you would make an API call
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const handleOpenDialog = (alert) => {
    setSelectedAlert(alert);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAlert(null);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      default:
        return 'success';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'low_stock':
      case 'overstock':
        return <WarningIcon />;
      case 'expiry':
        return <ErrorIcon />;
      case 'demand_spike':
      case 'supplier_delay':
        return <InfoIcon />;
      default:
        return <WarningIcon />;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Alerts & Notifications</Typography>
        <Button variant="contained" onClick={() => console.log('Create new alert')}>
          Create Alert
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              onChange={handleTypeFilterChange}
              label="Type"
            >
              <MenuItem value="">All Types</MenuItem>
              {alertTypes.map(type => (
                <MenuItem key={type} value={type}>
                  {type.replace('_', ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Severity</InputLabel>
            <Select
              value={severityFilter}
              onChange={handleSeverityFilterChange}
              label="Severity"
            >
              <MenuItem value="">All Severities</MenuItem>
              {severities.map(severity => (
                <MenuItem key={severity} value={severity}>
                  {severity}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Read Status</InputLabel>
            <Select
              value={readFilter}
              onChange={handleReadFilterChange}
              label="Read Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Read</MenuItem>
              <MenuItem value="false">Unread</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Resolved Status</InputLabel>
            <Select
              value={resolvedFilter}
              onChange={handleResolvedFilterChange}
              label="Resolved Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Resolved</MenuItem>
              <MenuItem value="false">Unresolved</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Alert</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAlerts.map((alert) => (
              <TableRow key={alert.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <IconButton size="small" sx={{ mr: 1 }}>
                      {getAlertIcon(alert.type)}
                    </IconButton>
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {alert.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {alert.message}
                      </Typography>
                      {alert.recommendedAction && (
                        <Typography variant="body2" color="primary">
                          Recommended: {alert.recommendedAction}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={alert.type.replace('_', ' ')} 
                    size="small" 
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={alert.severity} 
                    color={getSeverityColor(alert.severity)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  {new Date(alert.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Box>
                    <Chip 
                      label={alert.isRead ? 'Read' : 'Unread'} 
                      color={alert.isRead ? 'success' : 'warning'} 
                      size="small" 
                      sx={{ mb: 1 }}
                    />
                    <br />
                    <Chip 
                      label={alert.isResolved ? 'Resolved' : 'Unresolved'} 
                      color={alert.isResolved ? 'success' : 'error'} 
                      size="small" 
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" flexDirection="column" gap={1}>
                    {!alert.isRead && (
                      <Tooltip title="Mark as Read">
                        <IconButton 
                          size="small" 
                          onClick={() => handleMarkAsRead(alert.id)}
                        >
                          <CheckIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {!alert.isResolved && (
                      <Tooltip title="Mark as Resolved">
                        <IconButton 
                          size="small" 
                          onClick={() => handleMarkAsResolved(alert.id)}
                        >
                          <CheckIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog(alert)}
                      >
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteAlert(alert.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AlertDetailsDialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        alert={selectedAlert} 
      />
    </Container>
  );
};

const AlertDetailsDialog = ({ open, onClose, alert }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Alert Details
      </DialogTitle>
      <DialogContent>
        {alert && (
          <Box sx={{ mt: 2 }}>
            <MuiAlert 
              severity={alert.severity} 
              icon={false}
              sx={{ mb: 2 }}
            >
              <Typography variant="h6">{alert.title}</Typography>
              <Typography>{alert.message}</Typography>
            </MuiAlert>
            
            {alert.recommendedAction && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Recommended Action:
                </Typography>
                <Typography>{alert.recommendedAction}</Typography>
              </Box>
            )}
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Details:
              </Typography>
              <Typography>Type: {alert.type.replace('_', ' ')}</Typography>
              <Typography>Severity: {alert.severity}</Typography>
              <Typography>Created: {new Date(alert.createdAt).toLocaleString()}</Typography>
              <Typography>Status: {alert.isRead ? 'Read' : 'Unread'}, {alert.isResolved ? 'Resolved' : 'Unresolved'}</Typography>
            </Box>
            
            {alert.actionRequired && (
              <MuiAlert severity="warning" sx={{ mb: 2 }}>
                Action Required
              </MuiAlert>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertsList;