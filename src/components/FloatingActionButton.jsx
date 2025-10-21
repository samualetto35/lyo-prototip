import React, { useState } from 'react';

const FloatingActionButton = ({ 
  icon, 
  onClick, 
  position = 'bottom-right',
  size = 'medium',
  color = 'primary',
  tooltip = '',
  badge = null
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const positionConfig = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const sizeConfig = {
    small: 'w-12 h-12',
    medium: 'w-14 h-14',
    large: 'w-16 h-16'
  };

  const colorConfig = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    purple: 'bg-purple-600 hover:bg-purple-700 text-white'
  };

  return (
    <div className={`fixed ${positionConfig[position]} z-40`}>
      {/* Tooltip */}
      {tooltip && showTooltip && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap">
          {tooltip}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}

      {/* FAB */}
      <button
        className={`
          ${sizeConfig[size]} 
          ${colorConfig[color]} 
          rounded-full 
          shadow-lg 
          hover:shadow-xl 
          transition-all 
          duration-300 
          flex 
          items-center 
          justify-center 
          group
          relative
        `}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="transform group-hover:scale-110 transition-transform duration-200">
          {icon}
        </div>

        {/* Badge */}
        {badge && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {badge}
          </div>
        )}
      </button>
    </div>
  );
};

export default FloatingActionButton;

