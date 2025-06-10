// src/components/Join.tsx
import React, { useState } from 'react';
import { usePeer } from '../hooks/usePeer';

interface JoinProps {
  onReturnToMenu: () => void;
}

export const Join: React.FC<JoinProps> = ({ onReturnToMenu }) => {
  const { connected, connectToHost } = usePeer('join');
  const [hostIdToConnect, setHostIdToConnect] = useState<string>('');
  const [gyroEnabled, setGyroEnabled] = useState<boolean>(false);

  const handleConnectClick = () => {
    if (hostIdToConnect.trim()) {
      connectToHost(hostIdToConnect.trim());
    }
  };

  const handleEnableGyro = async () => {
    // só em iOS Safari
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      // @ts-expect-error not all browsers have this
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
      // @ts-expect-error not all browsers have this
        const perm = await DeviceOrientationEvent.requestPermission();
        if (perm === 'granted') {
          setGyroEnabled(true);
        } else {
          alert('Permissão negada para acessar giroscópio.');
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // outros navegadores não precisam pedir
      setGyroEnabled(true);
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

      {/* botão para pedir permissão de giroscópio */}
      {!gyroEnabled && connected && (
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={handleEnableGyro}
            style={{ padding: '6px 12px' }}
          >
            Ativar Giroscópio
          </button>
        </div>
      )}

      {connected ? (
        <p>
          Conectado!
          {gyroEnabled
            ? ' Enviando dados de giroscópio…'
            : ' Clique em “Ativar Giroscópio” para começar.'}
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
