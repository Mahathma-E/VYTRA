import { readData, writeData, addItem, updateItem, deleteItem, findById, find, count } from '../storage/dataStore.js';

// Base model class for JSON-based data
export class JsonModel {
  constructor(dataType) {
    this.dataType = dataType;
  }

  // Create a new document
  async create(data) {
    return addItem(this.dataType, data);
  }

  // Find documents by query
  async find(query = {}) {
    return find(this.dataType, query);
  }

  // Find one document by query
  async findOne(query = {}) {
    const results = await this.find(query);
    return results.length > 0 ? results[0] : null;
  }

  // Find document by ID
  async findById(id) {
    return findById(this.dataType, id);
  }

  // Update document by ID
  async findByIdAndUpdate(id, updates, options = {}) {
    const updated = updateItem(this.dataType, id, updates);
    if (updated && options.new) {
      return updated;
    }
    return updated;
  }

  // Delete document by ID
  async findByIdAndDelete(id) {
    return deleteItem(this.dataType, id);
  }

  // Count documents
  async countDocuments(query = {}) {
    return count(this.dataType, query);
  }

  // Update one document
  async updateOne(query, updates) {
    const items = await this.find(query);
    if (items.length > 0) {
      return updateItem(this.dataType, items[0]._id, updates);
    }
    return null;
  }

  // Update many documents
  async updateMany(query, updates) {
    const items = await this.find(query);
    const results = [];
    for (const item of items) {
      const updated = updateItem(this.dataType, item._id, updates);
      if (updated) {
        results.push(updated);
      }
    }
    return results;
  }

  // Delete one document
  async deleteOne(query) {
    const items = await this.find(query);
    if (items.length > 0) {
      return deleteItem(this.dataType, items[0]._id);
    }
    return false;
  }

  // Delete many documents
  async deleteMany(query) {
    const items = await this.find(query);
    let deletedCount = 0;
    for (const item of items) {
      if (deleteItem(this.dataType, item._id)) {
        deletedCount++;
      }
    }
    return { deletedCount };
  }

  // Aggregate (simplified version)
  async aggregate(pipeline) {
    let data = await this.find();
    
    for (const stage of pipeline) {
      if (stage.$match) {
        data = data.filter(item => {
          return Object.entries(stage.$match).every(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
              return Object.entries(value).every(([op, val]) => {
                if (op === '$gte') return item[key] >= val;
                if (op === '$lte') return item[key] <= val;
                if (op === '$gt') return item[key] > val;
                if (op === '$lt') return item[key] < val;
                return item[key] === val;
              });
            }
            return item[key] === value;
          });
        });
      }
      
      if (stage.$group) {
        const grouped = {};
        data.forEach(item => {
          const groupKey = stage.$group._id;
          let key;
          if (typeof groupKey === 'string') {
            key = item[groupKey];
          } else if (typeof groupKey === 'object') {
            key = Object.entries(groupKey).map(([k, v]) => `${k}:${item[k]}`).join('_');
          } else {
            key = 'all';
          }
          
          if (!grouped[key]) {
            grouped[key] = { _id: key };
          }
          
          Object.entries(stage.$group).forEach(([field, operation]) => {
            if (field === '_id') return;
            
            if (operation.$sum) {
              if (typeof operation.$sum === 'string') {
                grouped[key][field] = (grouped[key][field] || 0) + (item[operation.$sum] || 0);
              } else {
                grouped[key][field] = (grouped[key][field] || 0) + operation.$sum;
              }
            }
            
            if (operation.$avg) {
              if (!grouped[key][field]) {
                grouped[key][field] = { sum: 0, count: 0 };
              }
              grouped[key][field].sum += item[operation.$avg] || 0;
              grouped[key][field].count += 1;
            }
            
            if (operation.$count) {
              grouped[key][field] = (grouped[key][field] || 0) + 1;
            }
          });
        });
        
        // Convert avg operations to actual averages
        Object.values(grouped).forEach(group => {
          Object.entries(group).forEach(([field, value]) => {
            if (typeof value === 'object' && value.sum !== undefined) {
              group[field] = value.count > 0 ? value.sum / value.count : 0;
            }
          });
        });
        
        data = Object.values(grouped);
      }
      
      if (stage.$sort) {
        data.sort((a, b) => {
          for (const [field, direction] of Object.entries(stage.$sort)) {
            const aVal = a[field];
            const bVal = b[field];
            if (aVal < bVal) return direction === 1 ? -1 : 1;
            if (aVal > bVal) return direction === 1 ? 1 : -1;
          }
          return 0;
        });
      }
      
      if (stage.$limit) {
        data = data.slice(0, stage.$limit);
      }
    }
    
    return data;
  }

  // Populate (simplified version for relationships)
  async populate(data, path) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    
    const [modelName, field] = path.split('.');
    const relatedData = await readData(modelName);
    
    return data.map(item => {
      if (item[field]) {
        const related = relatedData.find(rel => rel._id === item[field]);
        if (related) {
          item[field] = related;
        }
      }
      return item;
    });
  }
}

// Create model instances
export const User = new JsonModel('users');
export const Product = new JsonModel('products');
export const Inventory = new JsonModel('inventory');
export const Sales = new JsonModel('sales');
export const Supplier = new JsonModel('suppliers');
export const Alert = new JsonModel('alerts');

export default {
  User,
  Product,
  Inventory,
  Sales,
  Supplier,
  Alert,
  JsonModel
};
