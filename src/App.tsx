// import { ARCanvas, ARMarker } from '@artcom/react-three-arjs';
import { BakeShadows, Environment, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Effects } from './libs/arnft/arnft/components/Effects';
import ARCanvas from './libs/arnft/arnft/components/arCanvas';
import NFTMarker from './libs/arnft/arnft/components/nftMarker';
import { requestCameraPermission } from './libs/util';

function Box() {
  const { scene } = useGLTF('data/mp.glb');
  const modelRef = useRef<THREE.Group>(null);

  useFrame(({ gl }) => {
    if (gl) gl.setSize(window.innerWidth, window.innerHeight);
  });
  return (
    <>
      <NFTMarker url={'../data/marker/marker'}>
        <Suspense fallback={null}>
          <mesh scale={[100, 100, 100]} rotation-x={Math.PI / 4.5}>
            <primitive ref={modelRef} object={scene} />
          </mesh>
          <BakeShadows />
        </Suspense>
      </NFTMarker>
    </>
  );
}

export default function App() {
  useEffect(() => {
    requestCameraPermission();
  }, []);
  return (
    <ARCanvas
      interpolationFactor={30}
      // onCreated={({ gl }: any) => {
      //   gl.setSize(window.innerWidth, window.innerHeight);
      // }}
    >
      <Box />
      <Environment preset="warehouse" />
      <Effects />
    </ARCanvas>
  );
}

useGLTF.preload('data/mp.glb');
