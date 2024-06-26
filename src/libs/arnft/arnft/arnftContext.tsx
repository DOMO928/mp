import { useThree } from '@react-three/fiber';
import { MutableRefObject, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ARNft } from './arnft';
import QrScanner from 'qr-scanner';
import Cookies from 'js-cookie';

const constraints = {
  audio: false,
  video: {
    facingMode: 'environment',
    width: 640,
    height: 480,
  },
};

const ARNftContext = createContext({});

const ARNftProvider = ({ children, video, interpolationFactor, arEnabled }: any) => {
  const { gl, camera } = useThree();

  const [arnft, setARNft] = useState(null);

  const markersRef = useRef([]);
  const arnftRef = useRef<any>();

  const onLoaded = useCallback((msg: any) => {
    console.log('onLoaded', msg);

    setARNft(arnftRef.current as any);
  }, []);
  const [qrOn, setQrOn] = useState<boolean>(true);
  const scanner = useRef<QrScanner>();
  // Result
  const [scannedResult, setScannedResult] = useState<string | undefined>('');

  // Success
  const onScanSuccess = (result: QrScanner.ScanResult) => {
    // 🖨 Print the "result" to browser console.
    console.log(result);
    // ✅ Handle success.
    // 😎 You can do whatever you want with the scanned result.
    setScannedResult(result?.data);
  };

  // Fail
  const onScanFail = () => {
    // 🖨 Print the "err" to browser console.
    // console.log(err);
  };

  useEffect(() => {
    async function init() {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.current.srcObject = stream;
      video.current.onloadedmetadata = async (event: any) => {
        console.log(event.srcElement.videoWidth);
        console.log(event.srcElement.videoHeight);

        video.current.play();

        gl.domElement.width = event.srcElement.videoWidth;
        gl.domElement.height = event.srcElement.videoHeight;

        gl.domElement.style.objectFit = 'cover';

        camera.updateProjectionMatrix();

        const arnft: any = new ARNft(
          '../data/camera_para.dat',
          video.current,
          gl,
          camera,
          onLoaded,
          interpolationFactor
        );

        arnftRef.current = arnft;
      };
    }

    if (arEnabled) {
      init();

      if ((video as MutableRefObject<HTMLVideoElement>)?.current && !scanner.current) {
        // 👉 Instantiate the QR Scanner
        scanner.current = new QrScanner((video as MutableRefObject<HTMLVideoElement>)?.current, onScanSuccess, {
          onDecodeError: onScanFail,
          // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
          preferredCamera: 'environment',
          // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
          highlightScanRegion: false,
          // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
          highlightCodeOutline: false,
        });
        scanner.current.$canvas.getContext('2d', { willReadFrequently: true });
        // 🚀 Start QR Scanner
        scanner?.current
          ?.start()
          .then(() => setQrOn(true))
          .catch((err) => {
            if (err) setQrOn(false);
          });
      }
    }

    // 🧹 Clean up on unmount.
    // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
    return () => {
      if (!(video as MutableRefObject<HTMLVideoElement>)?.current) {
        scanner?.current?.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (scannedResult) {
      if (scannedResult.indexOf('haekwan1897') > -1) {
        var cookieStr = Cookies.get('HaekwanPlaces');
        var num = scannedResult.replace('haekwan1897_00', '');
        var date = new Date();
        const expires = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
        const cookieOpt = { expires: expires, domain: '.haekwan1897.com', path: '/' };

        if (cookieStr) {
          if (cookieStr.includes(num)) {
            // cancelAnimationFrame(tickfunc);
            Cookies.set('HaekwanPopup', 'already', cookieOpt);
            window.location.href = `https://haekwan1897.com/${'stamp'}`;
            return;
          } else {
            // cancelAnimationFrame(tickfunc);
            Cookies.remove('HaekwanPlaces', cookieOpt);
            Cookies.set('HaekwanPlaces', cookieStr + num + '', cookieOpt);
            Cookies.set('HaekwanPopup', num + '', cookieOpt);
            window.location.href = `https://haekwan1897.com/${'stamp'}`;
            return;
          }
        } else {
          Cookies.set('HaekwanPlaces', num, cookieOpt);
          Cookies.set('HaekwanPopup', num + '', cookieOpt);
          window.location.href = `https://haekwan1897.com/${'stamp'}`;
          return;
        }
      } else {
        alert('유효하지 않은 QR 코드입니다.');
      }
    }
  }, [scannedResult]);

  // ❌ If "camera" is not allowed in browser permissions, show an alert.
  useEffect(() => {
    if (!qrOn)
      alert('Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload.');
  }, [qrOn]);

  useEffect(() => {
    if (!arnft) {
      return;
    }

    (arnft as any).loadMarkers(markersRef.current);
  }, [arnft]);

  const value = useMemo(() => {
    return { arnft, markersRef, arEnabled };
  }, [arnft, markersRef, arEnabled]);

  return <ARNftContext.Provider value={value}>{children}</ARNftContext.Provider>;
};

const useARNft = () => {
  const arValue = useContext(ARNftContext);
  return useMemo(() => ({ ...arValue } as any), [arValue]);
};

const useNftMarker = (url: string) => {
  const ref = useRef();

  const { markersRef } = useARNft();

  useEffect(() => {
    const newMarkers = [...markersRef.current, { url, root: ref.current }];

    markersRef.current = newMarkers;
  }, []);

  return ref as any;
};

export { ARNftContext, ARNftProvider, useARNft, useNftMarker };
