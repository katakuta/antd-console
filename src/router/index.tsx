import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import MainLayout from '@/layout/MainLayout';
import { RequireAuth } from './RequireAuth';
import { getLastPagePath } from '@/auth/core';

// Pages — Overview
import DashboardPage from '@/pages/overview/DashboardPage';
import MockDashboardPage from '@/pages/overview/MockDashboardPage';
import DesignTokenPage from '@/pages/overview/DesignTokenPage';

// Pages — Components
import TableDemoPage from '@/pages/components-demo/TableDemoPage';
import FormDemoPage from '@/pages/components-demo/FormDemoPage';
import ChartsDemoPage from '@/pages/components-demo/ChartsDemoPage';
import DataDisplayPage from '@/pages/components-demo/DataDisplayPage';

// Pages — Examples
import UserManagementPage from '@/pages/examples/UserManagementPage';
import ProductCatalogPage from '@/pages/examples/ProductCatalogPage';
import TaskBoardPage from '@/pages/examples/TaskBoardPage';
import ActivityLogPage from '@/pages/examples/ActivityLogPage';

// Public pages
import LoginPage from '@/pages/LoginPage';
import NotFound from '@/pages/NotFound';
import NotificationsPage from '@/pages/NotificationsPage';
import ProfilePage from '@/pages/ProfilePage';

function ProtectedRoute() {
  return (
    <RequireAuth>
      <MainLayout>
        <Outlet />
      </MainLayout>
    </RequireAuth>
  );
}

function DefaultRedirect() {
  return <Navigate to={getLastPagePath()} replace />;
}

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <DefaultRedirect /> },
      // Overview
      {
        path: 'overview',
        children: [
          { index: true, element: <Navigate to="/overview/dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'mock-dashboard', element: <MockDashboardPage /> },
          { path: 'design-tokens', element: <DesignTokenPage /> },
        ],
      },
      // Components
      {
        path: 'components',
        children: [
          { index: true, element: <Navigate to="/components/table-demo" replace /> },
          { path: 'table-demo', element: <TableDemoPage /> },
          { path: 'form-demo', element: <FormDemoPage /> },
          { path: 'charts-demo', element: <ChartsDemoPage /> },
          { path: 'data-display', element: <DataDisplayPage /> },
        ],
      },
      // Examples
      {
        path: 'examples',
        children: [
          { index: true, element: <Navigate to="/examples/users" replace /> },
          { path: 'users', element: <UserManagementPage /> },
          { path: 'products', element: <ProductCatalogPage /> },
          { path: 'tasks', element: <TaskBoardPage /> },
          { path: 'activity-log', element: <ActivityLogPage /> },
        ],
      },
      // System
      {
        path: 'system',
        children: [
          { index: true, element: <Navigate to="/system/notifications" replace /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
