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
  companySvgDataUri?: string;
  category?: string;
  visualEntities?: VisualEntity[];
  scaleMetric?: string;
}

export const Scene1_ContextStage: React.FC<Scene1Props> = ({ company, companySvgDataUri, visualEntities, scaleMetric }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const isLandscape = width > 1200;

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
  const pingX = interpolate(pingProgress, [0, 1], [220, isLandscape ? 1460 : 760]);

  const targetEntity = visualEntities?.find(
    (e) =>
      e.id === 'driver' ||
      e.id === 'db' ||
      e.role === 'database' ||
      e.iconQuery?.includes('car') ||
      e.iconQuery?.includes('database')
  );

  return (
    <div
      style={{
        position: 'relative',
        width: isLandscape ? 1720 : 980,
        height: isLandscape ? 720 : 1040,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isLandscape ? 20 : 0,
        transform: `scale(${entrance})`,
        opacity: entrance,
      }}
    >
      {/* Visual Canvas Box */}
      <div
        style={{
          position: 'relative',
          width: isLandscape ? 1680 : 920,
          height: isLandscape ? 440 : 600,
          backgroundColor: '#0A0C14',
          border: '2px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 32,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isLandscape ? '0 140px' : '0 60px',
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
            x2={isLandscape ? "1500" : "780"}
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

        {/* 1. Rider / User Entity */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, zIndex: 10 }}>
          <PersonVector size={isLandscape ? 110 : 120} color="#FFFFFF" label={userLabel} />
          <div
            style={{
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: 13,
              fontWeight: 800,
              color: '#38BDF8',
              letterSpacing: 1,
              fontFamily: 'monospace',
            }}
          >
            CLIENT APP
          </div>
        </div>

        {/* 2. Central Brand Hub Node */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, zIndex: 10 }}>
          <BrandHubCircle name={company} svgDataUri={companySvgDataUri} size={isLandscape ? 120 : 130} minimal={true} />
          <div
            style={{
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: 13,
              fontWeight: 800,
              color: '#FBBF24',
              letterSpacing: 1,
              fontFamily: 'monospace',
            }}
          >
            {company.toUpperCase()} CLOUD
          </div>
        </div>

        {/* 3. Target Actor / Resource Entity */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, zIndex: 10 }}>
          {targetEntity?.svgDataUri ? (
            <DynamicIcon
              svgDataUri={targetEntity.svgDataUri}
              size={isLandscape ? 110 : 120}
              glowColor="#10B981"
            />
          ) : isUber ? (
            <CarVector size={isLandscape ? 110 : 120} color="#10B981" active={true} />
          ) : isStripe ? (
            <CreditCardVector size={isLandscape ? 110 : 120} color="#635BFF" active={true} />
          ) : isNetflix ? (
            <ScreenTvVector size={isLandscape ? 110 : 120} color="#E50914" />
          ) : isWhatsApp ? (
            <ChatBubbleVector size={isLandscape ? 110 : 120} color="#25D366" />
          ) : (
            <ServerRackVector size={isLandscape ? 110 : 120} />
          )}
          <div
            style={{
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: 13,
              fontWeight: 800,
              color: '#34D399',
              letterSpacing: 1,
              fontFamily: 'monospace',
            }}
          >
            GLOBAL SCALE
          </div>
        </div>
      </div>

      {/* Gateway Telemetry Box */}
      <div
        style={{
          width: isLandscape ? 1680 : 920,
          marginTop: isLandscape ? 16 : 28,
          backgroundColor: '#0E131F',
          border: '1.5px solid rgba(34, 211, 238, 0.35)',
          borderRadius: 24,
          padding: isLandscape ? '16px 36px' : '22px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: 'rgba(34, 211, 238, 0.15)',
              border: '1px solid #22D3EE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
            }}
          >
            ⚡
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#FFFFFF', letterSpacing: 1 }}>
              {gatewayTitle}
            </div>
            <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 3 }}>
              {gatewaySubtitle}
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1.5px solid #10B981',
            borderRadius: 12,
            padding: '8px 18px',
            fontSize: 14,
            fontWeight: 800,
            color: '#10B981',
            fontFamily: 'monospace',
            letterSpacing: 1,
          }}
        >
          {scaleMetric || '< 100ms P99'}
        </div>
      </div>
    </div>
  );
};
