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
        primary: '#222831',
        bgsoft: '#fff',
        bg: '#CBCBCB',
        text: '#222831',
        text2:'#222831'
      },
      dark: {
        primary: '#948979',
        bgsoft: '#393E46',
        bg: '#222831',
        text: '#CBCBCB',
        text2: '#CBCBCB',
      },
    },
    theme2: {
      light: {
        primary: '#2F5755',
        bgsoft: '#5A9690',
        bg: '#F4F4F4',
        text: '#432323',
        text2: '#432323',
      },
      dark: {
        primary: '#F4EEE0',
        bgsoft: '#6D5D6E',
        bg: '#393646',
        text: '#F4F4F4',
        text2: '#F4F4F4',
      },
    },
    theme3: {
      light: {
        primary: '#B2A59B',
        bgsoft: '#A3485A',
        bg: '#FFFFFF',
        text: '#111827',
        text2: '#F4F4F4',
      },
      dark: {
        primary: '#F4EEE0',
        bgsoft: '#9B4444',
        bg: '#31363F',
        text: '#F4F4F4',
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