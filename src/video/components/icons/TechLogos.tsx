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
 * Official Brand SVG Vector Logos (Stripe, Uber, Netflix, WhatsApp, Discord, UPI).
 * Used under Nominative Fair Use for educational and technical architectural analysis.
 */
export const BrandLogo: React.FC<{
  company: string;
  size?: number;
  inBadge?: boolean;
}> = ({ company, size = 64, inBadge = false }) => {
  const norm = company.toLowerCase().trim();

  // 1. Stripe Official Logo
  if (norm.includes('stripe')) {
    return (
      <svg
        width={size * 1.1}
        height={size * 0.46}
        viewBox="0 0 512 214"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        style={{
          filter: inBadge ? 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4))' : 'drop-shadow(0 2px 8px rgba(99, 91, 255, 0.4))',
        }}
      >
        <path
          fill={inBadge ? '#FFFFFF' : '#635bff'}
          d="M512 110.08c0-36.409-17.636-65.138-51.342-65.138c-33.85 0-54.33 28.73-54.33 64.854c0 42.808 24.179 64.426 58.88 64.426c16.925 0 29.725-3.84 39.396-9.244v-28.445c-9.67 4.836-20.764 7.823-34.844 7.823c-13.796 0-26.027-4.836-27.591-21.618h69.547c0-1.85.284-9.245.284-12.658m-70.258-13.511c0-16.071 9.814-22.756 18.774-22.756c8.675 0 17.92 6.685 17.92 22.756zm-90.31-51.627c-13.939 0-22.899 6.542-27.876 11.094l-1.85-8.818h-31.288v165.83l35.555-7.537l.143-40.249c5.12 3.698 12.657 8.96 25.173 8.96c25.458 0 48.64-20.48 48.64-65.564c-.142-41.245-23.609-63.716-48.498-63.716m-8.534 97.991c-8.391 0-13.37-2.986-16.782-6.684l-.143-52.765c3.698-4.124 8.818-6.968 16.925-6.968c12.942 0 21.902 14.506 21.902 33.137c0 19.058-8.818 33.28-21.902 33.28M241.493 36.551l35.698-7.68V0l-35.698 7.538zm0 10.809h35.698v124.444h-35.698zm-38.257 10.524L200.96 47.36h-30.72v124.444h35.556V87.467c8.39-10.951 22.613-8.96 27.022-7.396V47.36c-4.551-1.707-21.191-4.836-29.582 10.524m-71.112-41.386l-34.702 7.395l-.142 113.92c0 21.05 15.787 36.551 36.836 36.551c11.662 0 20.195-2.133 24.888-4.693V140.8c-4.55 1.849-27.022 8.391-27.022-12.658V77.653h27.022V47.36h-27.022zM35.982 83.484c0-5.546 4.551-7.68 12.09-7.68c10.808 0 24.461 3.272 35.27 9.103V51.484c-11.804-4.693-23.466-6.542-35.27-6.542C19.2 44.942 0 60.018 0 85.192c0 39.252 54.044 32.995 54.044 49.92c0 6.541-5.688 8.675-13.653 8.675c-11.804 0-26.88-4.836-38.827-11.378v33.849c13.227 5.689 26.596 8.106 38.827 8.106c29.582 0 49.92-14.648 49.92-40.106c-.142-42.382-54.329-34.845-54.329-50.774"
        />
      </svg>
    );
  }

  // 2. Uber Official Logo (Simple Icons Pure White in badge, Black standalone)
  if (norm.includes('uber')) {
    return (
      <svg
        width={size * 0.92}
        height={size * 0.38}
        viewBox="0 7 24 10"
        preserveAspectRatio="xMidYMid meet"
        style={{
          filter: inBadge ? 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))' : undefined,
        }}
      >
        <path
          fill={inBadge ? '#FFFFFF' : '#000000'}
          d="M0 7.97v4.958c0 1.867 1.302 3.101 3 3.101.826 0 1.562-.316 2.094-.87v.736H6.27V7.97H5.082v4.888c0 1.257-.85 2.106-1.947 2.106-1.11 0-1.946-.827-1.946-2.106V7.971H0zm7.44 0v7.925h1.13v-.725c.521.532 1.257.86 2.06.86a3.006 3.006 0 0 0 3.034-3.01 3.01 3.01 0 0 0-3.033-3.024 2.86 2.86 0 0 0-2.049.861V7.971H7.439zm9.869 2.038c-1.687 0-2.965 1.37-2.965 3 0 1.72 1.334 3.01 3.066 3.01 1.053 0 1.913-.463 2.49-1.233l-.826-.611c-.43.577-.996.847-1.664.847-.973 0-1.753-.7-1.912-1.64h4.697v-.373c0-1.72-1.222-3-2.886-3zm6.295.068c-.634 0-1.098.294-1.381.758v-.713h-1.131v5.774h1.142V12.61c0-.894.544-1.47 1.291-1.47H24v-1.065h-.396zm-6.319.928c.85 0 1.564.588 1.756 1.47H15.52c.203-.882.916-1.47 1.765-1.47zm-6.732.012c1.086 0 1.98.883 1.98 2.004a1.993 1.993 0 0 1-1.98 2.001A1.989 1.989 0 0 1 8.56 13.02a1.99 1.99 0 0 1 1.992-2.004z"
        />
      </svg>
    );
  }

  // 3. Netflix Official Logo (Authentic 3D Red Ribbon N)
  if (norm.includes('netflix')) {
    return (
      <svg
        width={size * 0.72}
        height={size * 0.88}
        viewBox="0 0 256 256"
        style={{ filter: 'drop-shadow(0 4px 12px rgba(229, 9, 20, 0.5))' }}
      >
        <path fill="#b1060f" d="m141.676 41.275l-.067 38.361l-.068 38.361l-3.156-8.905l-4.078 85.402c4.01 11.324 6.158 17.369 6.182 17.393c8.366.417 19.345 1.54 24.398 2.502l.608-.328V41.275z" />
        <path fill="#e50914" d="m89.379 41.275l.135 172.789c6.402-.962 17.381-2.085 24.398-2.502l.608.328l-.068-170.615z" />
        <path fill="#e50914" d="m141.676 41.275l-52.297 172.789c6.402-.962 17.381-2.085 24.398-2.502l52.297-170.287z" opacity="0.9" />
      </svg>
    );
  }

  // 4. WhatsApp Official Logo
  if (norm.includes('whatsapp')) {
    return (
      <svg
        width={size * 0.85}
        height={size * 0.85}
        viewBox="0 0 256 258"
        style={{ filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3))' }}
      >
        <path fill="#25D366" d="m201.21 56.404c-19.243-19.263-44.827-29.871-72.072-29.882c-56.126 0-101.8 45.664-101.823 101.812c-.008 17.95 4.685 35.474 13.606 50.932l-14.453 52.784l53.999-14.164c14.908 8.132 31.644 12.421 48.647 12.427h.043c56.115 0 101.794-45.666 101.819-101.817c.012-27.214-10.575-52.808-29.766-72.092" />
        <path fill="#FFF" d="M178.688 152.012c-2.732-1.368-16.16-7.974-18.665-8.887c-2.507-.91-4.329-1.368-6.151 1.368c-1.823 2.734-7.062 8.887-8.658 10.71c-1.595 1.823-3.189 2.05-5.922.684c-2.733-1.368-11.537-4.254-21.977-13.56c-8.125-7.243-13.612-16.19-15.207-18.925c-1.595-2.734-.171-4.212 1.198-5.574c1.233-1.228 2.733-3.189 4.101-4.783c1.368-1.595 1.823-2.734 2.734-4.558c.911-1.823.456-3.418-.228-4.786c-.684-1.368-6.151-14.814-8.429-20.285c-2.217-5.328-4.47-4.606-6.151-4.693c-1.595-.081-3.418-.098-5.241-.098c-1.823 0-4.785.684-7.292 3.418c-2.507 2.734-9.569 9.342-9.569 22.784c0 13.442 9.797 26.43 11.164 28.254c1.368 1.823 19.28 29.439 46.708 41.291c6.523 2.82 11.617 4.504 15.589 5.766c6.551 2.08 12.513 1.787 17.227 1.082c5.255-.785 16.16-6.608 18.438-12.988c2.279-6.38 2.279-11.848 1.595-12.988c-.683-1.139-2.506-1.823-5.239-3.19" />
      </svg>
    );
  }

  // 5. Discord Official Logo
  if (norm.includes('discord')) {
    return (
      <svg
        width={size * 0.9}
        height={size * 0.72}
        viewBox="0 0 256 199"
        style={{ filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3))' }}
      >
        <path fill={inBadge ? '#FFFFFF' : '#5865F2'} d="M216.85 16.596A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.72-6.764 14.108c-22.18-3.348-44.183-3.348-66.027 0c-1.87-4.444-4.573-10.051-6.883-14.108A208.71 208.71 0 0 0 31.496 16.652C-9.35 77.854-.863 137.49 1.189 196.223c27.18 20.217 53.486 32.553 79.255 40.548c6.438-8.832 12.194-18.232 17.185-28.163c-9.489-3.595-18.529-8.233-27.027-13.82c2.316-1.688 4.57-3.463 6.726-5.293c51.98 24.168 108.354 24.168 159.582 0c2.186 1.848 4.44 3.623 6.756 5.293c-8.527 5.618-17.596 10.256-27.116 13.84c5.02 9.911 10.776 19.311 17.185 28.143c25.828-8.015 52.194-20.351 79.404-40.568c2.428-67.922 17.433-127.03-36.29-179.627ZM85.474 135.095c-12.656 0-23.056-11.66-23.056-25.96c0-14.3 10.16-26.015 23.056-26.015c13.016 0 23.416 11.77 23.056 26.015c0 14.3-10.16 25.96-23.056 25.96Zm85.051 0c-12.656 0-23.056-11.66-23.056-25.96c0-14.3 10.16-26.015 23.056-26.015c13.016 0 23.416 11.77 23.056 26.015c0 14.3-10.16 25.96-23.056 25.96Z" />
      </svg>
    );
  }

  // 6. UPI Official Logo
  if (norm.includes('upi')) {
    return (
      <svg width={size * 1.1} height={size * 0.75} viewBox="0 0 256 128">
        <path fill="#097939" d="M140 18l-30 92h28l30-92h-28z" />
        <path fill="#ED752E" d="M175 18l-30 92h28l30-92h-28z" />
        <text x="10" y="80" fontFamily="sans-serif" fontWeight="900" fontSize="56" fill={inBadge ? '#FFFFFF' : '#000000'}>UPI</text>
      </svg>
    );
  }

  // 7. LinkedIn Official Logo (Official White 'in' Glyph)
  if (norm.includes('linkedin')) {
    return (
      <svg
        width={size * 0.78}
        height={size * 0.78}
        viewBox="0 0 24 24"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        style={{ filter: inBadge ? 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4))' : undefined }}
      >
        <path
          fill={inBadge ? '#FFFFFF' : '#0A66C2'}
          d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"
        />
      </svg>
    );
  }

  // 8. OpenAI Official Logo (Authentic Rosette / Spiral Vector)
  if (norm.includes('openai') || norm.includes('chatgpt')) {
    return (
      <svg
        width={size * 0.76}
        height={size * 0.76}
        viewBox="0 0 24 24"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        style={{ filter: inBadge ? 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4))' : undefined }}
      >
        <path
          fill={inBadge ? '#FFFFFF' : '#10A37F'}
          d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"
        />
      </svg>
    );
  }

  // 9. Google / DeepMind Official Logo
  if (norm.includes('google') || norm.includes('deepmind')) {
    return (
      <svg
        width={size * 0.74}
        height={size * 0.74}
        viewBox="0 0 24 24"
        preserveAspectRatio="xMidYMid meet"
        style={{ filter: inBadge ? 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4))' : undefined }}
      >
        <path
          fill="#4285F4"
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
        />
      </svg>
    );
  }

  return (
    <span
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontWeight: 900,
        fontSize: size * 0.28,
        color: inBadge ? '#FFFFFF' : '#000000',
        letterSpacing: -0.5,
      }}
    >
      {company}
    </span>
  );
};

