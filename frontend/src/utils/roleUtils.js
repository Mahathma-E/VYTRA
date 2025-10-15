/**
 * Utility functions for role-based access control
 */

/**
 * Check if a user has access to a route based on allowed roles
 * @param {string} userRole - The role of the current user
 * @param {Array} allowedRoles - Array of roles allowed to access the route
 * @returns {boolean} - Whether the user has access
 */
export const hasAccess = (userRole, allowedRoles = []) => {
  // If no allowed roles are specified, all authenticated users have access
  if (allowedRoles.length === 0) {
    return true;
  }
  
  // Check if user's role is in the allowed roles
  return allowedRoles.includes(userRole);
};

/**
 * Get all routes accessible to a user based on their role
 * @param {string} userRole - The role of the current user
 * @returns {Array} - Array of route paths accessible to the user
 */
export const getAccessibleRoutes = (userRole) => {
  const allRoutes = [
    { path: '/dashboard', allowedRoles: [] }, // Accessible to all authenticated users
    { path: '/inventory', allowedRoles: [] }, // Accessible to all authenticated users
    { path: '/alerts', allowedRoles: [] }, // Accessible to all authenticated users
    { path: '/products', allowedRoles: ['admin', 'manager'] },
    { path: '/analytics', allowedRoles: ['admin', 'manager'] },
    { path: '/users', allowedRoles: ['admin'] }
  ];

  return allRoutes.filter(route => hasAccess(userRole, route.allowedRoles));
};

/**
 * Get user role description
 * @param {string} role - The role string
 * @returns {string} - Human-readable description of the role
 */
export const getRoleDescription = (role) => {
  const descriptions = {
    'admin': 'Administrator - Full access to all features',
    'manager': 'Manager - Access to management features',
    'employee': 'Employee - Basic access to inventory features'
  };
  
  return descriptions[role] || 'Unknown role';
};