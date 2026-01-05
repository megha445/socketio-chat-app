import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("theme") ||"light",

  setTheme: (themeName) => {
    document.documentElement.setAttribute("data-theme", themeName);
    localStorage.setItem("theme", themeName);

    set({ theme: themeName });
  },
}));
