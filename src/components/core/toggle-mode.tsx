import { useEffect, useState } from "react";

export default function ToggleMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      localStorage.theme === "dark" ||
      (!localStorage.theme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      root.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="px-4 py-2 rounded-lg mt-2 bg-gray-300 dark:bg-[#930938]/30 text-gray-800 dark:text-gray-200 transition"
      aria-label="Toggle dark mode"
    >
      {isDark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
