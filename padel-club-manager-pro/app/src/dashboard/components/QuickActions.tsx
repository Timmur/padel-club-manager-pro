import React from 'react';
import { 
  FaPlus, 
  FaCalendarPlus, 
  FaUsers, 
  FaClipboardList,
  FaEuroSign,
  FaCog
} from 'react-icons/fa';

const actions = [
  {
    title: 'Nueva Reserva',
    description: 'Reservar una pista',
    icon: FaCalendarPlus,
    href: '/reservas/nueva',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    title: 'Gestionar Partidos',
    description: 'Ver y editar partidos',
    icon: FaClipboardList,
    href: '/partidos',
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    title: 'Usuarios',
    description: 'Gestionar usuarios',
    icon: FaUsers,
    href: '/usuarios',
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    title: 'Facturación',
    description: 'Ver facturas y pagos',
    icon: FaEuroSign,
    href: '/facturacion',
    color: 'bg-orange-500 hover:bg-orange-600',
  },
  {
    title: 'Configuración',
    description: 'Ajustes del club',
    icon: FaCog,
    href: '/configuracion',
    color: 'bg-gray-500 hover:bg-gray-600',
  },
];

export function QuickActions() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Acciones Rápidas
      </h3>
      <div className="space-y-3">
        {actions.map((action) => (
          <button
            key={action.title}
            onClick={() => {
              // TODO: Implementar navegación
              console.log(`Navegando a ${action.href}`);
            }}
            className={`w-full flex items-center p-3 rounded-lg text-white transition-colors ${action.color}`}
          >
            <action.icon className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">{action.title}</div>
              <div className="text-sm opacity-80">{action.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
