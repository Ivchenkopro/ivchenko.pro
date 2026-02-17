"use client";

import { createContext, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const ThemeContext = createContext({});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const applyTheme = (theme: Record<string, string>) => {
      const root = document.documentElement;
      Object.entries(theme).forEach(([key, value]) => {
        const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
        root.style.setProperty(cssVar, value);
      });
    };

    const savedTheme = localStorage.getItem("theme_settings");
    if (savedTheme) {
      applyTheme(JSON.parse(savedTheme));
    }

    const fetchTheme = async () => {
      try {
        const { data } = await supabase
          .from("app_settings")
          .select("*")
          .like("key", "theme_%");

        if (data && data.length > 0) {
          const theme: Record<string, string> = {};
          data.forEach((item) => {
            const key = item.key.replace("theme_", "");
            theme[key] = item.value;
          });

          localStorage.setItem("theme_settings", JSON.stringify(theme));
          applyTheme(theme);
        }
      } catch (error) {
        console.error("Error fetching theme:", error);
      }
    };

    fetchTheme();
  }, []);

  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>;
}
