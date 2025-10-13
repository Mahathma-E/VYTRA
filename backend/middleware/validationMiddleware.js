// Validation middleware for common input validation

// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
const validatePassword = (password) => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Validate ObjectId format
const validateObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

// Validate required fields
const validateRequiredFields = (fields, requiredFields) => {
  const missingFields = [];
  
  requiredFields.forEach(field => {
    if (!fields[field] || fields[field].toString().trim() === '') {
      missingFields.push(field);
    }
  });
  
  return missingFields;
};

// Validate string length
const validateStringLength = (value, min, max) => {
  if (typeof value !== 'string') return false;
  return value.length >= min && value.length <= max;
};

// Validate number range
const validateNumberRange = (value, min, max) => {
  if (isNaN(value)) return false;
  const num = Number(value);
  return num >= min && num <= max;
};

// Sanitize input to prevent XSS
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

// Sanitize object fields
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'string') {
        sanitized[key] = sanitizeInput(obj[key]);
      } else if (typeof obj[key] === 'object') {
        sanitized[key] = sanitizeObject(obj[key]);
      } else {
        sanitized[key] = obj[key];
      }
    }
  }
  return sanitized;
};

// Middleware to validate user registration
export const validateUserRegistration = (req, res, next) => {
  try {
    const { email, password, profile } = req.body;
    const errors = [];
    
    // Validate email
    if (!email) {
      errors.push('Email is required');
    } else if (!validateEmail(email)) {
      errors.push('Invalid email format');
    }
    
    // Validate password
    if (!password) {
      errors.push('Password is required');
    } else if (!validatePassword(password)) {
      errors.push('Password must be at least 8 characters with uppercase, lowercase, and number');
    }
    
    // Validate profile fields if provided
    if (profile) {
      if (profile.firstName && !validateStringLength(profile.firstName, 1, 50)) {
        errors.push('First name must be between 1 and 50 characters');
      }
      
      if (profile.lastName && !validateStringLength(profile.lastName, 1, 50)) {
        errors.push('Last name must be between 1 and 50 characters');
      }
      
      if (profile.phone && !validateStringLength(profile.phone, 1, 20)) {
        errors.push('Phone number must be between 1 and 20 characters');
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors 
      });
    }
    
    // Sanitize input
    req.body.email = sanitizeInput(email);
    if (profile) {
      req.body.profile = sanitizeObject(profile);
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Validation error occurred' });
  }
};

// Middleware to validate product creation
export const validateProduct = (req, res, next) => {
  try {
    const { name, category, sku, pricing } = req.body;
    const errors = [];
    
    // Validate required fields
    const missingFields = validateRequiredFields(req.body, ['name', 'category']);
    if (missingFields.length > 0) {
      errors.push(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Validate name
    if (name && !validateStringLength(name, 1, 100)) {
      errors.push('Product name must be between 1 and 100 characters');
    }
    
    // Validate category
    if (category && !validateStringLength(category, 1, 50)) {
      errors.push('Category must be between 1 and 50 characters');
    }
    
    // Validate SKU if provided
    if (sku && !validateStringLength(sku, 1, 50)) {
      errors.push('SKU must be between 1 and 50 characters');
    }
    
    // Validate pricing if provided
    if (pricing) {
      if (pricing.costPrice !== undefined && (isNaN(pricing.costPrice) || pricing.costPrice < 0)) {
        errors.push('Cost price must be a non-negative number');
      }
      
      if (pricing.sellingPrice !== undefined && (isNaN(pricing.sellingPrice) || pricing.sellingPrice < 0)) {
        errors.push('Selling price must be a non-negative number');
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors 
      });
    }
    
    // Sanitize input
    req.body = sanitizeObject(req.body);
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Validation error occurred' });
  }
};

// Middleware to validate inventory adjustment
export const validateInventoryAdjustment = (req, res, next) => {
  try {
    const { productId, locationId, quantity } = req.body;
    const errors = [];
    
    // Validate required fields
    const missingFields = validateRequiredFields(req.body, ['productId', 'locationId', 'quantity']);
    if (missingFields.length > 0) {
      errors.push(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Validate ObjectId format
    if (productId && !validateObjectId(productId)) {
      errors.push('Invalid product ID format');
    }
    
    if (locationId && !validateObjectId(locationId)) {
      errors.push('Invalid location ID format');
    }
    
    // Validate quantity
    if (quantity !== undefined && (isNaN(quantity) || !Number.isInteger(Number(quantity)))) {
      errors.push('Quantity must be an integer');
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors 
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Validation error occurred' });
  }
};

// Middleware to validate ObjectId parameters
export const validateObjectIdParam = (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'ID parameter is required' });
    }
    
    if (!validateObjectId(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Validation error occurred' });
  }
};

export default {
  validateEmail,
  validatePassword,
  validateObjectId,
  validateRequiredFields,
  validateStringLength,
  validateNumberRange,
  sanitizeInput,
  sanitizeObject,
  validateUserRegistration,
  validateProduct,
  validateInventoryAdjustment,
  validateObjectIdParam
};