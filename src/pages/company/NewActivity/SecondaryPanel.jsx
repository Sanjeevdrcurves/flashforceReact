
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home,
  Users,
  Building,
  CheckSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserPlus,
} from 'lucide-react';
import { useIsMobile, useDeviceType } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const PANEL_STATE_KEY = 'secondaryPanel.isExpanded';

const SecondaryPanel = ({ 
  isOpen, 
  onToggle, 
  menuVisible, 
  onToggleMenu,
  menuItems 
}) => {
  const isMobile = useIsMobile();
  const deviceType = useDeviceType();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('all');
  
  // If menuVisible and onToggleMenu are not provided, use local state and localStorage
  const [localMenuVisible, setLocalMenuVisible] = useState(true);
  
  // Load the saved menu state on initial render if using local state
  useEffect(() => {
    if (onToggleMenu === undefined) {
      const savedMenuState = localStorage.getItem(PANEL_STATE_KEY);
      if (savedMenuState !== null) {
        setLocalMenuVisible(JSON.parse(savedMenuState));
      }
    }
  }, [onToggleMenu]);
  
  // Use either the prop or local state
  const isMenuVisible = menuVisible !== undefined ? menuVisible : localMenuVisible;
  
  // Default menu items if none are provided
  const defaultMenuItems = [
    { id: 'all', label: 'All', icon: Home, path: '/company/NewActivity', tooltip: 'All' },
    { id: 'persons', label: 'Persons', icon: Users, path: '/billing/revenue-report', tooltip: 'Persons' },
    { id: 'places', label: 'Places', icon: Building, path: '/company/NewActivity/places', tooltip: 'Places' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, path: '/company/NewActivity/tasks', tooltip: 'Tasks' },
    { id: 'manage-groups', label: 'Manage Groups', icon: UserPlus, path: '/company/NewActivity/groups', tooltip: 'Manage Groups' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/company/NewActivity/settings', tooltip: 'Settings' },
  ];
  
  // Use provided menu items or fall back to defaults
  const navItems = menuItems || defaultMenuItems;
  
  // Update active item based on current route
  useEffect(() => {
    const path = location.pathname;
    const currentRoute = navItems.find(item => path === item.path || path.includes(item.path));
    if (currentRoute) {
      setActiveItem(currentRoute.id);
    }
  }, [location, navItems]);
  
  const handleToggleMenu = () => {
    if (onToggleMenu) {
      onToggleMenu();
    } else {
      const newState = !localMenuVisible;
      setLocalMenuVisible(newState);
      // Save menu state to localStorage to persist across route changes
      localStorage.setItem(PANEL_STATE_KEY, JSON.stringify(newState));
    }
  };
  
  return (
    <div className={cn(
      "h-full border-l border-gray-200 bg-white transition-all duration-300 overflow-hidden flex flex-col relative",
      isOpen ? (
        isMobile 
          ? "fixed top-14 right-0 w-full z-50 h-[calc(100vh-56px)] shadow-lg panel-slide-in" 
          : "w-full shadow-sm"
      ) : "w-0"
    )}>
      <div className={cn(
        "p-3 md:p-4 flex-1", 
        !isMenuVisible && "p-2",
        isMenuVisible ? "sidebar-expand" : "sidebar-collapse"
      )}>
        {isMobile && isOpen && (
          <div className="flex justify-end mb-2 animate-fade-in">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 -mt-1 -mr-1 hover:bg-gray-100 transition-colors"
              onClick={onToggle}
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        )}
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4 animate-fade-in">
            {isMenuVisible && <h2 className="text-lg font-medium text-gray-800">{navItems.length > 0 ? navItems[0].tooltip || navItems[0].label : "Navigation"}</h2>}
            <div className="flex items-center ml-auto">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 hover:bg-gray-100 transition-colors"
                onClick={handleToggleMenu}
                aria-label={isMenuVisible ? "Collapse panel" : "Expand panel"}
              >
                {isMenuVisible ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </Button>
            </div>
          </div>
          
          <div className={cn(
            "space-y-1 animate-fade-in stagger-1",
            deviceType === "mobile" ? "pt-2" : ""
          )}>
            <TooltipProvider>
              {navItems.map((item) => (
                <Tooltip key={item.id} delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-2 rounded-md text-sm font-medium transition-all px-2 py-2 w-full",
                        activeItem === item.id 
                          ? "bg-blue-50 text-blue-600 shadow-sm" 
                          : "text-gray-700 hover:bg-gray-50",
                        !isMenuVisible && "justify-center"
                      )}
                      onClick={() => setActiveItem(item.id)}
                    >
                      <item.icon 
                        size={18} 
                        className={cn(
                          activeItem === item.id ? "text-blue-600" : "text-gray-600",
                          "transition-colors"
                        )} 
                      />
                      {isMenuVisible && <span className="transition-opacity duration-200">{item.label}</span>}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className={cn(
                    isMenuVisible ? "hidden" : "",
                    "bg-white shadow-md border border-gray-200 px-2 py-1 rounded-md text-sm"
                  )}>
                    {item.tooltip || item.label}
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>
      </div>
      
      {/* Footer with legal and help links - only shown when expanded */}
      {isMenuVisible && (
        <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 animate-fade-in">
          <div className="flex justify-between">
            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Help</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecondaryPanel;
