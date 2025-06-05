// src/components/Host.tsx
import React, { useState } from 'react';
import { usePeer } from '../hooks/usePeer';

interface HostProps {
  onReturnToMenu: () => void;
}

export const Host: React.FC<HostProps> = ({ onReturnToMenu }) => {
  const { myPeerId, connected, messages, sendMessage } = usePeer('host');

  const [inputText, setInputText] = useState<string>('');

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Modo Host</h2>
      <p>
        <strong>1. Copie este ID e cole no Join:</strong>
      </p>
      {myPeerId ? (
        <div
          style={{
            background: 'black',
            padding: 8,
            fontFamily: 'monospace',
            wordBreak: 'break-all',
          }}
        >
          {myPeerId}
        </div>
      ) : (
        <p>Gerando ID… aguarde.</p>
      )}

      <p style={{ marginTop: 16 }}>
        <strong>2. Aguardando o Join conectar no seu ID…</strong>
      </p>

      {connected ? (
        <div style={{ marginTop: 16 }}>
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
        <p style={{ marginTop: 16 }}>Aguardando conexão do Join…</p>
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
