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
      {/* Sidebar - Her zaman hamburger ile kontrol edilir */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={handleSidebarClose} 
      />
      
      {/* Navbar */}
      <Navbar onMenuClick={handleMenuClick} />
      
      {/* Main Content - Sidebar her zaman overlay olduğu için margin yok */}
      <main className="pt-16 min-h-screen">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;