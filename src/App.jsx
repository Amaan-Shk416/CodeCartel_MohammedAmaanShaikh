import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ContentLayout from './components/layout/ContentLayout';
import LandingPage from './pages/LandingPage';
import FindProfessionals from './pages/FindProfessionals';
import WorkerProfile from './pages/WorkerProfile';
import PostJob from './pages/PostJob';
import CompareOffers from './pages/CompareOffers';
import BookingDetails from './pages/BookingDetails';
import MyBookings from './pages/MyBookings';
import WorkerDashboard from './pages/WorkerDashboard';
import Messages from './pages/Messages';
import NotFound from './pages/NotFound';
import DemoModeToggle from './components/common/DemoModeToggle';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Universal Navbar Layout mounted across every application page */}
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/professionals" element={<FindProfessionals />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/compare-offers" element={<CompareOffers />} />
          <Route path="/bookings/:id" element={<BookingDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/worker-dashboard" element={<WorkerDashboard />} />
          <Route path="/messages" element={<Messages />} />

          {/* Framed content pages wrapped with max-width container and shared Footer */}
          <Route element={<ContentLayout />}>
            <Route path="/professionals/:id" element={<WorkerProfile />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
      <DemoModeToggle />
    </BrowserRouter>
  );
}
