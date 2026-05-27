import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const accentMap = {
  '#007a3d': '#003f2a',
  '#7c4dff': '#2b176d',
  '#22c55e': '#064e3b',
  '#14b8a6': '#0f3f3a',
  '#f59e0b': '#5c3600',
  '#ef4444': '#5f1515',
};

function applySavedAppearance() {
  const accent = localStorage.getItem('finlearn-accent') || '#007a3d';
  const theme = localStorage.getItem('finlearn-theme') || 'light';
  const font = localStorage.getItem('finlearn-font-size') || 'medium';
  const sidebar = accentMap[accent] || '#003f2a';
  const selectedTheme = theme === 'auto'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;

  document.documentElement.style.setProperty('--accent', accent);
  document.documentElement.style.setProperty('--accent-2', accent);
  document.documentElement.style.setProperty('--accent-3', sidebar);
  document.documentElement.style.setProperty('--sidebar', sidebar);
  document.documentElement.style.setProperty('--sidebar-2', accent);
  document.documentElement.dataset.theme = selectedTheme;
  document.documentElement.dataset.font = font;
}

export default function AppLayout() {
  useEffect(() => {
    applySavedAppearance();
  }, []);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
