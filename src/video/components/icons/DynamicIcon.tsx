import React from 'react';
import { Img } from 'remotion';

interface DynamicIconProps {
  svgDataUri?: string;
  fallbackIcon?: string;
  size?: number;
  glow?: boolean;
  glowColor?: string;
  style?: React.CSSProperties;
}

/**
 * Renders dynamically resolved SVG icons (from Iconify or Gemini synthesis) with neon glow and crisp scaling.
 */
export const DynamicIcon: React.FC<DynamicIconProps> = ({
  svgDataUri,
  fallbackIcon = '⚡',
  size = 56,
  glow = true,
  glowColor = 'rgba(34, 211, 238, 0.5)',
  style,
}) => {
  if (svgDataUri && svgDataUri.startsWith('data:image/svg+xml')) {
    return (
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: glow ? `drop-shadow(0 0 14px ${glowColor})` : undefined,
          ...style,
        }}
      >
        <Img
          src={svgDataUri}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        fontSize: size * 0.7,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: glow ? `drop-shadow(0 0 14px ${glowColor})` : undefined,
        ...style,
      }}
    >
      {fallbackIcon}
    </div>
  );
};

