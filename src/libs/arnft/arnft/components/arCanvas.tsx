/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-pascal-case */

import { Canvas } from '@react-three/fiber';
import { PropsWithChildren, memo, useRef } from 'react';
import { ARNftProvider } from '../arnftContext';

function ARCanvas({ arEnabled = true, interpolationFactor = 1, children, ...props }: PropsWithChildren<any>) {
  const ref = useRef<any>();

  return (
    <>
      {arEnabled && (
        <>
          <video
            id="ar-video"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              objectFit: 'cover',
            }}
            ref={ref}
            loop
            autoPlay
            muted
            playsInline
          />
        </>
      )}
      <Canvas
        camera={arEnabled ? { position: [0, 0, 0], near: 100, far: 100000 } : props.camera}
        {...props}
        gl={{ alpha: true, antialias: true, precision: 'highp', logarithmicDepthBuffer: true }}
      >
        <ARNftProvider video={ref} interpolationFactor={interpolationFactor} arEnabled={arEnabled}>
          {children}
        </ARNftProvider>
      </Canvas>
    </>
  );
}

export default memo(ARCanvas);
