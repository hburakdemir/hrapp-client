import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={handleSidebarClose} 
      />
      
      <Navbar onMenuClick={handleMenuClick} />
      
      <main className="pt-16 min-h-screen lg:ml-64">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;