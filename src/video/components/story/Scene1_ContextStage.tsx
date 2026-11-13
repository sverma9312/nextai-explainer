import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandHubCircle, CarVector, PersonVector, ServerRackVector } from '../icons/TechLogos';

interface Scene1Props {
  company: string;
  category?: string;
}

export const Scene1_ContextStage: React.FC<Scene1Props> = ({ company }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Animated packet ping from person -> Uber -> cars
  const pingProgress = (frame % 35) / 35;
  const pingX = interpolate(pingProgress, [0, 1], [220, 760]);

  return (
    <div
      style={{
        position: 'relative',
        width: 980,
        height: 1040,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${entrance})`,
        opacity: entrance,
      }}
    >
      {/* Visual Canvas Box */}
      <div
        style={{
          position: 'relative',
          width: 920,
          height: 600,
          backgroundColor: '#0A0C14',
          border: '2px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 32,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 60px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Dotted Connection Line */}
        <svg
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '100%',
            height: 40,
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        >
          <line
            x1="180"
            y1="20"
            x2="780"
            y2="20"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="4"
            strokeDasharray="8 8"
          />
          {/* Animated Flowing Ping */}
          <circle
            cx={pingX}
            cy="20"
            r="8"
            fill="#22D3EE"
            filter="drop-shadow(0 0 10px #22D3EE)"
          />
        </svg>

        {/* 1. Left Actor: Stick Person with Phone ("YOU") */}
        <div style={{ zIndex: 10 }}>
          <PersonVector size={130} color="#22D3EE" label="YOU" />
        </div>

        {/* 2. Center Hub: Company Brand Circle */}
        <div style={{ zIndex: 15 }}>
          <BrandHubCircle name={company} size={140} />
        </div>

        {/* 3. Right Fleet: Moving Vehicles */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <CarVector size={72} color="#FBBF24" active={true} />
          <div style={{ display: 'flex', gap: 16 }}>
            <CarVector size={54} color="#FBBF24" />
            <CarVector size={54} color="#FBBF24" />
          </div>
          <span
            style={{
              fontSize: 20,
              fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
              fontWeight: 900,
              color: '#FBBF24',
              letterSpacing: 1.5,
              marginTop: 4,
            }}
          >
            1M+ DRIVERS
          </span>
        </div>
      </div>

      {/* Bottom Infrastructure: Server Gateway Cluster */}
      <div
        style={{
          marginTop: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 28,
        }}
      >
        <ServerRackVector size={80} />
        <ServerRackVector size={80} />
        <div
          style={{
            padding: '14px 28px',
            backgroundColor: '#111422',
            border: '2px solid rgba(34, 211, 238, 0.4)',
            borderRadius: 18,
            boxShadow: '0 0 25px rgba(34, 211, 238, 0.2)',
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: '#FFFFFF',
              fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
            }}
          >
            STREAMING EDGE GATEWAY
          </div>
          <div
            style={{
              fontSize: 15,
              fontFamily: 'monospace',
              color: '#22D3EE',
              fontWeight: 700,
              marginTop: 4,
            }}
          >
            4-Second GPS Telemetry Heartbeats
          </div>
        </div>
        <ServerRackVector size={80} />
        <ServerRackVector size={80} />
      </div>
    </div>
  );
};
