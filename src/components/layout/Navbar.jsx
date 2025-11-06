import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Menu, User, LogOut, Sun, Moon, Palette, Type, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const Navbar = ({ onMenuClick }) => {
  const {
    colors,
    setTheme,
    darkMode,
    setDarkMode,
    font,
    setFont,
    themes,
  } = useTheme();

  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showThemePanel, setShowThemePanel] = useState(false);

  const fonts = {
    montserrat: "Montserrat, sans-serif",
    segoe: "Segoe UI, sans-serif",
    times: "Times New Roman, serif",
    poppins: "Poppins, sans-serif",
  };

  const themePanelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        themePanelRef.current &&
        !themePanelRef.current.contains(event.target)
      ) {
        setShowThemePanel(false);
      }
    };

    if (showThemePanel) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showThemePanel]);

  const handleFontChange = (newFont) => {
    setFont(newFont);
    document.documentElement.style.setProperty("--font-family", fonts[newFont]);
    localStorage.setItem("font", newFont);
  };

  return (
    <>
      <header
        className="relative h-14 flex items-center justify-between px-4 "
        style={{
          backgroundColor: colors.bg,
          fontFamily: fonts[font],
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
            style={{ color: colors.text }}
          >
            <Menu size={20} />
          </button>

          <h1
            className="font-semibold text-lg hidden md:block"
            style={{ color: colors.text }}
          >
            HR Management System
          </h1>
        </div>

        {/*sağ */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setShowThemePanel(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
            style={{ color: colors.text }}
            title="Tema Ayarları"
          >
            <Palette size={20} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
              style={{ color: colors.text }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm text-white"
                style={{ backgroundColor: colors.primary }}
              >
                {user?.name && user?.surname ? (
                  `${user.name[0]}${user.surname[0]}`.toUpperCase()
                ) : (
                  <User size={16} />
                )}
              </div>
              <span className="hidden md:block font-medium text-sm">
                {user?.name} {user?.surname}
              </span>
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div
                  className="absolute right-0 mt-2 w-48 py-2 rounded-lg shadow-lg border z-20"
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: colors.bgsoft,
                  }}
                >
                  <div
                    className="px-4 py-2 border-b"
                    style={{ borderColor: colors.bgsoft }}
                  >
                    <p
                      className="font-medium text-sm"
                      style={{ color: colors.text }}
                    >
                      {user?.name} {user?.surname}
                    </p>
                    <p className="text-xs" style={{ color: colors.text }}>
                      {user?.email}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
      {showThemePanel && (
        <div
          ref={themePanelRef}
          className="absolute top-14 right-16 w-64 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 z-40"
          style={{
            backgroundColor:colors.bg,
            borderColor: colors.bgsoft,
            fontFamily: fonts[font],
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3
              className="font-semibold text-base flex items-center gap-2"
              style={{ color: colors.text }}
            >
              <Palette size={18} /> Tema
            </h3>
            <button
              onClick={() => setShowThemePanel(false)}
              style={{ color: colors.text }}
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium" style={{ color: colors.text }}>
              Karanlık Mod
            </p>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              style={{ color: colors.text }}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <div className="mb-4">
            <p
              className="text-sm mb-2 font-medium"
              style={{ color: colors.text }}
            >
              Renkler
            </p>
            <div className="flex flex-col gap-2">
              {Object.keys(themes).map((key) => (
  <button
    key={key}
    onClick={() => setTheme(key)} 
    className="flex items-center justify-between p-2 rounded-lg border transition-all hover:scale-[1.02] active:scale-95"
    style={{ borderColor: colors.bgsoft }}
  >
    <div className="flex gap-2">
      <span
        className="w-5 h-5 rounded-full"
        style={{
          backgroundColor: themes[key].light.bgsoft, 
        }}
      />
      <span
        className="w-5 h-5 rounded-full"
        style={{
          backgroundColor: themes[key].light.primary, 
        }}
      />
      <span
        className="w-5 h-5 rounded-full"
        style={{
          backgroundColor: themes[key].dark.bgsoft, 
        }}
      />
      <span
        className="w-5 h-5 rounded-full"
        style={{
          backgroundColor: themes[key].dark.primary, 
        }}
      />
    </div>
  </button>
))}

            </div>
          </div>

          <div>
            <p
              className="text-sm mb-2 font-medium flex items-center gap-1"
              style={{ color: colors.text }}
            >
              <Type size={16} /> Yazı Tipi
            </p>
            <select
              value={font}
              onChange={(e) => handleFontChange(e.target.value)}
              className="w-full p-2 rounded-lg  outline-none  transition-all"
              style={{
                backgroundColor: colors.bgsoft,
                color: colors.text,
                borderColor: colors.primary,
                fontFamily: fonts[font],
              }}
            >
              {Object.keys(fonts).map((key) => (
                <option key={key} value={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
