import { useTheme } from '../../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { colors, font } = useTheme();
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Başvuru Formlarım', path: '/my-forms' },
    { label: 'Başvuru Formları', path: '/forms' },
    { label: 'Başvuranlar', path: '/applicants' },
    { label: 'Kullanıcılar', path: '/users' },
    { label: 'Yeni Form', path: '/new-form' },
    { label: 'İletişim', path: '/contact' },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          fixed top-0 left-0 z-50
          w-64 h-full flex flex-col
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          backgroundColor: colors.bg,
          fontFamily: `var(--font-family, ${font})`,
        }}
      >
        <div className="h-16 flex items-center px-6">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white"
            style={{ backgroundColor: colors.primary }}
          >
            L
          </div>
          <span className="ml-3 font-semibold text-lg" style={{ color: colors.text }}>
            LOGO
          </span>

          <button
            onClick={onClose}
            className="ml-auto lg:hidden p-2 rounded-lg"
            style={{ color: colors.text }}
            aria-label="Menüyü kapat"
          >
            <X size={22} style={{ color: colors.text }} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all"
                style={{
                  backgroundColor: isActive ? `${colors.primary}15` : 'transparent',
                  color: isActive ? colors.primary : colors.text,
                }}
              >
                <span className="font-medium text-sm lg:text-base">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t" style={{ borderColor: colors.bgLight }}>
          <div className="flex items-center space-x-3 px-4 py-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm"
              style={{ backgroundColor: colors.primary, color: colors.text }}
            >
              {user?.name && user?.surname
                ? `${user.name[0]}${user.surname[0]}`.toUpperCase()
                : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate" style={{ color: colors.primary }}>
                {user?.name} {user?.surname}
              </p>
              <p className="text-xs truncate" style={{ color: colors.text }}>
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
