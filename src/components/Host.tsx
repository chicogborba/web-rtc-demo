// src/components/Host.tsx
import React from 'react';
import { usePeer } from '../hooks/usePeer';
import { Experience3D } from './Experience3D';

interface HostProps {
  onReturnToMenu: () => void;
}

export const Host: React.FC<HostProps> = ({ onReturnToMenu }) => {
  const { myPeerId, connected, gyroData } = usePeer('host');

  console.log(gyroData)

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
            color: 'white',
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
        <>
          <div style={{ marginTop: 16 }}>
            <h3>Visualização em 3D com Giroscópio:</h3>

            {/* Mostra valores do giroscópio */}
            <div
              style={{
                background: 'black',
                padding: '10px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-around',
              }}
            >
              <div>
                <strong>Alpha:</strong> {gyroData.alpha?.toFixed(2) ?? 'N/A'}°
              </div>
              <div>
                <strong>Beta:</strong> {gyroData.beta?.toFixed(2) ?? 'N/A'}°
              </div>
              <div>
                <strong>Gamma:</strong> {gyroData.gamma?.toFixed(2) ?? 'N/A'}°
              </div>
            </div>

            <Experience3D gyroData={gyroData} />
          </div>
        </>
      ) : (
        <p style={{ marginTop: 16 }}>Aguardando conexão do Join…</p>
      )}

      <button
        onClick={onReturnToMenu}
        style={{
          marginTop: 24,
          padding: '10px 20px',
          fontSize: 16,
        }}
      >
        Voltar
      </button>
    </div>
  );
};
