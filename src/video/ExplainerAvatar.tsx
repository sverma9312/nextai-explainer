import React from 'react';

export const ExplainerAvatar: React.FC = () => {
  return (
    <div
      style={{
        width: 1024,
        height: 1024,
        backgroundColor: '#0C0F17',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Subtle Background Glow */}
      <div
        style={{
          position: 'absolute',
          width: 650,
          height: 650,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 184, 0, 0.09) 0%, rgba(0, 217, 245, 0.05) 45%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Content Container (Safe within circular crop) */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: -15,
        }}
      >
        {/* Bold 60s Hero */}
        <div
          style={{
            fontSize: 340,
            fontWeight: 900,
            color: '#FFB800',
            lineHeight: 0.88,
            letterSpacing: '-0.04em',
            textShadow: '0 4px 30px rgba(255, 184, 0, 0.28)',
            userSelect: 'none',
          }}
        >
          60s
        </div>

        {/* Enhanced Microservice Architecture Pipeline Bus */}
        <div
          style={{
            marginTop: 52,
            width: 620,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Robust Connecting Bus Line */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 20,
              right: 20,
              height: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              borderRadius: 4,
              transform: 'translateY(-50%)',
              zIndex: 0,
              boxShadow: '0 0 12px rgba(255, 255, 255, 0.25)',
            }}
          />

          {/* Node 1: Ingestion / Gateway (Violet) */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              width: 66,
              height: 66,
              borderRadius: '50%',
              backgroundColor: '#818CF8',
              boxShadow: '0 0 22px rgba(129, 140, 248, 0.55), 0 4px 12px rgba(0, 0, 0, 0.5)',
            }}
          />

          {/* Node 2: Cache / Queue Cluster (Cyber Cyan Squircle) */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              width: 72,
              height: 72,
              borderRadius: 20,
              backgroundColor: '#00D9F5',
              boxShadow: '0 0 26px rgba(0, 217, 245, 0.6), 0 4px 14px rgba(0, 0, 0, 0.5)',
            }}
          />

          {/* Node 3: Center Core Engine (Electric Mint - Hero Node) */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              width: 76,
              height: 76,
              borderRadius: '50%',
              backgroundColor: '#00F5A0',
              boxShadow: '0 0 32px rgba(0, 245, 160, 0.7), 0 4px 16px rgba(0, 0, 0, 0.5)',
            }}
          />

          {/* Node 4: Distributed Store / DB (High-Tech Teal) */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              width: 66,
              height: 66,
              borderRadius: '50%',
              backgroundColor: '#06B6D4',
              boxShadow: '0 0 22px rgba(6, 182, 212, 0.55), 0 4px 12px rgba(0, 0, 0, 0.5)',
            }}
          />

          {/* Node 5: Output / Consumer (Punchy Coral Pink Accent) */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              width: 66,
              height: 66,
              borderRadius: '50%',
              backgroundColor: '#F43F5E',
              boxShadow: '0 0 24px rgba(244, 63, 94, 0.6), 0 4px 12px rgba(0, 0, 0, 0.5)',
            }}
          />
        </div>

        {/* High-Legibility ARCHITECTURE Label */}
        <div
          style={{
            marginTop: 54,
            fontSize: 50,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '0.34em',
            textIndent: '0.34em', // Compensates for letter-spacing on last char to center perfectly
            textTransform: 'uppercase',
            textShadow: '0 2px 14px rgba(0, 0, 0, 0.9)',
            userSelect: 'none',
          }}
        >
          ARCHITECTURE
        </div>
      </div>
    </div>
  );
};
