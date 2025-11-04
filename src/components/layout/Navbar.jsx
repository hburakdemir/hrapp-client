import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useState } from 'react';

const Navbar = ({ onMenuClick }) => {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-30 h-16 flex items-center justify-between px-4 border-b shadow-sm"
      style={{ 
        backgroundColor: colors.bg,
        borderColor: colors.bgLight 
      }}
    >
      {/* Sol taraf - Hamburger menü */}
      <div className="flex items-center space-x-4">
        {/* Hamburger Button - Her zaman göster */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 active:scale-95"
          style={{ color: colors.text }}
          aria-label="Menüyü aç/kapat"
        >
          <Menu size={24} />
        </button>

        {/* Sayfa başlığı (opsiyonel) */}
        <h1 className="font-semibold text-lg hidden md:block" style={{ color: colors.text }}>
          HR Management System
        </h1>
      </div>

      {/* Sağ taraf - Kullanıcı menüsü */}
      <div className="flex items-center space-x-3">
        {/* Bildirimler */}
        <button
          className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 relative"
          style={{ color: colors.text }}
        >
          <Bell size={20} />
          {/* Bildirim badge'i */}
          <span 
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white"
            style={{ backgroundColor: colors.primary }}
          >
            3
          </span>
        </button>

        {/* Kullanıcı menüsü */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 hover:bg-gray-100"
            style={{ color: colors.text }}
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm text-white"
              style={{ backgroundColor: colors.primary }}
            >
              {user?.name && user?.surname
                ? `${user.name[0]}${user.surname[0]}`.toUpperCase()
                : 'U'}
            </div>
            
            {/* Kullanıcı adı (desktop'ta göster) */}
            <span className="hidden md:block font-medium text-sm">
              {user?.name} {user?.surname}
            </span>
          </button>

          {/* Dropdown menü */}
          {showUserMenu && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              
              {/* Menu */}
              <div 
                className="absolute right-0 mt-2 w-48 py-2 rounded-lg shadow-lg border z-20"
                style={{ 
                  backgroundColor: colors.bg,
                  borderColor: colors.bgLight 
                }}
              >
                <div className="px-4 py-2 border-b" style={{ borderColor: colors.bgLight }}>
                  <p className="font-medium text-sm" style={{ color: colors.text }}>
                    {user?.name} {user?.surname}
                  </p>
                  <p className="text-xs" style={{ color: colors.textSoft }}>
                    {user?.email}
                  </p>
                </div>
                
                <button
                  className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                  style={{ color: colors.text }}
                >
                  <User size={16} />
                  <span >Profil</span>
                </button>
                
                <button
                  onClick={logout}
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
  );
};

export default Navbar;