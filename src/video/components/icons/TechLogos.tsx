import React from 'react';

/**
 * Official Layered 3D Red Cube Stack Logo for Redis.
 */
export const RedisLogo: React.FC<{ size?: number; glow?: boolean }> = ({ size = 64, glow = true }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: glow ? 'drop-shadow(0 0 16px rgba(220, 56, 45, 0.6))' : undefined,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        {/* Bottom Layer */}
        <polygon points="50,92 14,72 50,52 86,72" fill="#881515" />
        <polygon points="14,72 50,92 50,78 14,58" fill="#A81C1C" />
        <polygon points="86,72 50,92 50,78 86,58" fill="#5F0D0D" />

        {/* Middle Layer */}
        <polygon points="50,74 14,54 50,34 86,54" fill="#C92121" />
        <polygon points="14,54 50,74 50,60 14,40" fill="#E62C2C" />
        <polygon points="86,54 50,74 50,60 86,40" fill="#9C1717" />

        {/* Top Layer */}
        <polygon points="50,56 14,36 50,16 86,36" fill="#EA3232" />
        <polygon points="14,36 50,56 50,44 14,24" fill="#FF4B4B" />
        <polygon points="86,36 50,56 50,44 86,24" fill="#B71E1E" />
        {/* Top Face Highlight */}
        <polygon points="50,16 14,36 50,56 86,36" fill="#D82C2C" opacity="0.95" />
        {/* Center Accent Dots (Cube Grid) */}
        <circle cx="36" cy="33" r="3.5" fill="#FFFFFF" opacity="0.85" />
        <circle cx="64" cy="33" r="3.5" fill="#FFFFFF" opacity="0.85" />
        <circle cx="50" cy="41" r="3.5" fill="#FFFFFF" opacity="0.95" />
      </svg>
    </div>
  );
};

/**
 * Official Apache Kafka Vector Logo (3 connected circular broker nodes).
 */
export const KafkaLogo: React.FC<{ size?: number }> = ({ size = 64 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="22" r="14" fill="#231F20" stroke="#FFFFFF" strokeWidth="4" />
      <circle cx="24" cy="74" r="14" fill="#231F20" stroke="#FFFFFF" strokeWidth="4" />
      <circle cx="76" cy="74" r="14" fill="#231F20" stroke="#FFFFFF" strokeWidth="4" />
      <line x1="50" y1="36" x2="28" y2="60" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
      <line x1="50" y1="36" x2="72" y2="60" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
      <line x1="38" y1="74" x2="62" y2="74" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
      <circle cx="50" cy="22" r="6" fill="#000000" />
      <circle cx="24" cy="74" r="6" fill="#000000" />
      <circle cx="76" cy="74" r="6" fill="#000000" />
    </svg>
  );
};

/**
 * PostgreSQL Official Vector Logo.
 */
export const PostgresLogo: React.FC<{ size?: number }> = ({ size = 64 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path
        d="M50 12C32 12 20 25 20 42C20 58 30 68 40 76C38 82 32 86 24 88C35 88 44 82 48 76C54 78 60 78 66 74C78 66 84 54 84 38C84 22 70 12 50 12Z"
        fill="#336791"
        stroke="#FFFFFF"
        strokeWidth="3"
      />
      <circle cx="38" cy="38" r="4" fill="#FFFFFF" />
    </svg>
  );
};

/**
 * Sleek, relatable outlined yellow/gold Car Vector matching the reference video.
 */
export const CarVector: React.FC<{
  size?: number;
  color?: string;
  active?: boolean;
}> = ({ size = 60, color = '#FBBF24', active = false }) => {
  return (
    <div
      style={{
        width: size,
        height: size * 0.6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: active ? `drop-shadow(0 0 12px ${color})` : undefined,
      }}
    >
      <svg
        width={size}
        height={size * 0.6}
        viewBox="0 0 120 72"
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Car Cabin & Body Contour */}
        <path d="M12 50 L26 50 C28 36, 46 36, 48 50 L72 50 C74 36, 92 36, 94 50 L108 50 C114 50, 116 44, 114 38 L104 30 L84 14 L42 14 L24 30 L12 36 C8 38, 8 46, 12 50 Z" />
        {/* Wheels */}
        <circle cx="37" cy="50" r="10" stroke={color} strokeWidth="6" fill="#07080C" />
        <circle cx="83" cy="50" r="10" stroke={color} strokeWidth="6" fill="#07080C" />
        <circle cx="37" cy="50" r="3" fill={color} />
        <circle cx="83" cy="50" r="3" fill={color} />
        {/* Windows Divider */}
        <line x1="60" y1="16" x2="60" y2="34" stroke={color} strokeWidth="5" />
        {/* Headlight beam glow */}
        {active && <line x1="114" y1="38" x2="128" y2="40" stroke="#FDE047" strokeWidth="4" opacity="0.8" />}
      </svg>
    </div>
  );
};

