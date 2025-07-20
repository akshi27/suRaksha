// src/utils/face/verifyFace.ts
import * as faceapi from '@vladmandic/face-api';

export async function verifyFace(video: HTMLVideoElement): Promise<{
  success: boolean;
  distance: number;
}> {
  try {
    const adminDescriptorRes = await fetch('/admin/admin.json');
    const descriptorData: number[] = await adminDescriptorRes.json();

    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) return { success: false, distance: Infinity };

    const distance = faceapi.euclideanDistance(
      new Float32Array(descriptorData),
      detection.descriptor
    );

    return { success: true, distance };
  } catch (err) {
    console.error('Face verification error:', err);
    return { success: false, distance: Infinity };
  }
}
