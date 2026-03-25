import { Link, useLocation } from "react-router-dom";
import { Shield, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl transition-colors duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            CERTITRUST
          </span>
          <span className="forensic-badge ml-1">v4.0</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            System Home
          </Link>

          <Link
            to="/dashboard"
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </Link>
          
          <Link
            to="/upload"
            className="px-4 py-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest rounded-md hover:brightness-110 active:scale-[0.97] transition-all"
          >
            Begin Analysis
          </Link>

          {/* Horizontal Theme Toggle */}
          <div className="flex items-center pl-2 ml-auto">
            <div 
              onClick={toggleTheme}
              className="relative w-12 h-6 bg-muted/40 rounded-full border border-border cursor-pointer p-1 group transition-all hover:border-primary/50"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <div 
                className={`w-4 h-4 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)] flex items-center justify-center transition-all duration-300 ease-in-out transform ${theme === 'dark' ? 'translate-x-0' : 'translate-x-6'}`}
              >
                {theme === 'dark' ? (
                  <Moon className="w-2.5 h-2.5 text-primary-foreground fill-primary-foreground" />
                ) : (
                  <Sun className="w-2.5 h-2.5 text-primary-foreground fill-primary-foreground" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
