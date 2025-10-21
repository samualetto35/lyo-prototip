import React from 'react';

const StatusIndicator = ({ status, size = 'medium', showText = true, pulse = false }) => {
  const statusConfig = {
    online: {
      color: 'bg-green-500',
      text: 'Çevrimiçi',
      textColor: 'text-green-700',
      bgColor: 'bg-green-100'
    },
    offline: {
      color: 'bg-gray-400',
      text: 'Çevrimdışı',
      textColor: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    active: {
      color: 'bg-blue-500',
      text: 'Aktif',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-100'
    },
    inactive: {
      color: 'bg-orange-400',
      text: 'Pasif',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    warning: {
      color: 'bg-yellow-500',
      text: 'Uyarı',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-100'
    },
    error: {
      color: 'bg-red-500',
      text: 'Hata',
      textColor: 'text-red-700',
      bgColor: 'bg-red-100'
    }
  };

  const sizeConfig = {
    small: 'w-2 h-2',
    medium: 'w-3 h-3',
    large: 'w-4 h-4'
  };

  const config = statusConfig[status] || statusConfig.offline;

  return (
    <div className="flex items-center space-x-2">
      <div className={`${sizeConfig[size]} ${config.color} rounded-full ${pulse ? 'animate-pulse' : ''}`}></div>
      {showText && (
        <span className={`text-xs font-medium ${config.textColor}`}>
          {config.text}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;

