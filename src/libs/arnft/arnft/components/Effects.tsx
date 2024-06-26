import { extend } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { LUTPass } from 'three-stdlib';

extend({ LUTPass });

export function Effects() {
  // const texture = useLoader(LUTCubeLoader as any, 'data/F-6800-STD.cube');

  return (
    <EffectComposer enableNormalPass={false}>
      <Bloom luminanceThreshold={0.2} mipmapBlur luminanceSmoothing={0} intensity={1.75} />
      {/* <LUT lut={texture} /> */}
      {/* <lUTPass lut={texture} /> */}
    </EffectComposer>
  );
}
