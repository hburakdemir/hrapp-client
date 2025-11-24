import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'theme1';
  });

  const [font, setFont] = useState(() => {
    return localStorage.getItem('font') || 'montserrat';
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('font', font);
    document.documentElement.style.setProperty('--font-family', getFontFamily(font));
  }, [font]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const getFontFamily = (fontName) => {
    const fonts = {
      montserrat: 'Montserrat, sans-serif',
      segoe: 'Segoe UI, sans-serif',
      times: 'Times New Roman, serif',
      poppins: 'Poppins, sans-serif',
    };
    return fonts[fontName] || fonts.montserrat;
  };

  const themes = {
    theme1: {
      light: {
        primary: '#2F5755',
        bgsoft: '#EDFFF0',
        bg: '#E0D9D9',
        text: '#432323',
        text2:'#222831'
      },
      dark: {
        primary: '#948979',
        bgsoft: '#393E46',
        bg: '#222831',
        text: '#CBCBCB',
        text2: '#DFD0B8',
      },
    },
    theme2: {
      light: {
        primary: '#0C2B4E',
        bgsoft: '#EFE9E3',
        bg: '#F4F4F4',
        text: '#1A3D64',
        text2: '#432323',
      },
      dark: {
        primary: '#F4EEE0',
        bgsoft: '#44444E',
        bg: '#37353E',
        text: '#F4F4F4',
        text2: '#F4F4F4',
      },
    },
    theme3: {
      light: {
        primary: '#154D71',
        bgsoft: '#FFF2EB',
        bg: '#E9E3DF',
        text: '#212121',
        text2: '#F4F4F4',
      },
      dark: {
        primary: '#5C3E94',
        bgsoft: '#303030',
        bg: '#212121',
        text: '#CBCBCB',
        text2: '#F4F4F4',
      },
    },
  };

  const currentColors = themes[theme][darkMode ? 'dark' : 'light'];

  const value = {
    theme,
    setTheme,
    font,
    setFont,
    darkMode,
    setDarkMode,
    colors: currentColors,
    themes,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};