import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { useParams, useNavigate } from 'react-router';  // <-- useNavigate to go back
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';  // <-- Toastify for notifications
import SecondaryPanel from './SecondaryPanel';
// import ContactsHeader from './ContactsHeader';

// Simple navbar and toolbar components for layout
const PageNavbar = () => (
  <div style={{ backgroundColor: '#eee', padding: 8 }}>Page Navbar Placeholder</div>
);

const Toolbar = ({ children }) => (
  <div style={{ borderBottom: '1px solid #ccc', margin: '16px 0' }}>{children}</div>
);

const ToolbarHeading = ({ children }) => (
  <div style={{ padding: '8px 0' }}>{children}</div>
);

const API_URL = import.meta.env?.VITE_FLASHFORCE_API_URL || 'https://example.com';



const NewActivity = () => {
  const [secondaryPanelVisible, setSecondaryPanelVisible] = useState(true);
  const [menuVisible, setMenuVisible] = useState(true);
  const [secondaryPanelOpen, setSecondaryPanelOpen] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedContactIndex, setSelectedContactIndex] = useState(-1);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("all");
  const [showDrawer, setShowDrawer] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
   

  const toggleSecondaryPanel = () => {
    setSecondaryPanelVisible(!secondaryPanelVisible);
    setSecondaryPanelOpen(!secondaryPanelOpen);
  };
  const navigate = useNavigate();  // <-- We'll use this to go back
    return(
        <div>

<div className={`${menuVisible ? 'w-64' : 'w-16'} border-r border-gray-200 bg-white transition-all duration-300 ease-in-out h-full`}>
        <SecondaryPanel 
          isOpen={secondaryPanelOpen}
          onToggle={toggleSecondaryPanel}
          menuVisible={menuVisible}
          onToggleMenu={toggleMenu}
        />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
            {/* <ContactsHeader 
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              showSearchBar={showSearchBar}
              setShowSearchBar={setShowSearchBar}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              toggleSearchBar={toggleSearchBar}
              showFilterDrawer={showFilterDrawer}
              setShowFilterDrawer={setShowFilterDrawer}
              filterOptions={filterOptions}
            /> */}
            
            {/* <ContactsContent 
              contacts={contacts}
              selectedContact={selectedContact}
              handleContactSelect={handleContactSelect}
              handleEditContact={handleEditContact}
              handleViewFullContact={handleViewFullContact}
            /> */}
          </div>
    
 
        </div>
    )
};

export default NewActivity;
