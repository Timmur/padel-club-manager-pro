import React, { useState } from 'react';
import { useAuth } from 'wasp/client/auth';
import { useQuery, useAction } from 'wasp/client/operations';
import { getUserClub, getCourts, deleteCourt } from 'wasp/client/operations';
import DashboardLayout from '../client/components/layout/DashboardLayout';
import { CourtCard } from './components/CourtCard';
import { CourtFormModal } from './components/CourtFormModal';
// Icons as simple SVG components
const PlusIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function CourtsPage() {
  const { data: user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  
  // Get user's club
  const { data: userClub, isLoading: isLoadingClub } = useQuery(getUserClub);
  
  // Get courts for the club
  const { data: courts, isLoading: isLoadingCourts, refetch: refetchCourts } = useQuery(
    getCourts, 
    userClub ? { clubId: userClub.id } : undefined
  );
  
  const deleteCourtFn = useAction(deleteCourt);

  const handleDeleteCourt = async (courtId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta pista? Esta acción no se puede deshacer.')) {
      try {
        await deleteCourtFn({ id: courtId });
        refetchCourts();
      } catch (error) {
        console.error('Error deleting court:', error);
        alert('Error al eliminar la pista. Por favor, intenta de nuevo.');
      }
    }
  };

  const handleEditCourt = (court: any) => {
    setEditingCourt(court);
    setShowCreateModal(true);
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setEditingCourt(null);
    refetchCourts();
  };

  if (isLoadingClub) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-gray-500">Cargando información del club...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!userClub) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <SettingsIcon />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Configuración pendiente
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Necesitas crear o configurar tu club antes de gestionar las pistas.
                      Por favor, contacta con el administrador del sistema.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Gestión de Pistas
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Administra las pistas de {userClub.name}
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon />
                <span className="ml-2">Nueva Pista</span>
              </button>
            </div>
          </div>

          {/* Courts Grid */}
          {isLoadingCourts ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Cargando pistas...</div>
            </div>
          ) : courts && courts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courts.map((court: any) => (
                <CourtCard
                  key={court.id}
                  court={court}
                  onEdit={() => handleEditCourt(court)}
                  onDelete={() => handleDeleteCourt(court.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <SettingsIcon />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No hay pistas configuradas
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Comienza agregando la primera pista de tu club
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon />
                <span className="ml-2">Crear Primera Pista</span>
              </button>
            </div>
          )}

          {/* Stats Summary */}
          {courts && courts.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <SettingsIcon />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          Total Pistas
                        </dt>
                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                          {courts.length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-3 w-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          Activas
                        </dt>
                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                          {courts.filter((c: any) => c.status === 'active').length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-3 w-3 bg-yellow-400 rounded-full"></div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          Mantenimiento
                        </dt>
                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                          {courts.filter((c: any) => c.status === 'maintenance').length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-3 w-3 bg-red-400 rounded-full"></div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          Inactivas
                        </dt>
                        <dd className="text-lg font-medium text-gray-900 dark:text-white">
                          {courts.filter((c: any) => c.status === 'inactive').length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <CourtFormModal
          court={editingCourt}
          clubId={userClub.id}
          onClose={handleModalClose}
        />
      )}
    </DashboardLayout>
  );
}