/**
 * Authentic Mobile App Icon Badge (iOS/Android Squircle) for Tech Giants.
 * Replaces generic circle with official branded app icon, glowing bevel, 3D sheen, and sub-label.
 */
export const BrandHubCircle: React.FC<{
  name: string;
  size?: number;
  bg?: string;
  minimal?: boolean;
}> = ({ name, size = 130, bg, minimal = false }) => {
  const norm = name.toLowerCase().trim();

  // Branded aesthetics for authentic app badge
  let bgGradient = 'linear-gradient(145deg, #1E293B 0%, #0F172A 100%)';
  let borderColor = 'rgba(255, 255, 255, 0.2)';
  let glowColor = 'rgba(56, 189, 248, 0.4)';
  let badgeLabel = name.toUpperCase();

  if (norm.includes('uber')) {
    bgGradient = 'linear-gradient(145deg, #111111 0%, #000000 100%)';
    borderColor = 'rgba(255, 255, 255, 0.24)';
    glowColor = 'rgba(255, 255, 255, 0.28)';
    badgeLabel = 'UBER APP';
  } else if (norm.includes('stripe')) {
    bgGradient = 'linear-gradient(135deg, #635BFF 0%, #4338CA 100%)';
    borderColor = 'rgba(255, 255, 255, 0.35)';
    glowColor = 'rgba(99, 91, 255, 0.65)';
    badgeLabel = 'STRIPE API';
  } else if (norm.includes('netflix')) {
    bgGradient = 'linear-gradient(145deg, #141414 0%, #000000 100%)';
    borderColor = 'rgba(229, 9, 20, 0.45)';
    glowColor = 'rgba(229, 9, 20, 0.6)';
    badgeLabel = 'NETFLIX APP';
  } else if (norm.includes('whatsapp')) {
    bgGradient = 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)';
    borderColor = 'rgba(255, 255, 255, 0.35)';
    glowColor = 'rgba(37, 211, 102, 0.6)';
    badgeLabel = 'WHATSAPP';
  } else if (norm.includes('discord')) {
    bgGradient = 'linear-gradient(135deg, #5865F2 0%, #404EED 100%)';
    borderColor = 'rgba(255, 255, 255, 0.35)';
    glowColor = 'rgba(88, 101, 242, 0.6)';
    badgeLabel = 'DISCORD';
  } else if (norm.includes('upi')) {
    bgGradient = 'linear-gradient(135deg, #0B132B 0%, #1C2541 100%)';
    borderColor = 'rgba(9, 121, 57, 0.55)';
    glowColor = 'rgba(9, 121, 57, 0.5)';
    badgeLabel = 'UPI GATEWAY';
  } else if (norm.includes('linkedin')) {
    bgGradient = 'linear-gradient(135deg, #0A66C2 0%, #004182 100%)';
    borderColor = 'rgba(255, 255, 255, 0.35)';
    glowColor = 'rgba(10, 102, 194, 0.65)';
    badgeLabel = 'LINKEDIN';
  } else if (norm.includes('openai') || norm.includes('chatgpt')) {
    bgGradient = 'linear-gradient(135deg, #10A37F 0%, #064E3B 100%)';
    borderColor = 'rgba(255, 255, 255, 0.35)';
    glowColor = 'rgba(16, 163, 127, 0.65)';
    badgeLabel = 'OPENAI';
  } else if (norm.includes('google') || norm.includes('deepmind')) {
    bgGradient = 'linear-gradient(145deg, #1F2937 0%, #111827 100%)';
    borderColor = 'rgba(255, 255, 255, 0.35)';
    glowColor = 'rgba(66, 133, 244, 0.6)';
    badgeLabel = 'GOOGLE';
  }

  const squircleRadius = Math.round(size * 0.24);

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
      }}
    >
      {/* Authentic App Icon Squircle */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: squircleRadius,
          background: bg || bgGradient,
          border: `2px solid ${borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 16px 36px rgba(0, 0, 0, 0.8), 0 0 45px ${glowColor}, inset 0 1px 2px rgba(255, 255, 255, 0.35)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 3D Glass Light Sheen */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '46%',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 100%)',
            borderRadius: `${squircleRadius}px ${squircleRadius}px 0 0`,
            pointerEvents: 'none',
          }}
        />

        {/* Authentic Brand App Logo */}
        <BrandLogo company={name} size={size * 0.78} inBadge={true} />
      </div>

      {/* Sleek Floating Identification Sub-Chip (hidden if minimal) */}
      {!minimal && (
        <div
          style={{
            position: 'absolute',
            bottom: -32,
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            backgroundColor: 'rgba(10, 14, 23, 0.92)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: 999,
            padding: '3px 12px',
            fontSize: 12,
            fontWeight: 800,
            fontFamily: 'monospace',
            letterSpacing: 1.5,
            color: '#F8FAFC',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {badgeLabel}
        </div>
      )}
    </div>
  );
};

export const BrandAppBadge = BrandHubCircle;

/**
 * Hand-drawn Doodle Credit Card Vector with chip & contactless waves.
 */
export const CreditCardVector: React.FC<{
  size?: number;
  color?: string;
  active?: boolean;
}> = ({ size = 72, color = '#10B981', active = true }) => {
  return (
    <svg
      width={size}
      height={size * 0.65}
      viewBox="0 0 100 65"
      fill="none"
      style={{
        filter: active ? `drop-shadow(0 0 12px ${color}88)` : undefined,
      }}
    >
      <rect
        x="4"
        y="4"
        width="92"
        height="57"
        rx="8"
        stroke={color}
        strokeWidth="3.5"
        fill="rgba(16, 185, 129, 0.12)"
      />
      <line x1="4" y1="18" x2="96" y2="18" stroke={color} strokeWidth="3" opacity="0.6" />
      <rect x="14" y="27" width="16" height="12" rx="3" fill="#FBBF24" opacity="0.9" />
      <path d="M38 30 A 5 5 0 0 1 38 36" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M42 27 A 9 9 0 0 1 42 39" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="48" r="2.5" fill={color} />
      <circle cx="24" cy="48" r="2.5" fill={color} />
      <circle cx="32" cy="48" r="2.5" fill={color} />
      <circle cx="40" cy="48" r="2.5" fill={color} />
    </svg>
  );
};

/**
 * Hand-drawn Chat Bubble Vector.
 */
export const ChatBubbleVector: React.FC<{ size?: number; color?: string }> = ({
  size = 64,
  color = '#25D366',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      style={{ filter: `drop-shadow(0 0 12px ${color}88)` }}
    >
      <path
        d="M12 16 C12 10 18 6 32 6 C46 6 52 10 52 16 C52 28 46 36 32 36 C27 36 21 38 14 44 C16 38 16 36 14 34 C12 30 12 24 12 16 Z"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(37, 211, 102, 0.12)"
      />
      <circle cx="24" cy="21" r="3" fill={color} />
      <circle cx="32" cy="21" r="3" fill={color} />
      <circle cx="40" cy="21" r="3" fill={color} />
    </svg>
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
import { DynamicIcon } from './DynamicIcon';

export const AutoTechIcon: React.FC<{
  name: string;
  size?: number;
  active?: boolean;
  svgDataUri?: string;
}> = ({ name, size = 64, active = false, svgDataUri }) => {
  if (svgDataUri) {
    return <DynamicIcon svgDataUri={svgDataUri} size={size} glow={active} />;
  }

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
