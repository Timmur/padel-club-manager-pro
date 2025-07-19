import React, { useState, useEffect } from 'react';
import { useAction } from 'wasp/client/operations';
import { createCourt, updateCourt } from 'wasp/client/operations';

// Simple SVG icons
const XIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SaveIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

const AlertIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

interface CourtFormModalProps {
  court?: any;
  clubId: string;
  onClose: () => void;
}

export function CourtFormModal({ court, clubId, onClose }: CourtFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'outdoor',
    surface: 'artificial_grass',
    status: 'active',
    isAvailable: true,
    pricePerHour: 25.0,
    operatingHours: {
      monday: { open: '09:00', close: '22:00', closed: false },
      tuesday: { open: '09:00', close: '22:00', closed: false },
      wednesday: { open: '09:00', close: '22:00', closed: false },
      thursday: { open: '09:00', close: '22:00', closed: false },
      friday: { open: '09:00', close: '22:00', closed: false },
      saturday: { open: '09:00', close: '22:00', closed: false },
      sunday: { open: '09:00', close: '22:00', closed: false },
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createCourtFn = useAction(createCourt);
  const updateCourtFn = useAction(updateCourt);

  // Load court data if editing
  useEffect(() => {
    if (court) {
      setFormData({
        name: court.name || '',
        description: court.description || '',
        type: court.type || 'outdoor',
        surface: court.surface || 'artificial_grass',
        status: court.status || 'active',
        isAvailable: court.isAvailable ?? true,
        pricePerHour: court.pricePerHour || 25.0,
        operatingHours: court.operatingHours || {
          monday: { open: '09:00', close: '22:00', closed: false },
          tuesday: { open: '09:00', close: '22:00', closed: false },
          wednesday: { open: '09:00', close: '22:00', closed: false },
          thursday: { open: '09:00', close: '22:00', closed: false },
          friday: { open: '09:00', close: '22:00', closed: false },
          saturday: { open: '09:00', close: '22:00', closed: false },
          sunday: { open: '09:00', close: '22:00', closed: false },
        }
      });
    }
  }, [court]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la pista es obligatorio';
    }

    if (formData.pricePerHour < 0) {
      newErrors.pricePerHour = 'El precio debe ser mayor o igual a 0';
    }

    if (formData.pricePerHour > 1000) {
      newErrors.pricePerHour = 'El precio parece demasiado alto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const courtData = {
        ...formData,
        clubId,
        type: formData.type as 'indoor' | 'outdoor' | 'covered',
        surface: formData.surface as 'artificial_grass' | 'concrete' | 'ceramic',
        status: formData.status as 'active' | 'maintenance' | 'inactive'
      };

      if (court) {
        // Update existing court
        await updateCourtFn({
          id: court.id,
          ...courtData
        });
      } else {
        // Create new court
        await createCourtFn(courtData);
      }

      onClose();
    } catch (error: any) {
      console.error('Error saving court:', error);
      setErrors({
        submit: error.message || 'Error al guardar la pista. Por favor, intenta de nuevo.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleOperatingHoursChange = (day: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...(prev.operatingHours as any)[day],
          [field]: value
        }
      }
    }));
  };

  const dayLabels = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        {/* Header */}
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {court ? 'Editar Pista' : 'Nueva Pista'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <XIcon />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Alert */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertIcon />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{errors.submit}</div>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre de la pista *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="ej. Pista 1, Cancha Central"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Precio por hora (€) *
              </label>
              <input
                type="number"
                step="0.50"
                min="0"
                max="1000"
                value={formData.pricePerHour}
                onChange={(e) => handleInputChange('pricePerHour', parseFloat(e.target.value) || 0)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {errors.pricePerHour && (
                <p className="mt-1 text-sm text-red-600">{errors.pricePerHour}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Descripción opcional de la pista"
            />
          </div>

          {/* Type and Surface */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tipo
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="outdoor">Exterior</option>
                <option value="indoor">Interior</option>
                <option value="covered">Cubierta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Superficie
              </label>
              <select
                value={formData.surface}
                onChange={(e) => handleInputChange('surface', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="artificial_grass">Césped Artificial</option>
                <option value="concrete">Hormigón</option>
                <option value="ceramic">Cerámica</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Estado
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="active">Activa</option>
                <option value="maintenance">Mantenimiento</option>
                <option value="inactive">Inactiva</option>
              </select>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isAvailable}
              onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Disponible para reservas
            </label>
          </div>

          {/* Operating Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Horarios de operación
            </label>
            <div className="space-y-2">
              {Object.entries(dayLabels).map(([day, label]) => (
                <div key={day} className="flex items-center space-x-4">
                  <div className="w-20">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={!(formData.operatingHours as any)[day]?.closed}
                      onChange={(e) => handleOperatingHoursChange(day, 'closed', !e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Abierto</span>
                  </div>
                  {!(formData.operatingHours as any)[day]?.closed && (
                    <>
                      <input
                        type="time"
                        value={(formData.operatingHours as any)[day]?.open || '09:00'}
                        onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)}
                        className="block border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="time"
                        value={(formData.operatingHours as any)[day]?.close || '22:00'}
                        onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)}
                        className="block border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <SaveIcon />
                  <span className="ml-2">{court ? 'Actualizar' : 'Crear'} Pista</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}