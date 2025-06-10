import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Interface para os dados do giroscópio (alpha, beta, gamma)
interface GyroData {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
}

// Props para o componente 3D
interface Experience3DProps {
  gyroData: GyroData;
}

// Converte DeviceOrientation (alpha, beta, gamma) + screenOrientation para um Quaternion
function getQuaternionFromDeviceOrientation(
  alpha: number,
  beta: number,
  gamma: number,
  screenOrientation: number
) {
  const degToRad = Math.PI / 180;

  const _zee = new THREE.Vector3(0, 0, 1);
  const _euler = new THREE.Euler();
  const _q0 = new THREE.Quaternion();
  const _q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // Ajuste fixo

  const quaternion = new THREE.Quaternion();

  _euler.set(beta * degToRad, alpha * degToRad, -gamma * degToRad, 'YXZ');
  quaternion.setFromEuler(_euler);
  quaternion.multiply(_q1); // Corrige orientação da câmera
  quaternion.multiply(_q0.setFromAxisAngle(_zee, -screenOrientation * degToRad)); // Compensa rotação da tela

  return quaternion;
}

/**
 * Interpola linearmente entre dois ângulos, tratando a transição de 360/0 graus.
 */
function lerpAngle(current: number, target: number, t: number): number {
  const currentNormalized = (current % 360 + 360) % 360;
  const targetNormalized = (target % 360 + 360) % 360;
  let delta = targetNormalized - currentNormalized;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return current + delta * t;
}

/**
 * Componente que carrega e renderiza o modelo 3D do telefone,
 * aplicando as rotações baseadas nos dados do giroscópio.
 */
function PhoneModel({ gyroData }: Experience3DProps) {
  const { scene } = useGLTF('/Phone.glb');
  const modelRef = useRef<THREE.Group>(null!);

  const [smoothAlpha, setSmoothAlpha] = useState(0);
  const [smoothBeta, setSmoothBeta] = useState(0);
  const [smoothGamma, setSmoothGamma] = useState(0);

  useFrame(() => {
    if (!modelRef.current) return;

    let { alpha, beta, gamma } = gyroData;

    alpha = alpha ?? 0;
    beta = beta ?? 0;
    gamma = gamma ?? 0;

    // Suavização dos ângulos
    setSmoothAlpha(prev => lerpAngle(prev, alpha!, 0.05));
    setSmoothBeta(prev => lerpAngle(prev, beta!, 0.05));
    setSmoothGamma(prev => lerpAngle(prev, gamma!, 0.05));

    // Orientação da tela (em graus)
    const screenOrientation = window.screen.orientation?.angle ?? 0;

    // Quaternion baseado nos valores suavizados
    const quaternion = getQuaternionFromDeviceOrientation(
      smoothAlpha,
      smoothBeta,
      smoothGamma,
      screenOrientation
    );

    console.log('Quaternion:', quaternion);

    modelRef.current.quaternion.copy(quaternion);
  });

  return (
    <primitive object={scene} ref={modelRef} scale={5} position={[0, 0, 0]} />
  );
}

/**
 * Componente principal que configura a cena 3D com o modelo do telefone.
 */
export const Experience3D: React.FC<Experience3DProps> = ({ gyroData }) => {
  return (
    <Canvas
      style={{
        width: '100vw',
        height: '80vh',
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <OrbitControls enableZoom={false} />
      <PhoneModel gyroData={gyroData} />
    </Canvas>
  );
};
