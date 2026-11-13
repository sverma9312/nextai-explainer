import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CarVector, MapPinVector, RedisLogo } from '../icons/TechLogos';
import { DynamicIcon } from '../icons/DynamicIcon';
import type { VisualEntity } from '../../../schema/types';

interface HexagonGridStageProps {
  sceneStep: 3 | 4; // Scene 3 (Breakthrough/Redis) or Scene 4 (Neighbor Search/Dispatch)
  visualEntities?: VisualEntity[];
}

/**
 * Computes SVG points for a regular pointy-topped hexagon.
 */
function getHexPoints(cx: number, cy: number, r: number): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angleDeg = 60 * i - 30;
    const angleRad = (Math.PI / 180) * angleDeg;
    const x = cx + r * Math.cos(angleRad);
    const y = cy + r * Math.sin(angleRad);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(' ');
}

// 19-cell Honeycomb Layout coordinates (center + 1-ring + 2-ring)
const HEX_R = 64;
const DX = Math.sqrt(3) * HEX_R;
const DY = 1.5 * HEX_R;

interface CellDef {
  id: number;
  col: number;
  row: number;
  hasCar?: boolean;
  carId?: string;
  isCenter?: boolean;
  isNeighbor?: boolean; // 1-ring neighbor
}

const CELLS: CellDef[] = [
  // Center (Rider "YOU")
  { id: 0, col: 0, row: 0, isCenter: true },

  // 1-Ring Neighbors (Immediate K-ring 1)
  { id: 1, col: 1, row: 0, hasCar: true, carId: 'drv_8241', isNeighbor: true },
  { id: 2, col: 0.5, row: 1, hasCar: true, carId: 'drv_1937', isNeighbor: true },
  { id: 3, col: -0.5, row: 1, isNeighbor: true },
  { id: 4, col: -1, row: 0, hasCar: true, carId: 'drv_5506', isNeighbor: true },
  { id: 5, col: -0.5, row: -1, isNeighbor: true },
  { id: 6, col: 0.5, row: -1, hasCar: true, carId: 'drv_3872', isNeighbor: true },

  // 2-Ring Outer Hexagons
  { id: 7, col: 2, row: 0, hasCar: true, carId: 'drv_9901' },
  { id: 8, col: 1.5, row: 1, hasCar: true, carId: 'drv_4120' },
  { id: 9, col: 1, row: 2, hasCar: true, carId: 'drv_7200' },
  { id: 10, col: 0, row: 2, hasCar: true, carId: 'drv_1189' },
  { id: 11, col: -1, row: 2, hasCar: true, carId: 'drv_8812' },
  { id: 12, col: -1.5, row: 1, hasCar: true, carId: 'drv_3321' },
  { id: 13, col: -2, row: 0, hasCar: true, carId: 'drv_6540' },
  { id: 14, col: -1.5, row: -1, hasCar: true, carId: 'drv_2091' },
  { id: 15, col: -1, row: -2, hasCar: true, carId: 'drv_5419' },
  { id: 16, col: 0, row: -2, hasCar: true, carId: 'drv_7720' },
  { id: 17, col: 1, row: -2, hasCar: true, carId: 'drv_9011' },
  { id: 18, col: 1.5, row: -1, hasCar: true, carId: 'drv_4490' },
];

