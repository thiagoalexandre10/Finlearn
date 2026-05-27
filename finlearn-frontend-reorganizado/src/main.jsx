import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Forgot from './pages/Forgot';
import Home from './pages/Home';
import Transactions from './pages/Transactions';
import Accounts from './pages/Accounts';
import Investments from './pages/Investments';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import { Achievements, Assistant, Challenges, Education, NotFound, Ranking, Reports } from './pages/SimplePages';
import './styles/global.css';

function applySavedAppearance() {
  const accentOptions = {
    '#007a3d': '#003f2a',
    '#7c4dff': '#2b176d',
    '#22c55e': '#064e3b',
    '#14b8a6': '#0f3f3a',
    '#f59e0b': '#5c3600',
    '#ef4444': '#5f1515',
  };
  const theme = localStorage.getItem('finlearn-theme') || 'light';
  const accent = localStorage.getItem('finlearn-accent') || '#007a3d';
  const font = localStorage.getItem('finlearn-font-size') || 'medium';
  const selectedTheme = theme === 'auto'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;
  const sidebar = accentOptions[accent] || '#003f2a';

  document.documentElement.style.setProperty('--accent', accent);
  document.documentElement.style.setProperty('--accent-2', accent);
  document.documentElement.style.setProperty('--accent-3', sidebar);
  document.documentElement.style.setProperty('--sidebar', sidebar);
  document.documentElement.style.setProperty('--sidebar-2', accent);
  document.documentElement.dataset.theme = selectedTheme;
  document.documentElement.dataset.font = font;
}

applySavedAppearance();

function AuthGate() {
  const isAuthenticated = Boolean(localStorage.getItem('finlearn-auth-user'));

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout />;
}

function StartRoute() {
  const isAuthenticated = Boolean(localStorage.getItem('finlearn-auth-user'));
  return <Navigate to={isAuthenticated ? "/home" : "/login"} replace />;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Register />} />
        <Route path="/esqueci-senha" element={<Forgot />} />

        <Route path="/" element={<StartRoute />} />

        <Route element={<AuthGate />}>
          <Route path="/home" element={<Home />} />
          <Route path="/transacoes" element={<Transactions />} />
          <Route path="/contas" element={<Accounts />} />
          <Route path="/investimentos" element={<Investments />} />
          <Route path="/metas" element={<Goals />} />
          <Route path="/desafios" element={<Challenges />} />
          <Route path="/conquistas" element={<Achievements />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/educacao" element={<Education />} />
          <Route path="/assistente" element={<Assistant />} />
          <Route path="/relatorios" element={<Reports />} />
          <Route path="/configuracoes" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
