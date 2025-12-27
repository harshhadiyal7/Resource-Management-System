import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminDash from '../dashboards/AdminDash';
import StudentDash from '../dashboards/StudentDash';
import CanteenDash from '../dashboards/CanteenDash';
import HostelDash from '../dashboards/HostelDash';
import StationeryDash from '../dashboards/StationeryDash';

const DashboardWrapper = () => {
  const role = localStorage.getItem('role');

  if (!role) return <Navigate to="/login" />;

  const dashboards = {
    admin: <AdminDash />,
    student: <StudentDash />,
    canteen: <CanteenDash />,
    hostel: <HostelDash />,
    stationery: <StationeryDash />
  };

  return dashboards[role] || <Navigate to="/login" />;
};

export default DashboardWrapper;