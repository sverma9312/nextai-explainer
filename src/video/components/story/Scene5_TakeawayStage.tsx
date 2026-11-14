import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { RedisLogo } from '../icons/TechLogos';

interface Scene5Props {
  rule: string;
  company: string;
  topicId?: string;
}

export const Scene5_TakeawayStage: React.FC<Scene5Props> = ({ rule, company, topicId = '' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isUber = company.toLowerCase().includes('uber') || topicId.includes('uber');
  const isStripe = company.toLowerCase().includes('stripe') || topicId.includes('stripe');
  const isNetflix = company.toLowerCase().includes('netflix') || topicId.includes('netflix');

  const pill1Label = isStripe ? 'LOCK' : isNetflix ? 'EDGE' : 'STORAGE';
  const pill1Value = isStripe ? 'Redis SETNX' : isNetflix ? 'Open Connect' : 'Redis Cluster';

  const pill2Label = isStripe ? 'CONSISTENCY' : isNetflix ? 'STREAMING' : 'INDEX';
  const pill2Value = isStripe ? 'Idempotency Key' : isNetflix ? 'FreeBSD Kernel' : 'Uber H3 Spatial';
  const pill2Icon = isStripe ? '🔑' : isNetflix ? '🍿' : '⬡';

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <div
      style={{
        position: 'relative',
        width: 920,
        height: 980,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${entrance})`,
        opacity: entrance,
      }}
    >
      {/* Golden Architectural Law Card */}
      <div
        style={{
          width: 880,
          backgroundColor: '#0C0E17',
          border: '3px solid #FBBF24',
          borderRadius: 36,
          padding: '48px 40px',
          boxShadow: '0 0 60px rgba(251, 191, 36, 0.35), 0 30px 60px rgba(0, 0, 0, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 28,
        }}
      >
        {/* Top Trophy/Law Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            backgroundColor: 'rgba(251, 191, 36, 0.15)',
            border: '2px solid #FBBF24',
            padding: '10px 24px',
            borderRadius: 999,
          }}
        >
          <span style={{ fontSize: 28 }}>⚡</span>
          <span
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: '#FBBF24',
              fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
              letterSpacing: 2,
            }}
          >
            SYSTEM DESIGN PRINCIPLE
          </span>
        </div>

        {/* The Golden Rule Statement */}
        <div
          style={{
            fontSize: 38,
            fontWeight: 900,
            color: '#FFFFFF',
            lineHeight: 1.45,
            fontFamily: '"Comic Sans MS", "Chalkboard SE", "Caveat", sans-serif',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)',
          }}
        >
          &ldquo;{rule}&rdquo;
        </div>

        {/* Tech Stack Pillars */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
            marginTop: 16,
            paddingTop: 28,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              backgroundColor: '#111422',
              padding: '12px 20px',
              borderRadius: 16,
              border: '1px solid rgba(220, 56, 45, 0.4)',
            }}
          >
            <RedisLogo size={44} glow={false} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, color: '#9CA3AF', fontFamily: 'monospace' }}>{pill1Label}</div>
              <div style={{ fontSize: 18, color: '#FFFFFF', fontWeight: 800 }}>{pill1Value}</div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              backgroundColor: '#111422',
              padding: '12px 20px',
              borderRadius: 16,
              border: '1px solid rgba(34, 211, 238, 0.4)',
            }}
          >
            <span style={{ fontSize: 32 }}>{pill2Icon}</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, color: '#9CA3AF', fontFamily: 'monospace' }}>{pill2Label}</div>
              <div style={{ fontSize: 18, color: '#FFFFFF', fontWeight: 800 }}>{pill2Value}</div>
            </div>
          </div>
        </div>

        {/* Studio Branding */}
        <div
          style={{
            fontSize: 16,
            color: '#A5F3FC',
            fontFamily: 'monospace',
            fontWeight: 800,
            letterSpacing: 2,
            marginTop: 8,
          }}
        >
          NEXTAI EXPLAINER • 60S ARCHITECTURE STUDIO
        </div>
      </div>
    </div>
  );
};

