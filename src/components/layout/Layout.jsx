import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useTheme } from "../../context/ThemeContext";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {darkMode} = useTheme();

  useEffect(() => {
    if(darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  },[darkMode]);

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      <Navbar onMenuClick={handleMenuClick} />
      <main className=" min-h-screen">
        <div className="h-full">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
