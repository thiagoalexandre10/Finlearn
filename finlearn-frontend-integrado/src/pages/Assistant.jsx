import { useState } from 'react';
import SimplePage from './SimplePage';
import { Card } from '../components/Card';

export default function Assistant() {
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Olá! Posso te ajudar com contas, metas, investimentos e relatórios.' }]);
  const [text, setText] = useState('');

  function send(event) {
    event.preventDefault();
    if (!text.trim()) return;
    setMessages([...messages, { from: 'user', text }, { from: 'bot', text: 'Entendi! Para ações reais, vou consultar os dados integrados ao backend.' }]);
    setText('');
  }

  return (
    <SimplePage title="Assistente" subtitle="Tire dúvidas sobre sua vida financeira.">
      <Card className="chat-card">
        <div className="chat-messages">{messages.map((msg, index) => <p key={index} className={msg.from}>{msg.text}</p>)}</div>
        <form className="chat-form" onSubmit={send}><input value={text} onChange={(e) => setText(e.target.value)} placeholder="Digite sua dúvida..." /><button className="primary-button">Enviar</button></form>
      </Card>
    </SimplePage>
  );
}
