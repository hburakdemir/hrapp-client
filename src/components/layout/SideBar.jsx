import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import { 
  X, ChevronDown, ChevronRight, Home, FileText, Users, Mail, 
  Briefcase, Settings, Calendar, BarChart3, UserCheck, Shield,
  Plus, FolderOpen, CheckSquare
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { colors, font } = useTheme();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const currentPath = location.pathname;
    
    if (['/my-forms', '/forms', '/new-form', '/applicants'].includes(currentPath)) {
      setOpenMenus(prev => ({ ...prev, applications: true }));
    }
    
    if (['/workflows', '/tasks', '/candidates', '/reports'].includes(currentPath)) {
      setOpenMenus(prev => ({ ...prev, recruitment: true }));
    }
    
    if (['/users', '/settings', '/permissions'].includes(currentPath)) {
      setOpenMenus(prev => ({ ...prev, system: true }));
    }
  }, [location.pathname]);

  const toggleMenu = (menuKey) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const menuItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/',
      type: 'single'
    },
    {
      key: 'applications',
      label: 'Başvuru Yönetimi',
      icon: FileText,
      type: 'group',
      badge: '4',
      children: [
        { label: 'Başvuru Formlarım', path: '/my-forms', icon: FolderOpen },
        { label: 'Başvuru Formları', path: '/forms', icon: FileText },
        { label: 'Yeni Form', path: '/yeni-sablon', icon: Plus },
        { label: 'Başvuranlar', path: '/applicants', icon: Users, badge: '12' }
      ]
    },
    {
      key: 'recruitment',
      label: 'İşe Alım Süreci',
      icon: Briefcase,
      type: 'group',
      badge: '3',
      children: [
        { label: 'Şablonlar', path: '/workflows', icon: Calendar },
        { label: 'Görevler', path: '/tasks', icon: CheckSquare, badge: '5' },
        { label: 'Adaylar', path: '/candidates', icon: UserCheck },
        { label: 'Raporlar', path: '/reports', icon: BarChart3 }
      ]
    },
    {
      key: 'system',
      label: 'Sistem Yönetimi',
      icon: Settings,
      type: 'group',
      children: [
        { label: 'Kullanıcılar', path: '/users', icon: Users },
        { label: 'Ayarlar', path: '/settings', icon: Settings },
        { label: 'Yetkiler', path: '/permissions', icon: Shield }
      ]
    },
    {
      key: 'contact',
      label: 'İletişim',
      icon: Mail,
      path: '/contact',
      type: 'single'
    }
  ];

  const isItemActive = (path) => {
    return location.pathname === path;
  };

  const isGroupActive = (children) => {
    return children.some(child => location.pathname === child.path);
  };

  const Badge = ({ count, color = colors.primary }) => {
    if (!count) return null;
    
    return (
      <span 
        className="px-2 py-1 text-xs font-medium rounded-full min-w-[20px] text-center"
        style={{ 
          backgroundColor: color + '20',
          color: color
        }}
      >
        {count}
      </span>
    );
  };

  const renderMenuItem = (item) => {
    if (item.type === 'single') {
      const isActive = isItemActive(item.path);
      const Icon = item.icon;
      const isHovered = hoveredItem === item.key;
      
      return (
        <Link
          key={item.key}
          to={item.path}
          onClick={onClose}
          onMouseEnter={() => setHoveredItem(item.key)}
          onMouseLeave={() => setHoveredItem(null)}
          className={`
            flex items-center justify-between px-4 py-3 rounded-lg 
            transition-all duration-200 transform
            ${isHovered ? 'scale-[1.02] shadow-sm' : ''}
          `}
          style={{
            backgroundColor: isActive 
              ? `${colors.primary}15` 
              : isHovered 
                ? `${colors.primary}08` 
                : 'transparent',
            color: isActive ? colors.primary : colors.text,
            borderLeft: isActive ? `3px solid ${colors.primary}` : '3px solid transparent'
          }}
        >
          <div className="flex items-center space-x-3">
            <Icon size={18} />
            <span className="font-medium text-sm lg:text-base">{item.label}</span>
          </div>
          <Badge count={item.badge} />
        </Link>
      );
    }

    if (item.type === 'group') {
      const isOpen = openMenus[item.key];
      const isActive = isGroupActive(item.children);
      const Icon = item.icon;
      const ChevronIcon = isOpen ? ChevronDown : ChevronRight;
      const isHovered = hoveredItem === item.key;

      return (
        <div key={item.key} className="space-y-1">
          <button
            onClick={() => toggleMenu(item.key)}
            onMouseEnter={() => setHoveredItem(item.key)}
            onMouseLeave={() => setHoveredItem(null)}
            className={`
              w-full flex items-center justify-between px-4 py-3 rounded-lg 
              transition-all duration-200 transform
              ${isHovered ? 'scale-[1.02] shadow-sm' : ''}
            `}
            style={{
              backgroundColor: isActive 
                ? `${colors.primary}10` 
                : isHovered 
                  ? `${colors.primary}08` 
                  : 'transparent',
              color: isActive ? colors.primary : colors.text,
              borderLeft: isActive ? `3px solid ${colors.text}` : '3px solid transparent'
            }}
          >
            <div className="flex items-center space-x-3">
              <Icon size={18} />
              <span className="font-medium text-sm lg:text-base">{item.label}</span>
              <Badge count={item.badge} />
            </div>
            <ChevronIcon 
              size={16} 
              className={`transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-0'}`}
            />
          </button>
          <div 
            className={`
              ml-4 pl-2 space-y-1 overflow-hidden transition-all duration-300 ease-in-out
              ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
            `}
            style={{ borderLeft: `2px solid ${colors.primary}` }}
          >
            {item.children.map((child, index) => {
              const isChildActive = isItemActive(child.path);
              const ChildIcon = child.icon;
              const childHovered = hoveredItem === `${item.key}-${index}`;
              
              return (
                <Link
                  key={index}
                  to={child.path}
                  onClick={onClose} 
                  onMouseEnter={() => setHoveredItem(`${item.key}-${index}`)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`
                    flex items-center justify-between px-4 py-2 rounded-lg 
                    transition-all duration-200 transform
                    ${childHovered ? 'translate-x-1 shadow-sm' : ''}
                  `}
                  style={{
                    backgroundColor: isChildActive 
                      ? `${colors.primary}20` 
                      : childHovered 
                        ? `${colors.primary}10` 
                        : 'transparent',
                    color: isChildActive ? colors.primary : colors.text,
                  }}
                >
                  <div className="flex items-center space-x-3">
                    {ChildIcon ? (
                      <ChildIcon size={16} />
                    ) : (
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ 
                          backgroundColor: isChildActive ? colors.primary : colors.text 
                        }}
                      />
                    )}
                    <span className="font-medium text-sm">{child.label}</span>
                  </div>
                  <Badge count={child.badge} />
                </Link>
              );
            })}
          </div>
        </div>
      );
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          fixed top-0 left-0 z-50
          w-64 h-full flex flex-col
          transform transition-all duration-300 ease-in-out
          shadow-xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          backgroundColor: colors.bg,
          fontFamily: `var(--font-family, ${font})`,
        }}
      >
        <div 
          className="h-16 flex items-center px-6 border-b relative"
          style={{ borderColor: colors.text }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold shadow-lg transform transition-transform hover:scale-110"
            style={{ 
              color:colors.text,
              backgroundImage: `linear-gradient(135deg, ${colors.bgsoft}, ${colors.primary}dd)`
            }}
          >
            L
          </div>
          <span className="ml-3 font-semibold text-lg" style={{ color: colors.text }}>
            LOGO
          </span>
          <button
            onClick={onClose}
            className="ml-auto p-2 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600"
            style={{ color: colors.text }}
            aria-label="Menüyü kapat"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
          {menuItems.map(renderMenuItem)}
        </nav>


        
      </aside>
    </>
  );
};

export default Sidebar;