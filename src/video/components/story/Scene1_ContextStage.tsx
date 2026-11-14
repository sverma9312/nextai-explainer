import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  BrandHubCircle,
  CarVector,
  CreditCardVector,
  ChatBubbleVector,
  ScreenTvVector,
  PersonVector,
  ServerRackVector,
} from '../icons/TechLogos';
import { DynamicIcon } from '../icons/DynamicIcon';
import type { VisualEntity } from '../../../schema/types';

interface Scene1Props {
  company: string;
  category?: string;
  visualEntities?: VisualEntity[];
  scaleMetric?: string;
}

export const Scene1_ContextStage: React.FC<Scene1Props> = ({ company, visualEntities, scaleMetric }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isUber = company.toLowerCase().includes('uber');
  const isStripe = company.toLowerCase().includes('stripe');
  const isNetflix = company.toLowerCase().includes('netflix');
  const isWhatsApp = company.toLowerCase().includes('whatsapp');
  const isUPI = company.toLowerCase().includes('upi');

  const userLabel = isStripe ? 'YOU (PAY)' : isNetflix ? 'YOU (WATCH)' : 'YOU';

  // Gateway descriptions
  let gatewayTitle = 'STREAMING EDGE GATEWAY';
  let gatewaySubtitle = '4-Second GPS Telemetry Heartbeats';

  if (isStripe) {
    gatewayTitle = 'IDEMPOTENCY API GATEWAY';
    gatewaySubtitle = 'UUID Key Locking & Distributed Redis Lease';
  } else if (isNetflix) {
    gatewayTitle = 'OPEN CONNECT APPLIANCE';
    gatewaySubtitle = 'Zero-Copy FreeBSD Kernel Streaming';
  } else if (isWhatsApp) {
    gatewayTitle = 'ERLANG BEAM GATEWAY';
    gatewaySubtitle = '2M Concurrent Sockets Per Server Node';
  } else if (isUPI) {
    gatewayTitle = 'NPCI CENTRAL SWITCH';
    gatewaySubtitle = 'Distributed Two-Phase Commit Orchestrator';
  }

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Animated packet ping from person -> Brand -> Target
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

        {/* 1. Left Actor: User Stick Figure Person ("YOU") */}
        <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <PersonVector size={130} color="#22D3EE" label="" />
          <span
            style={{
              fontSize: 22,
              fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
              fontWeight: 900,
              color: '#22D3EE',
              letterSpacing: 2,
            }}
          >
            {userLabel}
          </span>
        </div>

        {/* 2. Center Hub: Company Brand Circle with Official Vector Brand Logo */}
        <div style={{ zIndex: 15 }}>
          <BrandHubCircle name={company} size={150} />
        </div>

        {/* 3. Right Destination Fleet / Actors */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          {isStripe ? (
            <>
              <CreditCardVector size={84} color="#10B981" active={true} />
              <div style={{ display: 'flex', gap: 14 }}>
                <CreditCardVector size={58} color="#10B981" />
                <CreditCardVector size={58} color="#10B981" />
              </div>
              <span
                style={{
                  fontSize: 20,
                  fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
                  fontWeight: 900,
                  color: '#10B981',
                  letterSpacing: 1.5,
                  marginTop: 4,
                }}
              >
                MILLIONS OF CHARGES
              </span>
            </>
          ) : isNetflix ? (
            <>
              <ScreenTvVector size={84} color="#E50914" />
              <div style={{ display: 'flex', gap: 14 }}>
                <ScreenTvVector size={58} color="#E50914" />
                <ScreenTvVector size={58} color="#E50914" />
              </div>
              <span
                style={{
                  fontSize: 20,
                  fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
                  fontWeight: 900,
                  color: '#E50914',
                  letterSpacing: 1.5,
                  marginTop: 4,
                }}
              >
                250M STREAMERS
              </span>
            </>
          ) : isWhatsApp ? (
            <>
              <ChatBubbleVector size={80} color="#25D366" />
              <div style={{ display: 'flex', gap: 14 }}>
                <ChatBubbleVector size={56} color="#25D366" />
                <ChatBubbleVector size={56} color="#25D366" />
              </div>
              <span
                style={{
                  fontSize: 20,
                  fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
                  fontWeight: 900,
                  color: '#25D366',
                  letterSpacing: 1.5,
                  marginTop: 4,
                }}
              >
                100B MSGS / DAY
              </span>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Bottom Infrastructure: Server Gateway Cluster */}
      <div
        style={{
          marginTop: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
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
            {gatewayTitle}
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
            {gatewaySubtitle}
          </div>
        </div>
        <ServerRackVector size={80} />
        <ServerRackVector size={80} />
      </div>
    </div>
  );
};

