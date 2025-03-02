
import React from 'react';
import { cn } from '@/lib/utils';
import { NavLink, useLocation } from 'react-router-dom';
import { List, User, Settings, Archive } from 'lucide-react';

interface MobileNavItemProps {
  icon: React.ElementType;
  title: string;
  to: string;
}

const MobileNavItem = ({ icon: Icon, title, to }: MobileNavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <NavLink to={to} className="flex-1">
      <div className={cn(
        "flex flex-col items-center justify-center py-2",
        isActive ? "text-primary" : "text-foreground/70"
      )}>
        <Icon className={cn(
          "h-5 w-5",
          isActive ? "text-primary" : "text-foreground/70"
        )} />
        <span className="text-xs mt-1">{title}</span>
      </div>
    </NavLink>
  );
};

export const MobileNavigation = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-50 lg:hidden">
      <div className="flex items-center justify-around px-2">
        <MobileNavItem icon={List} title="Orders" to="/" />
        <MobileNavItem icon={Archive} title="History" to="/order-history" />
        <MobileNavItem icon={User} title="Profile" to="/profile" />
        <MobileNavItem icon={Settings} title="Settings" to="/settings" />
      </div>
    </div>
  );
};

export default MobileNavigation;
