import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface HeaderBannerProps {
  company: string;
  companyLogo: string;
  title: string;
  scaleMetric: string;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  company,
  companyLogo,
  title,
  scaleMetric,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const translateY = interpolate(entrance, [0, 1], [-80, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 80,
        left: 50,
        right: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        transform: `translateY(${translateY}px)`,
        opacity,
        zIndex: 10,
      }}
    >
      {/* Top Tag Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 999,
            padding: '8px 20px',
            backdropFilter: 'blur(10px)',
          }}
        >
          <span style={{ fontSize: 24 }}>{companyLogo}</span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              fontFamily: 'sans-serif',
            }}
          >
            {company} ARCHITECTURE
          </span>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: 999,
            padding: '8px 18px',
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 10px #10B981',
            }}
          />
          <span
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: '#34D399',
              fontFamily: 'monospace',
              letterSpacing: '0.04em',
            }}
          >
            {scaleMetric}
          </span>
        </div>
      </div>

      {/* Main Title Banner */}
      <h1
        style={{
          fontSize: 48,
          fontWeight: 900,
          color: '#FFFFFF',
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          margin: 0,
          fontFamily: 'sans-serif',
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
        }}
      >
        {title}
      </h1>
    </div>
  );
};

