// src/hooks/usePeer.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import Peer from 'peerjs';
import type { DataConnection } from 'peerjs';

type PeerMode = 'host' | 'join' | null;

export interface GyroData {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
}

interface UsePeerReturn {
  myPeerId: string;
  connected: boolean;
  gyroData: GyroData;
  connectToHost: (hostId: string) => void;
}

export function usePeer(mode: PeerMode): UsePeerReturn {
  const [myPeerId, setMyPeerId] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);
  const [gyroData, setGyroData] = useState<GyroData>({
    alpha: null,
    beta: null,
    gamma: null,
  });

  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);
  // Agora inicializamos com null para cumprir a assinatura do useRef
  const orientationHandlerRef = useRef<((e: DeviceOrientationEvent) => void) | null>(null);

  useEffect(() => {
    if (!mode) return;

    const peer = new Peer();
    peerRef.current = peer;

    peer.on('open', id => {
      setMyPeerId(id);
    });

    if (mode === 'host') {
      peer.on('connection', conn => {
        connRef.current = conn;

        conn.on('open', () => {
          setConnected(true);
        });

        conn.on('data', data => {
          // Espera receber { alpha, beta, gamma }
          const d = data as GyroData;
          setGyroData(d);
        });
      });
    }

    return () => {
      // cleanup: remove listener se existir
      if (orientationHandlerRef.current) {
        window.removeEventListener('deviceorientation', orientationHandlerRef.current);
      }
      peer.destroy();
      peerRef.current = null;
      connRef.current = null;
      setMyPeerId('');
      setConnected(false);
      setGyroData({ alpha: null, beta: null, gamma: null });
    };
  }, [mode]);

  const connectToHost = useCallback((hostId: string) => {
    if (mode !== 'join' || !peerRef.current || !hostId.trim()) return;

    const conn = peerRef.current.connect(hostId.trim());
    connRef.current = conn;

    conn.on('open', () => {
      setConnected(true);

      // depois de conectado, começa a enviar giroscopio
      const handler = (e: DeviceOrientationEvent) => {
        const data = {
          alpha: e.alpha,
          beta: e.beta,
          gamma: e.gamma,
        };
        conn.send(data);
      };
      orientationHandlerRef.current = handler;
      window.addEventListener('deviceorientation', handler);
    });
  }, [mode]);

  return {
    myPeerId,
    connected,
    gyroData,
    connectToHost,
  };
}
