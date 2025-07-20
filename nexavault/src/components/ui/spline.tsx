'use client'

import { Suspense, lazy } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          {/* Simple loader animation */}
          <style>{`
            .loader {
              width: 48px;
              height: 48px;
              border: 5px dotted #FFF; /* White dotted border */
              border-radius: 50%;
              display: inline-block;
              position: relative;
              box-sizing: border-box;
              animation: rotation 2s linear infinite;
            }
            .loader::after {
              content: '';
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              width: 40px;
              height: 40px;
              border: 5px dotted #5B44F9; /* Purplish-blue dotted border */
              border-radius: 50%;
              box-sizing: border-box;
              animation: rotation 1s linear infinite reverse;
            }
            @keyframes rotation {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <span className="loader"></span>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
      />
    </Suspense>
  )
}
