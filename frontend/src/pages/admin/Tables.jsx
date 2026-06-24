import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { TableCellsIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/tables');
      setTables(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch tables');
    } finally {
      setLoading(false);
    }
  };

  const fetchTableData = async (tableName) => {
    try {
      setLoading(true);
      setSelectedTable(tableName);
      const res = await api.get(`/admin/tables/${tableName}?page=${page}&limit=${limit}`);
      setTableData(res.data);
    } catch (error) {
      toast.error('Failed to fetch table data');
    } finally {
      setLoading(false);
    }
  };

  const handleTableClick = (tableName) => {
    setPage(1);
    fetchTableData(tableName);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    if (selectedTable) {
      fetchTableData(selectedTable);
    }
  };

  const filteredTables = tables.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatValue = (value) => {
    if (value === null || value === undefined) return <span className="text-slate-400 italic">null</span>;
    if (typeof value === 'object') return <span className="text-xs font-mono">JSON</span>;
    if (typeof value === 'string' && value.length > 100) return value.substring(0, 100) + '...';
    return String(value);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 card p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">
            <TableCellsIcon className="w-5 h-5 inline mr-2" />
            Tables
          </h2>
          <button
            onClick={fetchTables}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
            title="Refresh"
          >
            <ArrowPathIcon className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <input
          type="text"
          placeholder="Search tables..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field text-sm mb-3"
        />

        {loading && !tables.length ? (
          <div className="text-center py-8 text-slate-500">Loading...</div>
        ) : (
          <ul className="space-y-1">
            {filteredTables.map((tbl) => (
              <li key={tbl.name}>
                <button
                  onClick={() => handleTableClick(tbl.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex justify-between items-center ${
                    selectedTable === tbl.name
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{tbl.name}</span>
                  <span className="text-xs text-slate-400">({tbl.rows})</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Data Grid */}
      <div className="flex-1 card p-4 overflow-auto">
        {selectedTable && tableData ? (
          <>
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white dark:bg-slate-800 z-10 pb-2 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                  {selectedTable}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {tableData.pagination.total} rows • Page {tableData.pagination.page} of {tableData.pagination.pages}
                </p>
              </div>
              <button
                onClick={() => fetchTableData(selectedTable)}
                className="btn-secondary text-sm flex items-center gap-1"
              >
                <ArrowPathIcon className="w-4 h-4" /> Refresh
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-50 dark:bg-slate-700 z-10">
                  <tr>
                    {tableData.columns.map((col) => (
                      <th
                        key={col}
                        className="px-3 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {tableData.data.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      {tableData.columns.map((col) => (
                        <td
                          key={col}
                          className="px-3 py-2 text-slate-700 dark:text-slate-300 max-w-xs truncate"
                          title={row[col] !== null && row[col] !== undefined ? String(row[col]) : ''}
                        >
                          {formatValue(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {tableData.pagination.pages > 1 && (
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Showing {((tableData.pagination.page - 1) * tableData.pagination.limit) + 1} to{' '}
                  {Math.min(tableData.pagination.page * tableData.pagination.limit, tableData.pagination.total)} of{' '}
                  {tableData.pagination.total}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(tableData.pagination.page - 1)}
                    disabled={tableData.pagination.page === 1}
                    className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm text-slate-600 dark:text-slate-300">
                    {tableData.pagination.page} / {tableData.pagination.pages}
                  </span>
                  <button
                    onClick={() => handlePageChange(tableData.pagination.page + 1)}
                    disabled={tableData.pagination.page === tableData.pagination.pages}
                    className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
            <TableCellsIcon className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg font-medium">Select a table to view data</p>
            <p className="text-sm">Choose a table from the sidebar to browse its contents</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tables;