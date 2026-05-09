import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DuoToneIconProps {
  icon: LucideIcon;
  color: string;
  size?: number;
  className?: string;
}

export const DuoToneIcon: React.FC<DuoToneIconProps> = ({ icon: Icon, color, size = 24, className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <Icon 
        size={size} 
        className="absolute opacity-20 blur-[2px]" 
        style={{ color }} 
      />
      <Icon 
        size={size} 
        style={{ color }} 
        className="relative" 
      />
    </div>
  );
};
