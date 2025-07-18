import React from 'react';
import { useAuth } from 'wasp/client/auth';
import { Link } from 'wasp/client/router';
import DashboardLayout from '../client/components/layout/DashboardLayout';
import { DashboardStats } from './components/DashboardStats';
import { RecentActivity } from './components/RecentActivity';
import { QuickActions } from './components/QuickActions';

export default function DashboardPage() {
  const { data: user } = useAuth();

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              ¡Bienvenido, {user?.email}!
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Aquí tienes un resumen de la actividad de tu club de pádel
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-8">
            <DashboardStats />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <QuickActions />
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <RecentActivity />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
