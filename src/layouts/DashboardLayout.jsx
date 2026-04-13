import React from 'react';
import Navbar from '../components/Navbar';

const DashboardLayout = ({ children }) => (
  <div className="app-root">
    <Navbar />
    <main className="main-content page-enter">
      {children}
    </main>
  </div>
);

export default DashboardLayout;