export const HexagonGridStage: React.FC<HexagonGridStageProps> = ({ sceneStep, visualEntities }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const redisEntity = visualEntities?.find(
    (e) => e.id === 'redis' || e.iconQuery?.includes('redis') || e.label?.toLowerCase().includes('redis')
  );
  const carEntity = visualEntities?.find(
    (e) => e.id === 'driver' || e.iconQuery?.includes('car') || e.iconQuery?.includes('vehicle')
  );

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const originX = 490;
  const originY = 320;

  // Radar wave pulse for Scene 4
  const pulseScale = (frame % 45) / 45;
  const pulseOpacity = 1 - pulseScale;

  return (
    <div
      style={{
        position: 'relative',
        width: 980,
        height: 1100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `scale(${entrance})`,
        opacity: entrance,
      }}
    >
      {/* 1. Honeycomb SVG Canvas */}
      <div style={{ position: 'relative', width: 980, height: 640 }}>
        <svg width="980" height="640" style={{ position: 'absolute', top: 0, left: 0 }}>
          {/* Radar Scan Wave on Scene 4 */}
          {sceneStep === 4 && (
            <circle
              cx={originX}
              cy={originY}
              r={70 + pulseScale * 140}
              fill="none"
              stroke="#22D3EE"
              strokeWidth={3}
              opacity={pulseOpacity}
            />
          )}

          {/* Winning Match Line in Scene 4 */}
          {sceneStep === 4 && (
            <line
              x1={originX}
              y1={originY}
              x2={originX + 0.5 * DX}
              y2={originY - DY}
              stroke="#10B981"
              strokeWidth={5}
              strokeDasharray="6 6"
            />
          )}

          {/* Hexagon Cells */}
          {CELLS.map((cell) => {
            const cx = originX + cell.col * DX;
            const cy = originY + cell.row * DY;
            const points = getHexPoints(cx, cy, HEX_R);

            const isHighlighted =
              cell.isCenter || (sceneStep === 4 && cell.isNeighbor);
            const isMatch = sceneStep === 4 && cell.id === 6;

            return (
              <polygon
                key={cell.id}
                points={points}
                fill={
                  isMatch
                    ? 'rgba(16, 185, 129, 0.22)'
                    : isHighlighted
                    ? 'rgba(34, 211, 238, 0.12)'
                    : 'rgba(255, 255, 255, 0.02)'
                }
                stroke={
                  isMatch
                    ? '#10B981'
                    : isHighlighted
                    ? '#22D3EE'
                    : 'rgba(255, 255, 255, 0.22)'
                }
                strokeWidth={isMatch ? 3.5 : isHighlighted ? 2.5 : 1.5}
              />
            );
          })}
        </svg>

        {/* Dynamic Entities inside Hexagons */}
        {CELLS.map((cell) => {
          const cx = originX + cell.col * DX;
          const cy = originY + cell.row * DY;

          if (cell.isCenter) {
            return (
              <div
                key={cell.id}
                style={{
                  position: 'absolute',
                  left: cx,
                  top: cy - 14,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 20,
                }}
              >
                <MapPinVector size={50} color="#22D3EE" label="YOU" />
              </div>
            );
          }

          if (cell.hasCar) {
            const isDimmed = sceneStep === 4 && !cell.isNeighbor;
            const isWinningCar = sceneStep === 4 && cell.id === 6;

            return (
              <div
                key={cell.id}
                style={{
                  position: 'absolute',
                  left: cx,
                  top: cy,
                  transform: 'translate(-50%, -50%)',
                  opacity: isDimmed ? 0.25 : 1,
                  transition: 'opacity 0.4s ease',
                  zIndex: isWinningCar ? 25 : 10,
                }}
              >
                {carEntity?.svgDataUri ? (
                  <DynamicIcon
                    svgDataUri={carEntity.svgDataUri}
                    size={42}
                    glowColor={isWinningCar ? '#10B981' : '#FBBF24'}
                  />
                ) : (
                  <CarVector
                    size={46}
                    color={isWinningCar ? '#10B981' : '#FBBF24'}
                    active={isWinningCar}
                  />
                )}
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* 2. Bottom Content Cards */}
      {sceneStep === 3 ? (
        /* SCENE 3: In-Memory Storage with DYNAMIC REAL REDIS LOGO & Key-Value Table */
        <div
          style={{
            width: 860,
            marginTop: 10,
            backgroundColor: '#0D0F17',
            border: '2px solid rgba(220, 56, 45, 0.5)',
            borderRadius: 24,
            padding: '20px 28px',
            boxShadow: '0 0 40px rgba(220, 56, 45, 0.25), 0 20px 40px rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {/* Header row: Real Redis Logo + Storage Title + Microsecond Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {redisEntity?.svgDataUri ? (
                <DynamicIcon svgDataUri={redisEntity.svgDataUri} size={56} glowColor="#DC382D" />
              ) : (
                <RedisLogo size={56} />
              )}
              <div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 900,
                    color: '#FFFFFF',
                    fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
                    letterSpacing: 1,
                  }}
                >
                  REDIS IN-MEMORY SPATIAL CACHE
                </div>
                <div
                  style={{
                    fontSize: 15,
                    color: '#EF4444',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                  }}
                >
                  1M Drivers Updated Every 4 Seconds
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1.5px solid #10B981',
                padding: '8px 16px',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 800,
                color: '#10B981',
                fontFamily: 'monospace',
              }}
            >
              ⚡ P99 &lt; 2ms
            </div>
          </div>

          {/* Key-Value Data Rows */}
          <div
            style={{
              backgroundColor: '#07080C',
              borderRadius: 14,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.6fr',
                padding: '10px 18px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: 14,
                fontWeight: 800,
                color: '#9CA3AF',
                fontFamily: 'monospace',
                letterSpacing: 1,
              }}
            >
              <span>DRIVER ID (KEY)</span>
              <span>H3 CELL ID (GEOHASH VALUE)</span>
            </div>

            {[
              { id: 'drv_8241', hex: '8828308281ffffff' },
              { id: 'drv_1937', hex: '8828308293ffffff' },
              { id: 'drv_5506', hex: '88283082adffffff' },
              { id: 'drv_3872', hex: '88283082b1ffffff' },
            ].map((row, idx) => (
              <div
                key={row.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1.6fr',
                  padding: '10px 18px',
                  borderBottom: idx < 3 ? '1px solid rgba(255, 255, 255, 0.04)' : undefined,
                  fontSize: 18,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  backgroundColor: idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
                }}
              >
                <span style={{ color: '#FBBF24' }}>{row.id}</span>
                <span style={{ color: '#E2E8F0' }}>{row.hex}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* SCENE 4: Intelligent Neighbor Search & Dispatch Comparison */
        <div
          style={{
            width: 860,
            marginTop: 10,
            backgroundColor: '#0D0F17',
            border: '2px solid rgba(34, 211, 238, 0.5)',
            borderRadius: 24,
            padding: '22px 30px',
            boxShadow: '0 0 40px rgba(34, 211, 238, 0.2), 0 20px 40px rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: '#FFFFFF',
                fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
                letterSpacing: 1,
              }}
            >
              1-RING NEIGHBOR DISPATCH MATCHING
            </div>
            <div
              style={{
                backgroundColor: 'rgba(34, 211, 238, 0.15)',
                border: '1.5px solid #22D3EE',
                padding: '6px 14px',
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 800,
                color: '#22D3EE',
                fontFamily: 'monospace',
              }}
            >
              K-RING = 1
            </div>
          </div>

          {/* ETA Comparison Lines matching reference video */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              padding: '16px 20px',
              backgroundColor: '#07080C',
              borderRadius: 14,
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 22,
                fontWeight: 900,
                fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
              }}
            >
              <span style={{ color: '#22D3EE' }}>YOU (RIDER)</span>
              <span style={{ color: '#E2E8F0' }}>
                4 MIN <span style={{ color: '#10B981' }}>&rarr; 2 MIN ETA (MATCHED!)</span>
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 22,
                fontWeight: 900,
                fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                paddingTop: 10,
              }}
            >
              <span style={{ color: '#F43F5E' }}>OTHER DRIVERS</span>
              <span style={{ color: '#6B7280' }}>
                15 MIN &rarr; EXCLUDED FROM CALCULATION
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

