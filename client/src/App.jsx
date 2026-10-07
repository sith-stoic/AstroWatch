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

const rolePage = (roles, page) => (
  <ProtectedRoute allowedRoles={roles}>{page}</ProtectedRoute>
);

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/equipment" element={<Equipment />} />
        <Route path="/equipment/add" element={rolePage(['Admin'], <EquipmentForm />)} />
        <Route path="/equipment/edit/:id" element={rolePage(['Admin'], <EquipmentForm />)} />

        <Route path="/maintenance" element={rolePage(['Admin', 'Technician'], <Maintenance />)} />
        <Route path="/maintenance/add" element={rolePage(['Admin'], <MaintenanceForm />)} />
        <Route path="/maintenance/edit/:id" element={rolePage(['Admin', 'Technician'], <MaintenanceForm />)} />

        <Route path="/observations" element={rolePage(['Admin', 'Observer'], <Observations />)} />
        <Route path="/observations/add" element={rolePage(['Admin'], <ObservationForm />)} />
        <Route path="/observations/edit/:id" element={rolePage(['Admin', 'Observer'], <ObservationForm />)} />

        <Route path="/weather" element={<Weather />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
