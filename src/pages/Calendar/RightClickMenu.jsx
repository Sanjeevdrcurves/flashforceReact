import React, { useEffect, useRef } from "react";

const RightClickMenu = ({ menu, closeMenu }) => {
  const menuRef = useRef();

  // Close menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeMenu]);

  // Handle menu actions
  const handleEdit = () => {
    alert(`Editing event: ${menu.event.title}`);
    closeMenu();
  };

  const handleDelete = () => {
    if (window.confirm(`Delete event: ${menu.event.title}?`)) {
      alert(`Event deleted!`);
    }
    closeMenu();
  };

  return (
    <div
      ref={menuRef}
      className="absolute bg-white border shadow-md rounded-md p-2"
      style={{ top: `${menu.y}px`, left: `${menu.x}px` }}
    >
      <p className="text-gray-700 font-bold px-2">{menu.event.title}</p>
      <button
        className="text-blue-500 px-2 py-1 hover:bg-gray-100 w-full text-left"
        onClick={handleEdit}
      >
        Edit
      </button>
      <button
        className="text-red-500 px-2 py-1 hover:bg-gray-100 w-full text-left"
        onClick={handleDelete}
      >
        Delete
      </button>
      <button
        className="text-gray-500 px-2 py-1 hover:bg-gray-100 w-full text-left"
        onClick={closeMenu}
      >
        Close
      </button>
    </div>
  );
};

export default RightClickMenu;
