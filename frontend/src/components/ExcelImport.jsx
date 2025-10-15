import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Get API base URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8003';

const ExcelImport = () => {
  const { token } = useAuth();
  const [file, setFile] = useState(null);
  const [dataType, setDataType] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [template, setTemplate] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      
      if (allowedTypes.includes(selectedFile.type) || 
          selectedFile.name.endsWith('.xlsx') || 
          selectedFile.name.endsWith('.xls') || 
          selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please select a valid Excel (.xlsx, .xls) or CSV file');
        setFile(null);
      }
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Please select a file to import');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('dataType', dataType);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/excel/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const data = response.data;

      if (data.success) {
        setResult(data.analysis);
      } else {
        setError(data.message || 'Import failed');
      }
    } catch (err) {
      setError('Error importing file: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTemplate = async (type) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/excel/template`, {
        params: { type }
      });

      const data = response.data;
      if (data.success) {
        setTemplate(data);
      }
    } catch (err) {
      console.error('Error fetching template:', err);
    }
  };

  const downloadTemplate = () => {
    if (!template) return;

    // Create a simple CSV template
    const headers = Object.keys(template.template);
    const sampleData = Object.values(template.template);
    
    const csvContent = [
      headers.join(','),
      sampleData.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.dataType}_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Excel Data Import</h2>
      
      {/* File Upload Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select File
        </label>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {file && (
          <p className="mt-2 text-sm text-green-600">
            Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
        )}
      </div>

      {/* Data Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Data Type
        </label>
        <select
          value={dataType}
          onChange={(e) => setDataType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="auto">Auto-detect</option>
          <option value="products">Products</option>
          <option value="inventory">Inventory</option>
          <option value="sales">Sales</option>
          <option value="suppliers">Suppliers</option>
        </select>
      </div>

      {/* Template Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Download Template</h3>
        <div className="flex gap-2 flex-wrap">
          {['products', 'inventory', 'sales', 'suppliers'].map((type) => (
            <button
              key={type}
              onClick={() => getTemplate(type)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              {type.charAt(0).toUpperCase() + type.slice(1)} Template
            </button>
          ))}
        </div>
        {template && (
          <div className="mt-3">
            <button
              onClick={downloadTemplate}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Download {template.dataType} Template
            </button>
            <div className="mt-2 text-sm text-gray-600">
              <p><strong>Instructions:</strong></p>
              <ul className="list-disc list-inside mt-1">
                {template.instructions?.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Import Button */}
      <div className="mb-6">
        <button
          onClick={handleImport}
          disabled={!file || loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Importing...' : 'Import Data'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Import Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800">Total Rows</h4>
              <p className="text-2xl font-bold text-blue-600">{result.totalRows}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800">Processed</h4>
              <p className="text-2xl font-bold text-green-600">{result.processedRows}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-800">Errors</h4>
              <p className="text-2xl font-bold text-yellow-600">{result.errors.length}</p>
            </div>
          </div>

          {result.summary && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {Object.entries(result.summary).map(([key, value]) => (
                  <div key={key}>
                    <span className="font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="ml-1">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.errors.length > 0 && (
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">Errors</h4>
              <ul className="list-disc list-inside text-sm text-red-700">
                {result.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {result.warnings.length > 0 && (
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Warnings</h4>
              <ul className="list-disc list-inside text-sm text-yellow-700">
                {result.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExcelImport;
