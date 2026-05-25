import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Forgot from './pages/Forgot';
import Home from './pages/Home';
import Transactions from './pages/Transactions';
import Accounts from './pages/Accounts';
import Investments from './pages/Investments';
import Goals from './pages/Goals';
import Challenges from './pages/Challenges';
import Achievements from './pages/Achievements';
import Ranking from './pages/Ranking';
import Education from './pages/Education';
import Assistant from './pages/Assistant';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Pix from './pages/Pix';
import NotFound from './pages/NotFound';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registrar" element={<Register />} />
      <Route path="/esqueci-senha" element={<Forgot />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/transacoes" element={<Transactions />} />
        <Route path="/contas" element={<Accounts />} />
        <Route path="/investimentos" element={<Investments />} />
        <Route path="/metas" element={<Goals />} />
        <Route path="/pix" element={<Pix />} />
        <Route path="/desafios" element={<Challenges />} />
        <Route path="/conquistas" element={<Achievements />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/educacao" element={<Education />} />
        <Route path="/assistente" element={<Assistant />} />
        <Route path="/relatorios" element={<Reports />} />
        <Route path="/configuracoes" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
