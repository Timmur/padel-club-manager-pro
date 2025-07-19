import React from 'react';

// Simple SVG icons
const EditIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const MapIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EuroIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ActivityIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

interface CourtCardProps {
  court: {
    id: string;
    name: string;
    description?: string;
    type: string;
    surface: string;
    status: string;
    isAvailable: boolean;
    pricePerHour: number;
    operatingHours?: any;
    _count?: {
      bookings: number;
    };
  };
  onEdit: () => void;
  onDelete: () => void;
}

export function CourtCard({ court, onEdit, onDelete }: CourtCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <div className="h-1.5 w-1.5 bg-green-400 rounded-full mr-1"></div>
            Activa
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <div className="h-1.5 w-1.5 bg-yellow-400 rounded-full mr-1"></div>
            Mantenimiento
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <div className="h-1.5 w-1.5 bg-red-400 rounded-full mr-1"></div>
            Inactiva
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'indoor':
        return '🏢';
      case 'outdoor':
        return '🌞';
      case 'covered':
        return '🏠';
      default:
        return '🎾';
    }
  };

  const getSurfaceLabel = (surface: string) => {
    switch (surface) {
      case 'artificial_grass':
        return 'Césped Artificial';
      case 'concrete':
        return 'Hormigón';
      case 'ceramic':
        return 'Cerámica';
      default:
        return surface;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'indoor':
        return 'Interior';
      case 'outdoor':
        return 'Exterior';
      case 'covered':
        return 'Cubierta';
      default:
        return type;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-2xl mr-2">{getTypeIcon(court.type)}</span>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {court.name}
              </h3>
              {court.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {court.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
              title="Editar pista"
            >
              <EditIcon />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
              title="Eliminar pista"
            >
              <TrashIcon />
            </button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          {getStatusBadge(court.status)}
        </div>

        {/* Court Details */}
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapIcon />
            <span className="ml-2">{getTypeLabel(court.type)} - {getSurfaceLabel(court.surface)}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <EuroIcon />
            <span className="ml-2">{court.pricePerHour.toFixed(2)}€/hora</span>
          </div>

          {court._count && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <CalendarIcon />
              <span className="ml-2">{court._count.bookings} reservas</span>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <ActivityIcon />
            <span className="ml-2">
              {court.isAvailable ? 'Disponible para reservas' : 'No disponible'}
            </span>
          </div>
        </div>

        {/* Operating Hours Preview */}
        {court.operatingHours && Object.keys(court.operatingHours).length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Horarios configurados
            </p>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              {Object.entries(court.operatingHours).slice(0, 2).map(([day, hours]: [string, any]) => (
                <div key={day} className="flex justify-between">
                  <span className="capitalize">{day}:</span>
                  <span>
                    {hours.closed ? 'Cerrado' : `${hours.open} - ${hours.close}`}
                  </span>
                </div>
              ))}
              {Object.keys(court.operatingHours).length > 2 && (
                <div className="text-gray-400 mt-1">
                  +{Object.keys(court.operatingHours).length - 2} días más...
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            ID: {court.id.substring(0, 8)}...
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors duration-200"
            >
              Configurar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}