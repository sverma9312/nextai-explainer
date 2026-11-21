import React from 'react';
import { EXPLAINER_APP_ICON } from './assets.js';

export interface ExplainerPosterProps {
  [key: string]: unknown;
  company: string;
  companyLogo?: string;
  topicTitle: string;
  headlinePart1?: string;
  headlinePart2?: string;
  volNumber?: string;
  category?: string;
  scaleMetric?: string;
  summaryText?: string;
}

export const ExplainerPoster: React.FC<ExplainerPosterProps> = ({
  company = 'Uber',
  companyLogo = '🚗',
  topicTitle = 'How Uber Matches 1M Drivers in 100ms',
  headlinePart1,
  headlinePart2,
  volNumber = 'VOL. 01',
  category = 'ANIMATED SYSTEM DESIGN',
  scaleMetric = '1M+ Drivers · <100ms P99',
  summaryText = 'Deconstructing hexagonal spatial indexing and real-time candidate search in sixty seconds.',
}) => {
  // Derive signature editorial headline if not explicitly passed
  const displayPart1 = headlinePart1 || `${company || 'Software'} architecture,`;
  const displayPart2 = headlinePart2 || 'in sixty seconds.';

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        position: 'relative',
        backgroundColor: '#08090B',
        color: '#F4F4F6',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '110px 72px 90px 72px',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Google Fonts Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>

      {/* Ambient Radial Glow behind Centerpiece */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 72, 32, 0.12) 0%, rgba(8, 9, 11, 0) 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          right: -100,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(90, 209, 230, 0.06) 0%, rgba(8, 9, 11, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Background Subtle Cyber Matrix / Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(rgba(255, 255, 255, 0.06) 1.5px, transparent 1.5px)',
          backgroundSize: '40px 40px',
          opacity: 0.7,
          pointerEvents: 'none',
        }}
      />

      {/* Decorative Outer Editorial Frame */}
      <div
        style={{
          position: 'absolute',
          top: 36,
          left: 36,
          right: 36,
          bottom: 36,
          border: '1px solid rgba(255, 255, 255, 0.07)',
          pointerEvents: 'none',
        }}
      >
        {/* Sleek Corner Accents */}
        <div style={{ position: 'absolute', top: -2, left: -2, width: 28, height: 28, borderTop: '3px solid #FF4820', borderLeft: '3px solid #FF4820' }} />
        <div style={{ position: 'absolute', top: -2, right: -2, width: 28, height: 28, borderTop: '3px solid #FF4820', borderRight: '3px solid #FF4820' }} />
        <div style={{ position: 'absolute', bottom: -2, left: -2, width: 28, height: 28, borderBottom: '3px solid #FF4820', borderLeft: '3px solid #FF4820' }} />
        <div style={{ position: 'absolute', bottom: -2, right: -2, width: 28, height: 28, borderBottom: '3px solid #FF4820', borderRight: '3px solid #FF4820' }} />
      </div>

      {/* ========================================================= */}
      {/* 1. TOP HEADER BRAND BAR */}
      {/* ========================================================= */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        {/* Explainer App Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 18,
              backgroundColor: '#0E1015',
              border: '1.5px solid rgba(255, 72, 32, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(255, 72, 32, 0.3)',
              overflow: 'hidden',
            }}
          >
            <img
              src={EXPLAINER_APP_ICON}
              alt="NextAI Explainer App Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', color: '#F4F4F6' }}>
                Explainer
              </span>
              <span style={{ color: '#626775', fontSize: 18, fontFamily: "'JetBrains Mono', monospace" }}>/</span>
              <span
                style={{
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: '0.12em',
                  color: '#9CA1B0',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                System Design
              </span>
            </div>
            <div
              style={{
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '0.15em',
                color: '#626775',
                textTransform: 'uppercase',
                marginTop: 2,
              }}
            >
              NextAI Apps Studio
            </div>
          </div>
        </div>

        {/* Live Badge */}
        <div
          style={{
            padding: '8px 20px',
            borderRadius: 30,
            background: 'rgba(255, 72, 32, 0.08)',
            border: '1px solid rgba(255, 72, 32, 0.3)',
            color: '#FF4820',
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#FF4820',
              boxShadow: '0 0 10px #FF4820',
            }}
          />
          {volNumber}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. CENTER PIECE (OPTIMIZED FOR 1:1 INSTAGRAM GRID CROP)    */}
      {/* ========================================================= */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          zIndex: 10,
          margin: 'auto 0',
          width: '100%',
        }}
      >
        {/* Eyebrow Label matching website */}
        <div
          style={{
            fontSize: 16,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
            letterSpacing: '0.18em',
            color: '#7E8597',
            textTransform: 'uppercase',
            marginBottom: 24,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span>{volNumber} — {category}</span>
        </div>

        {/* Signature Editorial Headline */}
        <h1
          style={{
            fontFamily: "'Instrument Serif', 'Playfair Display', Georgia, serif",
            fontSize: 100,
            fontWeight: 400,
            lineHeight: 1.04,
            letterSpacing: '-0.02em',
            color: '#F4F4F6',
            margin: '0 0 40px 0',
            textWrap: 'balance',
          }}
        >
          {displayPart1}
          <br />
          <span
            style={{
              fontStyle: 'italic',
              color: '#FF4820',
              display: 'inline-block',
            }}
          >
            {displayPart2}
          </span>
        </h1>

        {/* Topic Console Showcase Card matching website design */}
        <div
          style={{
            width: '100%',
            backgroundColor: '#0E1015',
            border: '1px solid #1C1F28',
            borderRadius: 20,
            padding: '36px 36px',
            boxSizing: 'border-box',
            boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {/* Top Tag & Metric Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            {/* Topic Company Tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 30,
                padding: '8px 18px',
                fontSize: 16,
                fontWeight: 700,
                color: '#F4F4F6',
              }}
            >
              <span>{companyLogo}</span>
              <span style={{ letterSpacing: '0.04em' }}>{company.toUpperCase()} ARCHITECTURE</span>
            </div>

            {/* Scale Metric Pill */}
            {scaleMetric && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(255, 72, 32, 0.1)',
                  border: '1px solid rgba(255, 72, 32, 0.35)',
                  borderRadius: 30,
                  padding: '8px 18px',
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  color: '#FF4820',
                  letterSpacing: '0.04em',
                }}
              >
                <span>⚡</span>
                <span>{scaleMetric}</span>
              </div>
            )}
          </div>

          {/* Specific Topic Title */}
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
            }}
          >
            {topicTitle.replace(/#Shorts/gi, '').trim()}
          </div>

          {/* Subtitle / Problem Hook */}
          {summaryText && (
            <div
              style={{
                fontSize: 19,
                color: '#9CA1B0',
                lineHeight: 1.55,
                borderTop: '1px solid #1C1F28',
                paddingTop: 18,
              }}
            >
              {summaryText}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. BOTTOM FOOTER BAR                                      */}
      {/* ========================================================= */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: 28,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#FF4820',
              boxShadow: '0 0 10px #FF4820',
            }}
          />
          <span
            style={{
              fontSize: 15,
              fontFamily: "'JetBrains Mono', monospace",
              color: '#FF4820',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          >
            explainer.nextai-apps.com
          </span>
        </div>

        <div
          style={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            color: '#626775',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          60-Second Architecture
        </div>
      </div>
    </div>
  );
};
