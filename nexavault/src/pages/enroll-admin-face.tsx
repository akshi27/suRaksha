// src/pages/enroll-admin-face.tsx
import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';

export default function EnrollAdminFace() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState('Loading models...');

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

        setStatus('✅ Models loaded. Accessing webcam...');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error(err);
        setStatus('❌ Error: ' + (err as Error).message);
      }
    };

    loadModels();
  }, []);

  const captureAndDownload = async () => {
    if (!videoRef.current) return;

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      setStatus('❌ No face detected. Please try again.');
      return;
    }

    const blob = new Blob([JSON.stringify(Array.from(detection.descriptor))], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'admin.json';
    a.click();

    setStatus('✅ Face descriptor captured and downloaded.');
  };

  return (
    <div className="p-8 font-sans max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">🎯 Enroll Admin Face</h1>
      <p className="mb-4 text-gray-600">{status}</p>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        width={400}
        height={300}
        className="rounded border shadow"
      />
      <button
        onClick={captureAndDownload}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Capture and Download Admin Face
      </button>
    </div>
  );
}
