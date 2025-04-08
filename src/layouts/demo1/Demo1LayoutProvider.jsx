/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useMenuChildren } from '@/components/menu';
import { MENU_SIDEBAR } from '@/config/menu.config';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useMenus } from '@/providers';
import { useLayout } from '@/providers';
import { deepMerge } from '@/utils';
import { demo1LayoutConfig } from './';
import { store } from '../../redux/store';
import axios from 'axios';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

// Interface defining the structure for layout provider properties

// Initial layout properties with default values
const initalLayoutProps = {
  layout: demo1LayoutConfig,
  // Default layout configuration
  megaMenuEnabled: false,
  // Mega menu disabled by default
  headerSticky: false,
  // Header is not sticky by default
  mobileSidebarOpen: false,
  // Mobile sidebar is closed by default
  mobileMegaMenuOpen: false,
  // Mobile mega menu is closed by default
  sidebarMouseLeave: false,
  // Sidebar mouse leave is false initially
  setSidebarMouseLeave: state => {
    console.log(`${state}`);
  },
  setMobileMegaMenuOpen: open => {
    console.log(`${open}`);
  },
  setMobileSidebarOpen: open => {
    console.log(`${open}`);
  },
  setMegaMenuEnabled: enabled => {
    console.log(`${enabled}`);
  },
  setSidebarCollapse: collapse => {
    console.log(`${collapse}`);
  },
  setSidebarTheme: mode => {
    console.log(`${mode}`);
  }
};

// Creating context for the layout provider with initial properties
const Demo1LayoutContext = createContext(initalLayoutProps);

// Custom hook to access the layout context
const useDemo1Layout = () => useContext(Demo1LayoutContext);

// Layout provider component that wraps the application
const Demo1LayoutProvider = ({
  children
}) => {
  const {
    pathname
  } = useLocation(); // Gets the current path
  const {
    setMenuConfig
  } = useMenus(); // Accesses menu configuration methods
  const secondaryMenu = useMenuChildren(pathname, MENU_SIDEBAR, 0); // Retrieves the secondary menu

  const[sidemenu,setsidemenu]=useState([])
  const fetchMenu = async () => {
    try {
        // Extract userId and companyId from Redux store
        const state = store.getState();
        const { userId, companyId } = state.AuthReducerKey;

        // Make an API call to fetch the menu
        const response = await axios.get(`${API_URL}/Feature/GetMenuByUser/${userId}/${companyId}`);

        // Update MENU_SIDEBAR
        // MENU_SIDEBAR = response.data;
        setsidemenu(response.data);
        console.log("Menu fetched successfully:", MENU_SIDEBAR);
    } catch (error) {
        console.error("Failed to fetch menu sidebar:", error);
        setsidemenu([])
        // MENU_SIDEBAR = []; // Fallback in case of an error
    }
};

  // Sets the primary and secondary menu configurations
useEffect(()=>{
  fetchMenu()
},[])

  setMenuConfig('primary', sidemenu);
  setMenuConfig('secondary', secondaryMenu);
  const {
    getLayout,
    updateLayout,
    setCurrentLayout
  } = useLayout(); // Layout management methods

  // Merges the default layout with the current one
  const getLayoutConfig = () => {
    return deepMerge(demo1LayoutConfig, getLayout(demo1LayoutConfig.name));
  };
  const [layout, setLayout] = useState(getLayoutConfig); // State for layout configuration

  // Updates the current layout when the layout state changes
  useEffect(() => {
    setCurrentLayout(layout);
  });
  const [megaMenuEnabled, setMegaMenuEnabled] = useState(false); // State for mega menu toggle

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // State for mobile sidebar

  const [mobileMegaMenuOpen, setMobileMegaMenuOpen] = useState(false); // State for mobile mega menu

  const [sidebarMouseLeave, setSidebarMouseLeave] = useState(false); // State for sidebar mouse leave

  const scrollPosition = useScrollPosition(); // Tracks the scroll position

  const headerSticky = scrollPosition > 0; // Makes the header sticky based on scroll

  // Function to collapse or expand the sidebar
  const setSidebarCollapse = collapse => {
    const updatedLayout = {
      options: {
        sidebar: {
          collapse
        }
      }
    };
    updateLayout(demo1LayoutConfig.name, updatedLayout); // Updates the layout with the collapsed state
    setLayout(getLayoutConfig()); // Refreshes the layout configuration
  };
  const getPermissionRecursive = (menuArray, path) => {
    for (const item of menuArray) {
      if (item.path === path) {
        return {
          canEdit: item.canEdit || false,
          canDelete: item.canDelete || false,
        };
      }

      if (item.children && item.children.length > 0) {
        const permissions = getPermissionRecursive(item.children, path);
        if (permissions) {
          return permissions;
        }
      }
    }
    return null; // Return null if no match is found
  };

  const getPermision = (path) => {
    return getPermissionRecursive(sidemenu, path);
  };

 
  // Function to set the sidebar theme (e.g., light or dark)
  const setSidebarTheme = mode => {
    const updatedLayout = {
      options: {
        sidebar: {
          theme: mode
        }
      }
    };
    setLayout(deepMerge(layout, updatedLayout)); // Merges and sets the updated layout
  };
  return (
    // Provides the layout configuration and controls via context to the application
    <Demo1LayoutContext.Provider value={{
      layout,
      headerSticky,
      mobileSidebarOpen,
      mobileMegaMenuOpen,
      megaMenuEnabled,
      sidebarMouseLeave,
      setMobileSidebarOpen,
      setMegaMenuEnabled,
      setSidebarMouseLeave,
      setMobileMegaMenuOpen,
      setSidebarCollapse,
      setSidebarTheme,
      getPermision
    }}>
      {children}
    </Demo1LayoutContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export { Demo1LayoutProvider, useDemo1Layout };