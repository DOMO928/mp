// import { ARCanvas, ARMarker } from '@artcom/react-three-arjs';
import { BakeShadows, Environment, Merged, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Suspense, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useARNft, useNftMarker } from './libs/arnft/arnft/arnftContext';
import { Effects } from './libs/arnft/arnft/components/Effects';
import ARCanvas from './libs/arnft/arnft/components/arCanvas';
import { requestCameraPermission } from './libs/util';

const context = createContext(undefined);
export function Instances({ children, url, ...props }: any) {
  const { arEnabled } = useARNft();
  const ref = useNftMarker(url);

  const { nodes } = useGLTF('data/mp.glb');
  const instances = useMemo(() => {
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
    <group ref={ref} visible={!arEnabled}>
      <group name="center">
        <Merged meshes={instances} {...props}>
          {(instances: any) => <context.Provider value={instances} children={children} />}
        </Merged>
      </group>
    </group>
  );
}

function Box() {
  const modelRef = useRef<THREE.Group>(null);
  const instances: any = useContext(context);
  const [ang, setAng] = useState(0);

  useFrame(({ gl, camera }) => {
    if (gl) {
      (camera as THREE.PerspectiveCamera).aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      gl.setSize(window.innerWidth, window.innerHeight);
    }
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch('data/angle.json', {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
        if (res) {
          const js = await res.json();
          setAng(js.angle);
        }
      } catch (e) {
        console.log('ERROR', e);
      }
    };

    getData();
  }, []);
  return (
    <>
      <group ref={modelRef} dispose={null} scale={[1.5, 1.5, 1.5]} position={[0, 1, 1]} rotation-x={ang || Math.PI / 5}>
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
        <Instances url={'../data/marker/marker'}>
          <Box />
        </Instances>
        <Environment preset="park" />
        <Effects />
      </Suspense>
    </ARCanvas>
  );
}

useGLTF.preload('data/mp.glb');
