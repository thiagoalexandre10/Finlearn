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
import Settings from './pages/Settings';
import { Achievements, Assistant, Challenges, Education, NotFound, Ranking, Reports } from './pages/SimplePages';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
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
