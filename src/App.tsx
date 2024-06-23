// import { ARCanvas, ARMarker } from '@artcom/react-three-arjs';
import { Environment, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import ARCanvas from './libs/arnft/arnft/components/arCanvas';
import NFTMarker from './libs/arnft/arnft/components/nftMarker';
import { requestCameraPermission } from './libs/util';
import { Effects } from './libs/arnft/arnft/components/Effects';

function Box() {
  const { scene } = useGLTF('data/mptest_o.glb');
  const modelRef = useRef<THREE.Group>(null);

  useFrame(({ gl }) => {
    gl.setSize(window.innerWidth, window.innerHeight);
  });

  return (
    <>
      <NFTMarker url={'../data/marker/marker'}>
        <Suspense fallback={null}>
          <mesh scale={[100, 100, 100]} position-z={10}>
            <primitive ref={modelRef} object={scene} />
          </mesh>
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

useGLTF.preload('data/mptest_o.glb');
