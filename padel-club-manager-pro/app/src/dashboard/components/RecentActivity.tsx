import React from 'react';
import { FaClock, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'booking' | 'payment' | 'user' | 'system';
  status: 'completed' | 'pending' | 'warning' | 'info';
}

// Datos de ejemplo
const activities: Activity[] = [
  {
    id: '1',
    title: 'Nueva reserva',
    description: 'Juan Pérez reservó la Pista 2 para mañana a las 10:00',
    time: 'Hace 5 minutos',
    type: 'booking',
    status: 'completed',
  },
  {
    id: '2',
    title: 'Pago procesado',
    description: 'Se procesó el pago de €25 por la reserva #123',
    time: 'Hace 15 minutos',
    type: 'payment',
    status: 'completed',
  },
  {
    id: '3',
    title: 'Usuario registrado',
    description: 'María García se registró en el sistema',
    time: 'Hace 1 hora',
    type: 'user',
    status: 'info',
  },
  {
    id: '4',
    title: 'Reserva pendiente',
    description: 'Reserva #124 necesita confirmación de pago',
    time: 'Hace 2 horas',
    type: 'booking',
    status: 'warning',
  },
  {
    id: '5',
    title: 'Cancelación',
    description: 'Se canceló la reserva #122 de la Pista 1',
    time: 'Hace 3 horas',
    type: 'booking',
    status: 'pending',
  },
];

const getStatusIcon = (status: Activity['status']) => {
  switch (status) {
    case 'completed':
      return <FaCheckCircle className="w-4 h-4 text-green-500" />;
    case 'pending':
      return <FaClock className="w-4 h-4 text-yellow-500" />;
    case 'warning':
      return <FaExclamationTriangle className="w-4 h-4 text-orange-500" />;
    case 'info':
      return <FaInfoCircle className="w-4 h-4 text-blue-500" />;
    default:
      return null;
  }
};

const getStatusColor = (status: Activity['status']) => {
  switch (status) {
    case 'completed':
      return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
    case 'pending':
      return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
    case 'warning':
      return 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20';
    case 'info':
      return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
    default:
      return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800';
  }
};

export function RecentActivity() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Actividad Reciente
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          Ver todo
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`p-4 rounded-lg border-l-4 ${getStatusColor(activity.status)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(activity.status)}
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {activity.description}
                </p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                {activity.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
