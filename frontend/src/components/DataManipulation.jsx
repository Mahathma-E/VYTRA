import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const DataManipulation = () => {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataType, setDataType] = useState('products');
  const [editingRow, setEditingRow] = useState(null);
  const [editData, setEditData] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  useEffect(() => {
    fetchData();
  }, [dataType]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      let endpoint = '';
      switch (dataType) {
        case 'products':
          endpoint = 'http://localhost:8003/api/products';
          break;
        case 'inventory':
          endpoint = 'http://localhost:8003/api/inventory';
          break;
        case 'sales':
          endpoint = 'http://localhost:8003/api/analytics/custom-report';
          break;
        case 'suppliers':
          endpoint = 'http://localhost:8003/api/suppliers';
          break;
        default:
          endpoint = 'http://localhost:8003/api/products';
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (dataType === 'sales') {
        setData(result.data || []);
      } else {
        setData(Array.isArray(result) ? result : result.data || []);
      }
    } catch (err) {
      setError('Error fetching data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    setEditingRow(row._id || row.id);
    setEditData({ ...row });
  };

  const handleSave = async () => {
    try {
      let endpoint = '';
      let method = 'PUT';
      
      switch (dataType) {
        case 'products':
          endpoint = `http://localhost:8003/api/products/${editingRow}`;
          break;
        case 'inventory':
          endpoint = `http://localhost:8003/api/inventory/${editingRow}`;
          break;
        case 'suppliers':
          endpoint = `http://localhost:8003/api/suppliers/${editingRow}`;
          break;
        default:
          return;
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        setEditingRow(null);
        setEditData({});
        fetchData(); // Refresh data
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Update failed');
      }
    } catch (err) {
      setError('Error updating data: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      let endpoint = '';
      
      switch (dataType) {
        case 'products':
          endpoint = `http://localhost:8003/api/products/${id}`;
          break;
        case 'inventory':
          endpoint = `http://localhost:8003/api/inventory/${id}`;
          break;
        case 'suppliers':
          endpoint = `http://localhost:8003/api/suppliers/${id}`;
          break;
        default:
          return;
      }

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchData(); // Refresh data
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Delete failed');
      }
    } catch (err) {
      setError('Error deleting data: ' + err.message);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedRows.length === 0) {
      setError('Please select an action and items');
      return;
    }

    try {
      for (const id of selectedRows) {
        let endpoint = '';
        
        switch (dataType) {
          case 'products':
            endpoint = `http://localhost:8003/api/products/${id}`;
            break;
          case 'inventory':
            endpoint = `http://localhost:8003/api/inventory/${id}`;
            break;
          case 'suppliers':
            endpoint = `http://localhost:8003/api/suppliers/${id}`;
            break;
          default:
            continue;
        }

        let updateData = {};
        
        switch (bulkAction) {
          case 'activate':
            updateData.status = 'active';
            break;
          case 'deactivate':
            updateData.status = 'inactive';
            break;
          case 'delete':
            await fetch(endpoint, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            continue;
        }

        if (Object.keys(updateData).length > 0) {
          await fetch(endpoint, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
          });
        }
      }

      setSelectedRows([]);
      setBulkAction('');
      fetchData(); // Refresh data
    } catch (err) {
      setError('Error performing bulk action: ' + err.message);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = data.filter(item => {
    const matchesSearch = !filters.search || 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(filters.search.toLowerCase())
      );
    
    const matchesCategory = !filters.category || 
      (item.category && item.category.toLowerCase().includes(filters.category.toLowerCase()));
    
    const matchesStatus = !filters.status || 
      (item.status && item.status.toLowerCase() === filters.status.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const getColumns = () => {
    switch (dataType) {
      case 'products':
        return [
          { key: 'name', label: 'Name' },
          { key: 'sku', label: 'SKU' },
          { key: 'category', label: 'Category' },
          { key: 'price', label: 'Price' },
          { key: 'cost', label: 'Cost' },
          { key: 'brand', label: 'Brand' },
          { key: 'status', label: 'Status' }
        ];
      case 'inventory':
        return [
          { key: 'product', label: 'Product' },
          { key: 'quantity', label: 'Quantity' },
          { key: 'location', label: 'Location' },
          { key: 'lastUpdated', label: 'Last Updated' }
        ];
      case 'sales':
        return [
          { key: 'product', label: 'Product' },
          { key: 'quantity', label: 'Quantity' },
          { key: 'price', label: 'Price' },
          { key: 'total', label: 'Total' },
          { key: 'date', label: 'Date' },
          { key: 'customer', label: 'Customer' }
        ];
      case 'suppliers':
        return [
          { key: 'name', label: 'Name' },
          { key: 'contactPerson', label: 'Contact Person' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'status', label: 'Status' }
        ];
      default:
        return [];
    }
  };

  const renderCell = (item, column) => {
    if (editingRow === (item._id || item.id)) {
      return (
        <input
          type={column.key === 'price' || column.key === 'cost' || column.key === 'quantity' ? 'number' : 'text'}
          value={editData[column.key] || ''}
          onChange={(e) => setEditData({ ...editData, [column.key]: e.target.value })}
          className="w-full px-2 py-1 border rounded"
        />
      );
    }

    const value = item[column.key];
    if (column.key === 'date') {
      return new Date(value).toLocaleDateString();
    }
    if (column.key === 'price' || column.key === 'cost' || column.key === 'total') {
      return `$${parseFloat(value || 0).toFixed(2)}`;
    }
    if (column.key === 'product' && typeof value === 'object') {
      return value.name || value;
    }
    
    return value || '-';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Data Manipulation</h2>
      
      {/* Controls */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Type</label>
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="products">Products</option>
              <option value="inventory">Inventory</option>
              <option value="sales">Sales</option>
              <option value="suppliers">Suppliers</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              placeholder="Filter by category..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedRows.length > 0 && (
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">
              {selectedRows.length} item(s) selected
            </span>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Action</option>
              <option value="activate">Activate</option>
              <option value="deactivate">Deactivate</option>
              <option value="delete">Delete</option>
            </select>
            <button
              onClick={handleBulkAction}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
            <button
              onClick={() => setSelectedRows([])}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">Loading data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === sortedData.length && sortedData.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows(sortedData.map(item => item._id || item.id));
                        } else {
                          setSelectedRows([]);
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  {getColumns().map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort(column.key)}
                    >
                      {column.label}
                      {sortConfig.key === column.key && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedData.map((item) => (
                  <tr key={item._id || item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item._id || item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRows([...selectedRows, item._id || item.id]);
                          } else {
                            setSelectedRows(selectedRows.filter(id => id !== (item._id || item.id)));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    {getColumns().map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {renderCell(item, column)}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {editingRow === (item._id || item.id) ? (
                        <>
                          <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-900"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingRow(null);
                              setEditData({});
                            }}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id || item.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {sortedData.length === 0 && !loading && (
          <div className="p-8 text-center">
            <p className="text-gray-600">No data found</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Total Records:</span>
            <span className="ml-1">{data.length}</span>
          </div>
          <div>
            <span className="font-medium">Filtered:</span>
            <span className="ml-1">{sortedData.length}</span>
          </div>
          <div>
            <span className="font-medium">Selected:</span>
            <span className="ml-1">{selectedRows.length}</span>
          </div>
          <div>
            <span className="font-medium">Editing:</span>
            <span className="ml-1">{editingRow ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManipulation;
