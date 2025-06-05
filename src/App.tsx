// src/App.tsx
import React, { useState } from 'react';
import { Host } from './components/Host';
import { Join } from './components/Join';

const App: React.FC = () => {
  const [mode, setMode] = useState<'host' | 'join' | null>(null);

  const handleReturnToMenu = () => {
    setMode(null);
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      {!mode && (
        <div>
          <h2>Escolha o modo:</h2>
          <button
            onClick={() => setMode('host')}
            style={{ marginRight: 10, padding: '8px 16px' }}
          >
            Host
          </button>
          <button onClick={() => setMode('join')} style={{ padding: '8px 16px' }}>
            Join
          </button>
        </div>
      )}

      {mode === 'host' && <Host onReturnToMenu={handleReturnToMenu} />}
      {mode === 'join' && <Join onReturnToMenu={handleReturnToMenu} />}
    </div>
  );
};

export default App;
