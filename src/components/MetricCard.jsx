import React from 'react';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  color = 'primary',
  size = 'medium',
  loading = false,
  onClick
}) => {
  const colorConfig = {
    primary: {
      bg: 'bg-primary-50',
      text: 'text-primary-600',
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
      border: 'border-primary-200'
    },
    secondary: {
      bg: 'bg-secondary-50',
      text: 'text-secondary-600',
      iconBg: 'bg-secondary-100',
      iconColor: 'text-secondary-600',
      border: 'border-secondary-200'
    },
    success: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      border: 'border-green-200'
    },
    warning: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      border: 'border-yellow-200'
    },
    danger: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      border: 'border-red-200'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      border: 'border-purple-200'
    }
  };

  const sizeConfig = {
    small: 'p-2 sm:p-3',
    medium: 'p-3 sm:p-4',
    large: 'p-4 sm:p-6'
  };

  const config = colorConfig[color] || colorConfig.primary;

  const changeConfig = {
    positive: {
      text: 'text-green-600',
      icon: '↗',
      bg: 'bg-green-100'
    },
    negative: {
      text: 'text-red-600',
      icon: '↘',
      bg: 'bg-red-100'
    },
    neutral: {
      text: 'text-gray-600',
      icon: '→',
      bg: 'bg-gray-100'
    }
  };

  const changeStyle = changeConfig[changeType] || changeConfig.neutral;

  return (
    <div 
      className={`
        ${sizeConfig[size]} 
        ${config.bg} 
        rounded-xl 
        border 
        ${config.border}
        hover:shadow-md 
        transition-all 
        duration-300 
        cursor-pointer
        ${onClick ? 'hover:scale-105' : ''}
        ${loading ? 'animate-pulse' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline space-x-1 sm:space-x-2">
            <p className={`text-lg sm:text-2xl font-bold ${config.text}`}>
              {loading ? '...' : value}
            </p>
            {change && (
              <span className={`text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full ${changeStyle.bg} ${changeStyle.text}`}>
                {changeStyle.icon} {change}
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className={`w-8 h-8 sm:w-12 sm:h-12 ${config.iconBg} rounded-lg flex items-center justify-center`}>
            <div className={`w-4 h-4 sm:w-6 sm:h-6 ${config.iconColor}`}>
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;