/**
 * Stick Figure Person holding a smartphone ("YOU" / "USER") matching the reference video.
 */
export const PersonVector: React.FC<{
  size?: number;
  color?: string;
  label?: string;
}> = ({ size = 110, color = '#22D3EE', label = 'YOU' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg
        width={size * 0.75}
        height={size}
        viewBox="0 0 80 120"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Head */}
        <circle cx="35" cy="20" r="14" stroke={color} strokeWidth="5" />
        {/* Torso */}
        <line x1="35" y1="34" x2="35" y2="76" stroke={color} strokeWidth="5" />
        {/* Left Arm (Relaxed) */}
        <line x1="35" y1="46" x2="16" y2="68" stroke={color} strokeWidth="5" />
        {/* Right Arm (Holding Smartphone) */}
        <line x1="35" y1="46" x2="52" y2="52" stroke={color} strokeWidth="5" />
        {/* Smartphone */}
        <rect
          x="52"
          y="42"
          width="16"
          height="24"
          rx="3"
          stroke={color}
          strokeWidth="4"
          fill="#07080C"
        />
        <circle cx="60" cy="62" r="1.5" fill={color} />
        {/* Legs */}
        <line x1="35" y1="76" x2="18" y2="114" stroke={color} strokeWidth="5" />
        <line x1="35" y1="76" x2="52" y2="114" stroke={color} strokeWidth="5" />
      </svg>
      {label && (
        <span
          style={{
            marginTop: 4,
            fontSize: 22,
            fontFamily: '"Comic Sans MS", "Chalkboard SE", "Caveat", cursive, sans-serif',
            fontWeight: 900,
            color,
            letterSpacing: 2,
            textShadow: `0 0 12px ${color}88`,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};

/**
 * Sleek Modern Server Chassis Rack with blinking LED activity indicators.
 */
export const ServerRackVector: React.FC<{ size?: number }> = ({ size = 80 }) => {
  return (
    <svg
      width={size * 0.7}
      height={size}
      viewBox="0 0 70 100"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="3"
      strokeLinecap="round"
    >
      <rect x="6" y="8" width="58" height="84" rx="8" fill="#11131A" stroke="#FFFFFF" strokeWidth="4" />
      {/* Unit 1 */}
      <line x1="14" y1="26" x2="44" y2="26" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
      <circle cx="52" cy="26" r="3" fill="#22D3EE" />
      <line x1="10" y1="36" x2="60" y2="36" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      {/* Unit 2 */}
      <line x1="14" y1="48" x2="44" y2="48" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
      <circle cx="52" cy="48" r="3" fill="#10B981" />
      <line x1="10" y1="58" x2="60" y2="58" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      {/* Unit 3 */}
      <line x1="14" y1="70" x2="44" y2="70" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
      <circle cx="52" cy="70" r="3" fill="#F59E0B" />
      <line x1="10" y1="80" x2="60" y2="80" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
    </svg>
  );
};

/**
 * Teal Map Location Pin with optional pulse ring.
 */
export const MapPinVector: React.FC<{ size?: number; color?: string; label?: string }> = ({
  size = 54,
  color = '#22D3EE',
  label,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size * 1.2} viewBox="0 0 60 72" fill="none">
        <path
          d="M30 6C16.7 6 6 16.7 6 30C6 46 30 68 30 68C30 68 54 46 54 30C54 16.7 43.3 6 30 6Z"
          fill={color}
          stroke="#07080C"
          strokeWidth="3"
        />
        <circle cx="30" cy="28" r="8" fill="#07080C" />
      </svg>
      {label && (
        <span
          style={{
            marginTop: 2,
            fontSize: 20,
            fontFamily: '"Comic Sans MS", "Chalkboard SE", "Caveat", cursive, sans-serif',
            fontWeight: 900,
            color,
            letterSpacing: 1.5,
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
};

/**
 * Clean Central Hub Brand Circle (e.g. Uber, Netflix, WhatsApp).
 */
export const BrandHubCircle: React.FC<{
  name: string;
  size?: number;
  bg?: string;
  textColor?: string;
}> = ({ name, size = 110, bg = '#FFFFFF', textColor = '#000000' }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 40px rgba(255, 255, 255, 0.45)',
        zIndex: 10,
      }}
    >
      <span
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontWeight: 900,
          fontSize: size * 0.28,
          color: textColor,
          letterSpacing: -0.5,
        }}
      >
        {name}
      </span>
    </div>
  );
};

/**
 * 3D Tiered Database Cylinder Vector with LED storage activity rings.
 */
export const DatabaseCylinderVector: React.FC<{ size?: number; color?: string }> = ({
  size = 64,
  color = '#38BDF8',
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Top Platter */}
      <ellipse cx="50" cy="24" rx="36" ry="14" fill="#0E1726" stroke={color} strokeWidth="5" />
      <ellipse cx="50" cy="24" rx="26" ry="9" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
      {/* Middle Cylinder Body */}
      <path
        d="M14 24 V52 C14 60 30 66 50 66 C70 66 86 60 86 52 V24"
        fill="#07090E"
        stroke={color}
        strokeWidth="5"
      />
      <ellipse cx="50" cy="52" rx="36" ry="14" stroke={color} strokeWidth="4" />
      {/* Bottom Cylinder Body */}
      <path
        d="M14 52 V76 C14 84 30 90 50 90 C70 90 86 84 86 76 V52"
        fill="#07090E"
        stroke={color}
        strokeWidth="5"
      />
      {/* Activity Blinking LEDs */}
      <circle cx="28" cy="40" r="3" fill="#10B981" />
      <circle cx="28" cy="68" r="3" fill="#10B981" />
    </svg>
  );
};

/**
 * High-Throughput Edge Appliance / CDN Hardware Box with fiber optic port arrays.
 */
export const CdnEdgeBoxVector: React.FC<{ size?: number; color?: string }> = ({
  size = 64,
  color = '#E11D48',
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect x="10" y="25" width="80" height="50" rx="8" fill="#10131C" stroke={color} strokeWidth="5" />
      {/* Fiber Optics Array */}
      <circle cx="26" cy="42" r="5" fill="#22D3EE" />
      <circle cx="42" cy="42" r="5" fill="#22D3EE" />
      <circle cx="58" cy="42" r="5" fill="#22D3EE" />
      <circle cx="74" cy="42" r="5" fill="#22D3EE" />
      {/* Data In / Out Wave */}
      <line x1="20" y1="58" x2="80" y2="58" stroke="rgba(255,255,255,0.3)" strokeWidth="3" strokeDasharray="4 4" />
      <circle cx="82" cy="35" r="2.5" fill="#10B981" />
    </svg>
  );
};

/**
 * 4K Smart TV / Display Screen Vector showing glowing incoming video stream.
 */
export const ScreenTvVector: React.FC<{ size?: number; color?: string }> = ({
  size = 64,
  color = '#F43F5E',
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect x="12" y="18" width="76" height="52" rx="4" fill="#0A0C13" stroke={color} strokeWidth="5" />
      {/* Video Content Glow */}
      <rect x="20" y="26" width="60" height="36" rx="2" fill="rgba(244, 63, 94, 0.15)" />
      <polygon points="46,38 58,44 46,50" fill={color} />
      {/* TV Stand */}
      <line x1="50" y1="70" x2="50" y2="82" stroke={color} strokeWidth="5" />
      <line x1="36" y1="82" x2="64" y2="82" stroke={color} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
};

/**
 * Automatic Tech & Actor Icon Resolver:
 * Takes any system design component or service name and automatically renders
 * the corresponding authentic SVG vector or official tech logo.
 */
export const AutoTechIcon: React.FC<{
  name: string;
  size?: number;
  active?: boolean;
}> = ({ name, size = 64, active = false }) => {
  const norm = name.toLowerCase();

  if (norm.includes('redis')) {
    return <RedisLogo size={size} glow={active} />;
  }
  if (norm.includes('kafka')) {
    return <KafkaLogo size={size} />;
  }
  if (norm.includes('postgres') || norm.includes('sql') || norm.includes('relational')) {
    return <PostgresLogo size={size} />;
  }
  if (
    norm.includes('db') ||
    norm.includes('database') ||
    norm.includes('cassandra') ||
    norm.includes('docstore') ||
    norm.includes('store') ||
    norm.includes('storage') ||
    norm.includes('dynamo') ||
    norm.includes('mongo')
  ) {
    return <DatabaseCylinderVector size={size} />;
  }
  if (
    norm.includes('cdn') ||
    norm.includes('open connect') ||
    norm.includes('oca') ||
    norm.includes('edge') ||
    norm.includes('appliance') ||
    norm.includes('cloudflare')
  ) {
    return <CdnEdgeBoxVector size={size} />;
  }
  if (norm.includes('tv') || norm.includes('screen') || norm.includes('display')) {
    return <ScreenTvVector size={size} />;
  }
  if (norm.includes('car') || norm.includes('driver') || norm.includes('vehicle') || norm.includes('taxi')) {
    return <CarVector size={size} active={active} />;
  }
  if (
    norm.includes('user') ||
    norm.includes('rider') ||
    norm.includes('person') ||
    norm.includes('client') ||
    norm.includes('phone')
  ) {
    return <PersonVector size={size} />;
  }
  if (norm.includes('h3') || norm.includes('pin') || norm.includes('location') || norm.includes('geo')) {
    return <MapPinVector size={size} />;
  }

  // Default: High-density server rack vector
  return <ServerRackVector size={size} />;
};
