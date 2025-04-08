import React from "react";
import { KeenIcon } from "@/components";
import './drawer.css'
const SidePopover = ({ isDrawerOpen, onClose, children, title }) => {
  return (
    <div className={`right-drawer ${isDrawerOpen ? "open" : ""} `}>
      {/* Drawer Header */}
      <div className="drawer-header">
        <div className="flex justify-between items-center w-full">
          <div>
            <h2 className="text-gray-900 font-medium">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary text-gray-500"
          >
            <KeenIcon icon="cross" />
          </button>
        </div>
      </div>

      {/* Render Children */}
      <div className="drawer-body p-4">
        {children}
      </div>
    </div>
  );
};

export { SidePopover };
