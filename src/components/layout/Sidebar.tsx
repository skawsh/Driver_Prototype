
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { List, User, Settings, Archive, ChevronLeft, Menu } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface NavItemProps {
  icon: React.ElementType;
  title: string;
  to: string;
  isSidebarOpen: boolean;
}

const NavItem = ({ icon: Icon, title, to, isSidebarOpen }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <NavLink to={to} className="w-full">
      <div 
        className={cn(
          "flex items-center rounded-lg px-3 py-3 transition-all duration-300 group",
          isActive 
            ? "bg-primary text-primary-foreground" 
            : "text-foreground/70 hover:bg-secondary hover:text-foreground"
        )}
      >
        <Icon 
          className={cn(
            "h-5 w-5 shrink-0 transition-all duration-300",
            isActive ? "text-primary-foreground" : "text-foreground/70 group-hover:text-foreground"
          )} 
        />
        <span 
          className={cn(
            "ml-3 transition-all duration-300 whitespace-nowrap",
            !isSidebarOpen && "opacity-0 w-0 overflow-hidden"
          )}
        >
          {title}
        </span>
      </div>
    </NavLink>
  );
};

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <>
      {/* Mobile Header with Menu */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <SidebarTrigger>
            <Menu className="h-5 w-5 text-foreground" />
          </SidebarTrigger>
          <h1 className="ml-3 font-medium">Driver Panel</h1>
        </div>
      </div>
      
      {/* Desktop Sidebar */}
      <aside className={cn(
        "h-screen bg-sidebar fixed left-0 top-0 z-50 hidden lg:flex flex-col border-r transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-16"
      )}>
        <div className="p-4 flex items-center justify-between border-b h-16">
          <h1 className={cn(
            "font-semibold text-lg transition-all duration-300",
            !isOpen && "opacity-0 w-0 overflow-hidden"
          )}>
            Driver Panel
          </h1>
          <button 
            onClick={toggleSidebar} 
            className="p-1 rounded-md hover:bg-secondary transition-all duration-300"
          >
            <ChevronLeft className={cn(
              "h-5 w-5 transition-all duration-300",
              !isOpen && "rotate-180"
            )} />
          </button>
        </div>
        
        <nav className="flex-1 pt-5 pb-10 px-3 space-y-1 overflow-y-auto">
          <NavItem 
            icon={List} 
            title="Assigned Orders" 
            to="/" 
            isSidebarOpen={isOpen} 
          />
          <NavItem 
            icon={Archive} 
            title="Order History" 
            to="/order-history" 
            isSidebarOpen={isOpen} 
          />
          <NavItem 
            icon={User} 
            title="Profile" 
            to="/profile" 
            isSidebarOpen={isOpen} 
          />
          <NavItem 
            icon={Settings} 
            title="Settings" 
            to="/settings" 
            isSidebarOpen={isOpen} 
          />
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
