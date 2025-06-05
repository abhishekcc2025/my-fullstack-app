
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-primary shadow-md">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold text-white">
            Simple CRM
          </div>
          {/* Placeholder for future nav items if needed */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
    