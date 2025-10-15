import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const DataAnalysis = () => {
  const { token } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataType, setDataType] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [report, setReport] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    // Set default date range (last 30 days)
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
  }, []);

  const analyzeData = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (dataType !== 'all') params.append('dataType', dataType);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`http://localhost:8003/api/analytics/analyze-imported-data?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        setError(data.message || 'Analysis failed');
      }
    } catch (err) {
      setError('Error analyzing data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setGeneratingReport(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8003/api/analytics/comprehensive-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          startDate: startDate || null,
          endDate: endDate || null,
          includeCharts: true
        })
      });

      const data = await response.json();

      if (data.success) {
        setReport(data.report);
      } else {
        setError(data.message || 'Report generation failed');
      }
    } catch (err) {
      setError('Error generating report: ' + err.message);
    } finally {
      setGeneratingReport(false);
    }
  };

  const downloadReport = () => {
    if (!report) return;

    const reportData = {
      reportId: report.reportId,
      generatedAt: report.generatedAt,
      period: report.period,
      executiveSummary: report.executiveSummary,
      detailedAnalysis: report.detailedAnalysis,
      recommendations: report.recommendations
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_report_${report.reportId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const StatCard = ({ title, value, color = 'blue', subtitle = '' }) => (
    <div className={`p-4 bg-${color}-50 rounded-lg`}>
      <h4 className={`font-semibold text-${color}-800`}>{title}</h4>
      <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
      {subtitle && <p className={`text-sm text-${color}-600`}>{subtitle}</p>}
    </div>
  );

  const ChartCard = ({ title, data, type = 'bar' }) => (
    <div className="p-4 bg-white border rounded-lg">
      <h4 className="font-semibold text-gray-800 mb-3">{title}</h4>
      {data && data.labels && data.data ? (
        <div className="space-y-2">
          {data.labels.map((label, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{label}</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(data.data[index] / Math.max(...data.data)) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{data.data[index]}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No data available</p>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Data Analysis & Reporting</h2>
      
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
              <option value="all">All Data</option>
              <option value="products">Products</option>
              <option value="sales">Sales</option>
              <option value="inventory">Inventory</option>
              <option value="suppliers">Suppliers</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end space-x-2">
            <button
              onClick={analyzeData}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
            <button
              onClick={generateReport}
              disabled={generatingReport}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              {generatingReport ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">Analysis Results</h3>
          
          {/* Overview Stats */}
          {analysis.overview && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard 
                title="Total Products" 
                value={analysis.overview.totalProducts} 
                color="blue" 
              />
              <StatCard 
                title="Total Revenue" 
                value={`$${analysis.overview.totalRevenue?.toLocaleString() || 0}`} 
                color="green" 
              />
              <StatCard 
                title="Inventory Value" 
                value={`$${analysis.overview.totalInventoryValue?.toLocaleString() || 0}`} 
                color="purple" 
              />
              <StatCard 
                title="Active Suppliers" 
                value={analysis.overview.totalSuppliers} 
                color="yellow" 
              />
            </div>
          )}

          {/* Product Analysis */}
          {analysis.products && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard 
                title="Top Categories" 
                data={{
                  labels: analysis.products.topCategories?.map(c => c[0]) || [],
                  data: analysis.products.topCategories?.map(c => c[1]) || []
                }} 
              />
              <ChartCard 
                title="Top Brands" 
                data={{
                  labels: analysis.products.topBrands?.map(b => b[0]) || [],
                  data: analysis.products.topBrands?.map(b => b[1]) || []
                }} 
              />
            </div>
          )}

          {/* Sales Analysis */}
          {analysis.sales && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard 
                title="Top Selling Products" 
                data={{
                  labels: analysis.sales.topProducts?.map(p => p[0]) || [],
                  data: analysis.sales.topProducts?.map(p => p[1]) || []
                }} 
              />
              <ChartCard 
                title="Category Performance" 
                data={{
                  labels: analysis.sales.categoryPerformance?.map(c => c[0]) || [],
                  data: analysis.sales.categoryPerformance?.map(c => c[1]) || []
                }} 
              />
            </div>
          )}

          {/* Inventory Analysis */}
          {analysis.inventory && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard 
                title="Low Stock Items" 
                value={analysis.inventory.lowStockCount} 
                color="yellow" 
              />
              <StatCard 
                title="Out of Stock" 
                value={analysis.inventory.outOfStockCount} 
                color="red" 
              />
              <StatCard 
                title="Total Inventory Value" 
                value={`$${analysis.inventory.totalValue?.toLocaleString() || 0}`} 
                color="green" 
              />
            </div>
          )}
        </div>
      )}

      {/* Comprehensive Report */}
      {report && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Comprehensive Report</h3>
            <button
              onClick={downloadReport}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Download Report
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Executive Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Report ID:</span>
                  <span className="ml-1">{report.reportId}</span>
                </div>
                <div>
                  <span className="font-medium">Generated:</span>
                  <span className="ml-1">{new Date(report.generatedAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-medium">Period:</span>
                  <span className="ml-1">{report.period.startDate} to {report.period.endDate}</span>
                </div>
                <div>
                  <span className="font-medium">Total Revenue:</span>
                  <span className="ml-1">${report.executiveSummary.totalRevenue?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {report.executiveSummary.keyInsights && report.executiveSummary.keyInsights.length > 0 && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Key Insights</h4>
                <ul className="list-disc list-inside text-sm text-green-700">
                  {report.executiveSummary.keyInsights.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </div>
            )}

            {report.recommendations && report.recommendations.length > 0 && (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Recommendations</h4>
                <ul className="list-disc list-inside text-sm text-yellow-700">
                  {report.recommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataAnalysis;
