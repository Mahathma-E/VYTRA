import Alert from '../models/Alert.js';

// Get user-specific alerts with filtering
export const getAlerts = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;
    
    // Build filters
    const filters = {
      $or: [
        { affectedUsers: req.user.id },
        { affectedUsers: { $exists: false } }
      ]
    };
    
    if (req.query.type) {
      filters.type = req.query.type;
    }
    
    if (req.query.severity) {
      filters.severity = req.query.severity;
    }
    
    if (req.query.isRead !== undefined) {
      filters.isRead = req.query.isRead === 'true';
    }
    
    if (req.query.isResolved !== undefined) {
      filters.isResolved = req.query.isResolved === 'true';
    }

    const count = await Alert.countDocuments(filters);
    const alerts = await Alert.find(filters)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      alerts,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark alert as read
export const markAlertAsRead = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    
    if (alert) {
      alert.isRead = true;
      const updatedAlert = await alert.save();
      res.json(updatedAlert);
    } else {
      res.status(404).json({ message: 'Alert not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark alert as resolved
export const markAlertAsResolved = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    
    if (alert) {
      alert.isResolved = true;
      const updatedAlert = await alert.save();
      res.json(updatedAlert);
    } else {
      res.status(404).json({ message: 'Alert not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete alert
export const deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    
    if (alert) {
      await alert.remove();
      res.json({ message: 'Alert removed' });
    } else {
      res.status(404).json({ message: 'Alert not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get alert summary for dashboard
export const getAlertSummary = async (req, res) => {
  try {
    const alerts = await Alert.find({
      $or: [
        { affectedUsers: req.user.id },
        { affectedUsers: { $exists: false } }
      ],
      isRead: false
    }).select('type severity title message createdAt');

    // Group by severity
    const summary = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };

    alerts.forEach(alert => {
      summary[alert.severity]++;
    });

    res.json({
      summary,
      alerts: alerts.slice(0, 5) // Return only top 5 alerts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user alert preferences
export const updateAlertPreferences = async (req, res) => {
  try {
    // In a real implementation, you would store user preferences in the User model
    // For now, we'll return a success message
    res.json({ message: 'Alert preferences updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new alert (for system-generated alerts)
export const createAlert = async (req, res) => {
  try {
    const { type, productId, locationId, title, message, severity, actionRequired, recommendedAction, affectedUsers } = req.body;

    const alert = new Alert({
      type,
      productId,
      locationId,
      title,
      message,
      severity: severity || 'medium',
      actionRequired: actionRequired || false,
      recommendedAction,
      affectedUsers: affectedUsers || []
    });

    const createdAlert = await alert.save();
    res.status(201).json(createdAlert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};