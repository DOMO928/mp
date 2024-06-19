// import { ARCanvas, ARMarker } from '@artcom/react-three-arjs';
import { useGLTF } from '@react-three/drei';
import { Dispatch, Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { requestCameraPermission } from './libs/util';
import { useFrame } from '@react-three/fiber';
import ARCanvas from './libs/arnft/arnft/components/arCanvas';
import NFTMarker from './libs/arnft/arnft/components/nftMarker';

const DUMMY = new THREE.Vector3();
const DUMMYQ = new THREE.Quaternion();

function Box() {
  const { scene } = useGLTF('data/test.glb');
  const modelRef = useRef<THREE.Group>(null);
  const boxRef = useRef<THREE.Mesh>(null);
  const [init, setInit] = useState(false);
  const visRef = useRef<boolean>(false);

  useFrame(({ gl }) => {
    gl.setSize(window.innerWidth, window.innerHeight);
  });

  useEffect(() => {
    if (scene) console.log('hdhd', scene);
  }, [scene]);

  // useFrame(() => {
  //   if (visRef.current && modelRef.current && boxRef.current) {
  //     boxRef.current?.getWorldPosition(DUMMY);
  //     boxRef.current?.getWorldQuaternion(DUMMYQ);
  //     modelRef.current?.position.set(DUMMY.x, DUMMY.y, DUMMY.z);
  //     //  modelRef.current?.quaternion.set(DUMMYQ.x, DUMMYQ.y, DUMMYQ.z, DUMMYQ.w);
  //     if (!init) setInit(true);
  //     visRef.current = false;
  //   }
  // });

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

// export default function App() {
//   useEffect(() => {
//     requestCameraPermission();
//   }, []);
//   return (
//     <ARCanvas
//       camera={{ position: [0, 0, 0] }}
//       onCameraStreamReady={() => console.log('Camera stream ready')}
//       onCameraStreamError={() => console.error('Camera stream error')}
//       sourceType={'webcam'}
//       onCreated={({ gl }: any) => {
//         gl.setSize(window.innerWidth, window.innerHeight);
//       }}
//       gl={{ alpha: true, antialias: true, precision: 'highp', logarithmicDepthBuffer: true }}
//     >
//       <ambientLight />
//       <pointLight position={[10, 10, 0]} intensity={10.0} />
//       <Box />
//     </ARCanvas>
//   );
// }

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
      // gl={{ alpha: true, antialias: true, precision: 'highp', logarithmicDepthBuffer: true }}
    >
      <Box />
      <pointLight position={[10, 10, 0]} intensity={10.0} />
      <ambientLight />
    </ARCanvas>
  );
}
