import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CarVector, MapPinVector } from '../icons/TechLogos';
import { DynamicIcon } from '../icons/DynamicIcon';
import type { VisualEntity } from '../../../schema/types';

interface Scene2Props {
  visualEntities?: VisualEntity[];
}

// Scattered Car Positions around the center pin
const CAR_LOCATIONS = [
  { x: 180, y: 110 },
  { x: 380, y: 90 },
  { x: 680, y: 100 },
  { x: 800, y: 220 },
  { x: 740, y: 360 },
  { x: 620, y: 460 },
  { x: 440, y: 490 },
  { x: 220, y: 450 },
  { x: 120, y: 310 },
  { x: 260, y: 220 },
  { x: 600, y: 240 },
  { x: 340, y: 380 },
];

export const Scene2_BottleneckStage: React.FC<Scene2Props> = ({ visualEntities }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const carEntity = visualEntities?.find((e) => e.id === 'driver' || e.iconQuery?.includes('car') || e.iconQuery?.includes('vehicle'));

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const centerPinX = 460;
  const centerPinY = 270;

  // Pulse flash for overload warning
  const flash = (frame % 20) < 10;

  return (
    <div
      style={{
        position: 'relative',
        width: 980,
        height: 1040,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `scale(${entrance})`,
        opacity: entrance,
      }}
    >
      {/* Simulation Map Box */}
      <div
        style={{
          position: 'relative',
          width: 920,
          height: 620,
          backgroundColor: '#0A0C14',
          border: '2px solid rgba(244, 63, 94, 0.4)',
          borderRadius: 32,
          overflow: 'hidden',
          boxShadow: '0 0 50px rgba(244, 63, 94, 0.2), 0 20px 60px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Radiating Red Calculation Distance Lines */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          {CAR_LOCATIONS.map((loc, i) => {
            const lineProgress = Math.min(1, Math.max(0, (frame - i * 2) / 15));
            const currentX = interpolate(lineProgress, [0, 1], [centerPinX, loc.x + 25]);
            const currentY = interpolate(lineProgress, [0, 1], [centerPinY, loc.y + 15]);

            return (
              <line
                key={i}
                x1={centerPinX}
                y1={centerPinY}
                x2={currentX}
                y2={currentY}
                stroke="#F43F5E"
                strokeWidth={2.5}
                strokeDasharray="5 5"
                opacity={0.85}
              />
            );
          })}
        </svg>

        {/* Center Pin ("YOU") */}
        <div
          style={{
            position: 'absolute',
            left: centerPinX,
            top: centerPinY - 20,
            transform: 'translate(-50%, -50%)',
            zIndex: 30,
          }}
        >
          <MapPinVector size={56} color="#22D3EE" label="YOU" />
        </div>

        {/* Scattered Fleet of Cars */}
        {CAR_LOCATIONS.map((loc, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: loc.x,
              top: loc.y,
              transform: 'translate(-50%, -50%)',
              zIndex: 20,
            }}
          >
            {carEntity?.svgDataUri ? (
              <DynamicIcon svgDataUri={carEntity.svgDataUri} size={48} glowColor="#FBBF24" />
            ) : (
              <CarVector size={48} color="#FBBF24" />
            )}
          </div>
        ))}
      </div>

      {/* Bottleneck Alert Callout */}
      <div
        style={{
          width: 860,
          marginTop: 28,
          backgroundColor: '#160B12',
          border: `2px solid ${flash ? '#F43F5E' : 'rgba(244, 63, 94, 0.4)'}`,
          borderRadius: 22,
          padding: '20px 28px',
          boxShadow: '0 0 35px rgba(244, 63, 94, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: '#F43F5E',
              fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
              letterSpacing: 1,
            }}
          >
            ⚠️ THE OBVIOUS APPROACH FAILS
          </div>
          <div
            style={{
              fontSize: 16,
              color: '#E2E8F0',
              fontFamily: 'monospace',
              fontWeight: 700,
              marginTop: 4,
            }}
          >
            Calculating Haversine Distance to 1M Drivers = O(N) CPU Overload!
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#F43F5E',
            color: '#FFFFFF',
            fontWeight: 900,
            fontSize: 18,
            padding: '10px 18px',
            borderRadius: 12,
            fontFamily: 'monospace',
          }}
        >
          TOO SLOW &gt; 5000ms
        </div>
      </div>
    </div>
  );
};

