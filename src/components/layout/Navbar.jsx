import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Sun, Moon, Settings, Check, LogOut, Menu } from "lucide-react";
import Sidebar from "./Sidebar";

const Navbar = () => {
  const {
    colors,
    font,
    theme,
    setTheme,
    setFont,
    darkMode,
    setDarkMode,
    themes,
  } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useAuth();

  const fonts = [
    { id: "montserrat", name: "Montserrat" },
    { id: "segoe", name: "Segoe UI" },
    { id: "times", name: "Times New Roman" },
    { id: "poppins", name: "Poppins" },
  ];

  const themeOptions = [
    { id: "theme1", name: "Theme 1", colors: themes.theme1 },
    { id: "theme2", name: "Theme 2", colors: themes.theme2 },
    { id: "theme3", name: "Theme 3", colors: themes.theme3 },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Üst Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center justify-between px-4 md:px-6 border-b lg:left-64"
        style={{
          fontFamily: `var(--font-family, ${font})`,
          backgroundColor: colors.bg,
          borderColor: colors.text,
        }}
      >
        <div className="flex items-center space-x-4">
          {/* 🔹 Hamburger Menü (sadece mobilde) */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            aria-label="Menüyü aç"
          >
            <Menu size={20} style={{ color: colors.text }} />
          </button>

          {/* Başlık */}
          <h1
            className="text-lg md:text-xl lg:text-2xl font-semibold"
            style={{ color: colors.text }}
          >
            Dashboard
          </h1>
        </div>

        {/* Sağ Kısım: Tema, Ayarlar, Logout */}
        <div className="flex items-center space-x-2">
          {/* Tema Değiştir */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: colors.text }}
            title={darkMode ? "Light Mode" : "Dark Mode"}
          >
            {darkMode ? (
              <Sun size={18} style={{ color: colors.text }} />
            ) : (
              <Moon size={18} style={{ color: colors.text }} />
            )}
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="p-2 rounded-lg transition-colors"
              style={{
                color: colors.text,
              }}
              aria-expanded={isSettingsOpen}
              aria-label="Ayarlar"
            >
              <Settings size={18} style={{ color: colors.text }} />
            </button>

            {isSettingsOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg border overflow-hidden z-50"
                style={{
                  backgroundColor: colors.bg,
                  borderColor: colors.bgsoft,
                }}
              >
                <div className="p-4">
                  <p
                    className="text-xs font-medium mb-3"
                    style={{ color: colors.text }}
                  >
                    RENKLER
                  </p>
                  <div className="space-y-2">
                    {themeOptions.map((themeOption) => (
                      <button
                        key={themeOption.id}
                        onClick={() => setTheme(themeOption.id)}
                        className="w-full flex items-center justify-between p-2 rounded-lg transition-colors"
                        style={{
                          backgroundColor:
                            theme === themeOption.id
                              ? `${colors.primary}10`
                              : "transparent",
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{
                                backgroundColor:
                                  themeOption.colors[
                                    darkMode ? "dark" : "light"
                                  ].bgsoft,
                              }}
                            />
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{
                                backgroundColor:
                                  themeOption.colors[
                                    darkMode ? "dark" : "light"
                                  ].primary,
                              }}
                            />
                          </div>
                          <span
                            className="text-sm"
                            style={{ color: colors.text }}
                          >
                            {themeOption.name}
                          </span>
                        </div>
                        {theme === themeOption.id && (
                          <Check
                            size={16}
                            style={{ color: colors.primary }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t" style={{ borderColor: colors.bg }} />
                <div className="p-4">
                  <p
                    className="text-xs font-medium mb-3"
                    style={{ color: colors.text }}
                  >
                    FONTLAR
                  </p>
                  <div className="space-y-2">
                    {fonts.map((fontOption) => (
                      <button
                        key={fontOption.id}
                        onClick={() => setFont(fontOption.id)}
                        className="w-full flex items-center justify-between p-2 rounded-lg transition-colors"
                        style={{
                          backgroundColor:
                            font === fontOption.id
                              ? `${colors.primary}10`
                              : "transparent",
                        }}
                      >
                        <span
                          className="text-sm"
                          style={{ color: colors.text }}
                        >
                          {fontOption.name}
                        </span>
                        {font === fontOption.id && (
                          <Check
                            size={16}
                            style={{ color: colors.primary }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t" style={{ borderColor: colors.text }} />
                <div className="p-4">
                  <button
                    onClick={logout}
                    className="w-full text-left px-2 py-2 rounded-lg transition-colors hover:bg-red-50 flex items-center gap-2"
                    style={{ color: "#ef4444" }}
                  >
                    <LogOut size={16} style={{ color: "#ef4444" }} />
                    <span className="text-sm font-medium">Çıkış Yap</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

export default Navbar;
