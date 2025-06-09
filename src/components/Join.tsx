// src/components/Join.tsx
import React, { useState } from 'react';
import { usePeer } from '../hooks/usePeer';

interface JoinProps {
  onReturnToMenu: () => void;
}

export const Join: React.FC<JoinProps> = ({ onReturnToMenu }) => {
  const { connected, connectToHost } = usePeer('join');
  const [hostIdToConnect, setHostIdToConnect] = useState<string>('');

  const handleConnectClick = () => {
    if (hostIdToConnect.trim()) {
      connectToHost(hostIdToConnect.trim());
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
        onChange={e => setHostIdToConnect(e.target.value)}
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
        <p>
          Conectado!  Enviando dados de giroscópio…
        </p>
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
