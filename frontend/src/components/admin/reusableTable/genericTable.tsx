/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';

// Generic type for table data
interface TableData {
  [key: string]: any;
  _id: string;
}

// Column definition interface
interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

// Props interface for the table
interface GenericTableProps<T extends TableData> {
  data: T[];
  columns: Column<T>[];
  itemsPerPage?: number;
  searchKeys?: (keyof T)[];
  actionButtons?: (row: T) => React.ReactNode;
  onRowAction?: (action: string, row: T) => void;
}

function GenericTable<T extends TableData>({
  data,
  columns,
  itemsPerPage = 5,
  searchKeys = [],
  actionButtons,
  onRowAction
}: GenericTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState<T[]>(data);

  // Reset current page when data changes
  useEffect(() => {
    setFilteredData(data);
    setCurrentPage(1);
  }, [data]);

  // Search and filter logic
  useEffect(() => {
    const filtered = data.filter(item => 
      searchKeys.some(key => 
        String(item[key]).toLowerCase().includes(search.toLowerCase())
      )
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [search, data]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Search Input */}
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-md w-full md:w-72 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        {/* Desktop Table */}
        <table className="hidden md:table w-full table-auto">
          <thead>
            <tr className="bg-gray-800 text-white">
              {columns.map((column) => (
                <th key={String(column.key)} className="py-3 px-4 text-left">
                  {column.label}
                </th>
              ))}
              {actionButtons && <th className="py-3 px-4 text-left">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((row, index) => (
              <tr key={row._id} className="border-b hover:bg-gray-100">
                {columns.map((column) => (
                  <td key={String(column.key)} className="py-3 px-4">
                    {column.render 
                      ? column.render(row[column.key], row)
                      : String(row[column.key])
                    }
                  </td>
                ))}
                {actionButtons && (
                  <td className="py-3 px-4">
                    {actionButtons(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Card Layout */}
        <div className="block md:hidden">
          {currentItems.map((row) => (
            <div key={row._id} className="bg-white shadow-md rounded-md mb-4 p-4">
              {columns.map((column) => (
                <div key={String(column.key)} className="mb-2">
                  <strong>{column.label}: </strong>
                  {column.render 
                    ? column.render(row[column.key], row)
                    : String(row[column.key])
                  }
                </div>
              ))}
              {actionButtons && (
                <div className="mt-2">
                  {actionButtons(row)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <div className="space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded-md border ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-black'} hover:bg-blue-500 hover:text-white transition-colors`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GenericTable;