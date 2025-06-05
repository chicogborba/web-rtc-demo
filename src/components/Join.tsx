// src/components/Join.tsx
import React, { useState } from 'react';
import { usePeer } from '../hooks/usePeer';

interface JoinProps {
  onReturnToMenu: () => void;
}

export const Join: React.FC<JoinProps> = ({ onReturnToMenu }) => {
  // 1) Obtemos { connected, messages, sendMessage, connectToHost } do hook
  const { connected, messages, sendMessage, connectToHost } = usePeer('join');

  // Estado local para o ID que o usuário digitou
  const [hostIdToConnect, setHostIdToConnect] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');

  const handleConnectClick = () => {
    if (hostIdToConnect.trim()) {
      connectToHost(hostIdToConnect.trim());
    }
  };

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Modo Join</h2>
      <p>
        <strong>1. Cole aqui o ID do Host e clique em “Conectar ao Host”:</strong>
      </p>
      <input
        type="text"
        value={hostIdToConnect}
        onChange={(e) => setHostIdToConnect(e.target.value)}
        placeholder="ID do Host"
        style={{
          width: '100%',
          padding: 8,
          fontFamily: 'monospace',
          marginBottom: 8,
        }}
      />
      <button
        onClick={handleConnectClick}
        style={{ padding: '6px 12px', marginBottom: 16 }}
      >
        Conectar ao Host
      </button>

      {connected ? (
        <div>
          <h3>Conectado! Chat:</h3>
          <div
            style={{
              border: '1px solid #ccc',
              padding: 10,
              minHeight: 100,
              maxHeight: 300,
              overflowY: 'auto',
              marginBottom: 8,
            }}
          >
            {messages.map((msg, idx) => (
              <div key={idx}>{msg}</div>
            ))}
          </div>
          <div>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite sua mensagem..."
              style={{ width: '80%', padding: 6 }}
            />
            <button
              onClick={handleSend}
              style={{ marginLeft: 8, padding: '6px 12px' }}
            >
              Enviar
            </button>
          </div>
        </div>
      ) : (
        <p>Aguardando conexão com o Host…</p>
      )}

      <button
        onClick={onReturnToMenu}
        style={{ marginTop: 24, padding: '6px 12px' }}
      >
        Voltar
      </button>
    </div>
  );
};
