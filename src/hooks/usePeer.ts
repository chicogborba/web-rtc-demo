// src/hooks/usePeer.ts
import { useState, useEffect, useRef, useCallback } from 'react';
import Peer from 'peerjs';
import type { DataConnection } from 'peerjs';

type PeerMode = 'host' | 'join' | null;

interface UsePeerReturn {
  myPeerId: string;
  connected: boolean;
  messages: string[];
  sendMessage: (msg: string) => void;
  connectToHost: (hostId: string) => void;
}

export function usePeer(mode: PeerMode): UsePeerReturn {
  const [myPeerId, setMyPeerId] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<string[]>([]);

  const peerRef = useRef<Peer | null>(null);
  const connRef = useRef<DataConnection | null>(null);

  useEffect(() => {
    if (!mode) {
      return;
    }

    const peer = new Peer();
    peerRef.current = peer;

    // 2) Quando o Peer abre, recebe seu ID único
    peer.on('open', (id: string) => {
      setMyPeerId(id);
    });

    // 3) Se for Host, aguarda inbound connections do Join
    if (mode === 'host') {
      peer.on('connection', (conn: DataConnection) => {
        connRef.current = conn;

        conn.on('open', () => {
          setConnected(true);
        });

        conn.on('data', (data: unknown) => {
          // “Join: <texto recebido>”
          setMessages((prev) => [...prev, 'Join: ' + data]);
        });
      });
    }

    // Se for Join, aguardamos connectToHost() ser chamado manualmente

    return () => {
      // Cleanup ao desativar este hook (ou mudar `mode` para null)
      peer.destroy();
      peerRef.current = null;
      connRef.current = null;
      setMyPeerId('');
      setConnected(false);
      setMessages([]);
    };
  }, [mode]);

  // Função para Join chamar peer.connect(hostId)
  const connectToHost = useCallback(
    (hostId: string) => {
      if (mode !== 'join') return;
      if (!peerRef.current) return;
      if (!hostId.trim()) return;

      const conn = peerRef.current.connect(hostId.trim());
      connRef.current = conn;

      conn.on('open', () => {
        setConnected(true);
      });

      conn.on('data', (data: unknown) => {
        setMessages((prev) => [...prev, 'Host: ' + data]);
      });
    },
    [mode]
  );

  // Função para enviar mensagem (tanto Host quanto Join podem chamar)
  const sendMessage = useCallback(
    (msg: string) => {
      const conn = connRef.current;
      if (!conn) return;
      if (!conn.open) return;
      if (!msg.trim()) return;

      conn.send(msg);
      setMessages((prev) => [...prev, 'Você: ' + msg]);
    },
    []
  );

  return {
    myPeerId,
    connected,
    messages,
    sendMessage,
    connectToHost,
  };
}
