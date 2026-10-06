import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Equipment from './pages/Equipment';
import EquipmentForm from './pages/EquipmentForm';
import Maintenance from './pages/Maintenance';
import MaintenanceForm from './pages/MaintenanceForm';
import Observations from './pages/Observations';
import ObservationForm from './pages/ObservationForm';
import Weather from './pages/Weather';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes - share the sidebar/header shell */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/equipment" element={<Equipment />} />
        <Route path="/equipment/add" element={<EquipmentForm />} />
        <Route path="/equipment/edit/:id" element={<EquipmentForm />} />

        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/maintenance/add" element={<MaintenanceForm />} />
        <Route path="/maintenance/edit/:id" element={<MaintenanceForm />} />

        <Route path="/observations" element={<Observations />} />
        <Route path="/observations/add" element={<ObservationForm />} />
        <Route path="/observations/edit/:id" element={<ObservationForm />} />

        <Route path="/weather" element={<Weather />} />
      </Route>

      {/* Redirects & fallback */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
