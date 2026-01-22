"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const ThemeContext = createContext({});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Apply theme from local storage immediately to avoid flash
    const savedTheme = localStorage.getItem('theme_settings');
    if (savedTheme) {
      applyTheme(JSON.parse(savedTheme));
    }
    
    // Then fetch fresh from Supabase
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    try {
      const { data } = await supabase
        .from('app_settings')
        .select('*')
        .like('key', 'theme_%');

      if (data && data.length > 0) {
        const theme: Record<string, string> = {};
        data.forEach(item => {
          const key = item.key.replace('theme_', '');
          theme[key] = item.value;
        });
        
        localStorage.setItem('theme_settings', JSON.stringify(theme));
        applyTheme(theme);
      }
    } catch (error) {
      console.error("Error fetching theme:", error);
    }
  };

  const applyTheme = (theme: Record<string, string>) => {
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      // Convert key to css var if needed, assuming keys map to --key
      // e.g. background -> --background
      // cardForeground -> --card-foreground
      const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>;
}
