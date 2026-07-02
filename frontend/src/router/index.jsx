import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../components/layout/ProtectedRoute'

import Home from '../pages/Home/index.jsx'
import Search from '../pages/Search/index.jsx'
import TechnicianProfile from '../pages/TechnicianProfile/index.jsx'
import ServiceRequest from '../pages/ServiceRequest/index.jsx'
import RequestStatus from '../pages/RequestStatus/index.jsx'
import ClientDashboard from '../pages/ClientDashboard/index.jsx'
import TechnicianDashboard from '../pages/TechnicianDashboard/index.jsx'
import Login from '../pages/Auth/Login.jsx'
import Register from '../pages/Auth/Register.jsx'
import NotFound from '../pages/NotFound.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Publico */}
      <Route path="/" element={<Home />} />
      <Route path="/buscar" element={<Search />} />
      <Route path="/tecnico/:id" element={<TechnicianProfile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Requiere auth */}
      <Route path="/solicitar/:technicianId" element={
        <ProtectedRoute><ServiceRequest /></ProtectedRoute>
      } />
      <Route path="/solicitud/:id" element={
        <ProtectedRoute><RequestStatus /></ProtectedRoute>
      } />

      {/* Requiere rol */}
      <Route path="/cliente/panel" element={
        <ProtectedRoute rol="CLIENTE"><ClientDashboard /></ProtectedRoute>
      } />
      <Route path="/tecnico/panel" element={
        <ProtectedRoute rol="TECNICO"><TechnicianDashboard /></ProtectedRoute>
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
