// import { ARCanvas, ARMarker } from '@artcom/react-three-arjs';
import { BakeShadows, Environment, Merged, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Suspense, createContext, useContext, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import ARCanvas from './libs/arnft/arnft/components/arCanvas';
import NFTMarker from './libs/arnft/arnft/components/nftMarker';
import { requestCameraPermission } from './libs/util';
import { suspend } from 'suspend-react';
import { Effects } from './libs/arnft/arnft/components/Effects';
const asset = import('/data/Ultimate_Skies_4k_0045.exr?url').then((module) => module.default);

const context = createContext(undefined);
export function Instances({ children, ...props }: any) {
  const { nodes, scene } = useGLTF('data/mp.glb');
  const instances = useMemo(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh)
        ((obj as THREE.Mesh).material as THREE.MeshStandardMaterial).envMapIntensity = 1.8;
    });
    return {
      Blackmetal: nodes.black_metal,
      Block: nodes.block,
      Brickwall: nodes.brick_wall,
      Concretea: nodes.concrete_a,
      Concreteb: nodes.concrete_b,
      Concretec: nodes.concrete_c,
      Cooperroof: nodes.cooper_roof,
      Dirt: nodes.dirt,
      Glass: nodes.glass4,
      Painteddoor: nodes.painted_door,
      Roof: nodes.roof,
      Wall: nodes.wall,
      Windowframe: nodes.window_frame,
      Windowframea: nodes.window_frame_a,
      Wood: nodes.wood,
      Woodenwall: nodes.wooden_wall,
    };
  }, [nodes]);
  return (
    <Merged meshes={instances} {...props}>
      {(instances: any) => <context.Provider value={instances} children={children} />}
    </Merged>
  );
}

function Box() {
  const modelRef = useRef<THREE.Group>(null);
  const instances: any = useContext(context);

  useFrame(({ gl, camera }) => {
    if (gl) {
      (camera as THREE.PerspectiveCamera).aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      gl.setSize(window.innerWidth, window.innerHeight);
    }
  });
  return (
    <>
      <NFTMarker url={'../data/marker/marker'}>
        {/* <mesh scale={[150, 150, 150]}>
          <primitive object={scene} position={[0, 1, 1]} rotation-x={Math.PI / 5} />
        </mesh> */}

        <group ref={modelRef} dispose={null} scale={[1.5, 1.5, 1.5]} position={[0, 1, 1]} rotation-x={Math.PI / 5}>
          <instances.Blackmetal rotation={[Math.PI / 2, 0, 0]} />
          <instances.Block rotation={[Math.PI / 2, 0, 0]} />
          <instances.Brickwall rotation={[Math.PI / 2, 0, 0]} />
          <instances.Concretea rotation={[Math.PI / 2, 0, 0]} />
          <instances.Concreteb rotation={[Math.PI / 2, 0, 0]} />
          <instances.Concretec rotation={[Math.PI / 2, 0, 0]} />
          <instances.Cooperroof rotation={[Math.PI / 2, 0, 0]} />
          <instances.Dirt rotation={[Math.PI / 2, 0, 0]} />
          <instances.Glass rotation={[Math.PI / 2, 0, 0]} />
          <instances.Painteddoor rotation={[Math.PI / 2, 0, 0]} />
          <instances.Roof rotation={[Math.PI / 2, 0, 0]} />
          <instances.Wall rotation={[Math.PI / 2, 0, 0]} />
          <instances.Windowframe rotation={[Math.PI / 2, 0, 0]} />
          <instances.Windowframea rotation={[Math.PI / 2, 0, 0]} />
          <instances.Wood rotation={[Math.PI / 2, 0, 0]} />
          <instances.Woodenwall rotation={[Math.PI / 2, 0, 0]} />
        </group>

        <BakeShadows />
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
      <Suspense fallback={null}>
        <Instances>
          <Box />
        </Instances>
        <ambientLight intensity={0.6}/>
        <Environment files={suspend(asset) as string} />
        <Effects />
      </Suspense>
    </ARCanvas>
  );
}

useGLTF.preload('data/mp.glb');
