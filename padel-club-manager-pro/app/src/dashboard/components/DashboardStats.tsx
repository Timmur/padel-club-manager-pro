import React from 'react';
import { 
  FaTrophy, 
  FaCalendarDays, 
  FaEuroSign, 
  FaUsers 
} from 'react-icons/fa6';

interface StatCard {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: {
    value: string;
    isPositive: boolean;
  };
}

const stats: StatCard[] = [
  {
    title: 'Partidos Hoy',
    value: '24',
    icon: FaTrophy,
    trend: {
      value: '+12%',
      isPositive: true,
    },
  },
  {
    title: 'Reservas Semana',
    value: '156',
    icon: FaCalendarDays,
    trend: {
      value: '+5%',
      isPositive: true,
    },
  },
  {
    title: 'Ingresos Mes',
    value: '€3,240',
    icon: FaEuroSign,
    trend: {
      value: '+8%',
      isPositive: true,
    },
  },
  {
    title: 'Usuarios Activos',
    value: '89',
    icon: FaUsers,
    trend: {
      value: '+3%',
      isPositive: true,
    },
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {stat.value}
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span
              className={`text-sm font-medium ${
                stat.trend.isPositive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {stat.trend.value}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              vs. mes anterior
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
