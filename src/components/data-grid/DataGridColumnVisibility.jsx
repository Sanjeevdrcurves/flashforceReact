import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { KeenIcon } from '@/components/keenicons';

export function DataGridColumnVisibility({ table, hideTitle = false, saveLayout }) {
  const [savedLayouts, setSavedLayouts] = useState([]);
  const [layoutName, setLayoutName] = useState('');

  const handleSaveLayout = () => {
    const currentLayout = table
      .getAllColumns()
      .filter((column) => typeof column.accessorFn !== 'undefined')
      .map((column) => ({
        id: column.id,
        visible: column.getIsVisible(),
      }));

    if (!layoutName) {
      alert('Please enter a layout name');
      return;
    }

    setSavedLayouts((prev) => [...prev, { name: layoutName, layout: currentLayout }]);
    setLayoutName('');
  };

  const handleApplyLayout = (layout) => {
    layout.forEach((col) => {
      const column = table.getColumn(col.id);
      if (column) {
        column.toggleVisibility(col.visible);
      }
    });
  };

  const handleDeleteLayout = (index) => {
    setSavedLayouts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="light" size="sm">
          <KeenIcon icon="setting-4" />
          {!hideTitle && 'Columns'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[250px]">
        {/* Dropdown Label */}
        <DropdownMenuLabel className="font-medium text-gray-700">Select Table Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Column Visibility Toggles */}
        {table
          .getAllColumns()
          .filter(
            (column) => typeof column.accessorFn !== 'undefined' && column.getCanHide()
          )
          .map((column) => {
            const isVisible = column.getIsVisible();
            return (
              <div
                key={column.id}
                className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 rounded-md"
              >
                <span className="capitalize text-sm text-gray-800">
                  {column.columnDef.meta?.headerTitle || column.id}
                </span>
                {/* Custom Switch */}
                <label className="switch switch-sm">
                  <input
                    type="checkbox"
                    name="check"
                    value="1"
                    checked={isVisible}
                    onChange={(e) => {
                      column.toggleVisibility(e.target.checked);
                    }}
                  />
                </label>
              </div>
            );
          })}

        {saveLayout && (
          <>
            <DropdownMenuSeparator />
            {/* Save and Apply Buttons */}
            <div className="px-4 py-2 flex gap-2">
              <input
                type="text"
                placeholder="Layout Name"
                value={layoutName}
                onChange={(e) => setLayoutName(e.target.value)}
                className="flex-1 border rounded-md px-2 py-1 text-sm"
              />
              <Button size="sm" onClick={handleSaveLayout}>
                Save Layout
              </Button>
            </div>

            <DropdownMenuSeparator />
            {/* Saved Layouts */}
            <DropdownMenuLabel className="font-medium text-gray-700">Saved Layouts</DropdownMenuLabel>
            {savedLayouts.length > 0 ? (
              savedLayouts.map((savedLayout, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 rounded-md"
                >
                  <span className="text-sm text-gray-800">{savedLayout.name}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleApplyLayout(savedLayout.layout)}
                      className="flex items-center text-blue-500 text-sm"
                    >
                      <KeenIcon icon="check-circle" className="mr-1 size-4 text-blue-500" />
                      Apply
                    </button>
                    <button
                      onClick={() => handleDeleteLayout(index)}
                      className="flex items-center text-red-500 text-sm"
                    >
                      <KeenIcon icon="trash" className="mr-1 size-4 text-red-500" />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No saved layouts</div>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
