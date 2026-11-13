import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { ArchitectureNode, ArchitectureEdge } from '../../schema/types.js';

interface ArchitectureCanvasProps {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  currentStep: number;
}

export const ArchitectureCanvas: React.FC<ArchitectureCanvasProps> = ({
  nodes,
  edges,
  currentStep,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Canvas bounds inside vertical 1080x1920 layout
  // Top: 280px to 1350px (approx 1070px height)
  const canvasWidth = 980;
  const canvasHeight = 1040;

  // Packet animation loop (0 to 1 every 40 frames)
  const packetProgress = (frame % 40) / 40;

  // Node position map helper (converts percentage to pixels)
  const getNodePos = (node: ArchitectureNode) => {
    const x = (node.x / 100) * (canvasWidth - 160) + 80;
    const y = (node.y / 100) * (canvasHeight - 120) + 60;
    return { x, y };
  };

  const nodeMap = new Map<string, { x: number; y: number }>();
  nodes.forEach((n) => {
    nodeMap.set(n.id, getNodePos(n));
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 280,
        left: 50,
        width: canvasWidth,
        height: canvasHeight,
        background: 'rgba(255, 255, 255, 0.015)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 32,
        backdropFilter: 'blur(16px)',
        overflow: 'hidden',
        zIndex: 5,
        boxShadow: '0 20px 60px -20px rgba(0, 0, 0, 0.7)',
      }}
    >
      {/* SVG Connection Edges & Flowing Packets */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <linearGradient id="edgeGradActive" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {edges.map((edge) => {
          const fromPos = nodeMap.get(edge.from);
          const toPos = nodeMap.get(edge.to);
          if (!fromPos || !toPos) return null;

          const isActive = edge.stepActive <= currentStep;
          const isCurrentEdge = edge.stepActive === currentStep;

          // Compute midpoint for curved bezier line
          const midX = (fromPos.x + toPos.x) / 2;
          const midY = (fromPos.y + toPos.y) / 2;
          const dx = toPos.x - fromPos.x;
          const dy = toPos.y - fromPos.y;
          const normalX = -dy * 0.15;
          const normalY = dx * 0.15;
          const controlX = midX + normalX;
          const controlY = midY + normalY;

          const pathD = `M ${fromPos.x} ${fromPos.y} Q ${controlX} ${controlY} ${toPos.x} ${toPos.y}`;

          // Calculate packet moving position along quadratic bezier curve
          const t = packetProgress;
          const packetX = (1 - t) * (1 - t) * fromPos.x + 2 * (1 - t) * t * controlX + t * t * toPos.x;
          const packetY = (1 - t) * (1 - t) * fromPos.y + 2 * (1 - t) * t * controlY + t * t * toPos.y;

          return (
            <g key={edge.id}>
              {/* Background Edge Path */}
              <path
                d={pathD}
                fill="none"
                stroke={isActive ? 'url(#edgeGradActive)' : 'rgba(255, 255, 255, 0.08)'}
                strokeWidth={isCurrentEdge ? 4 : 2}
                strokeDasharray={isActive ? (isCurrentEdge ? '8, 4' : 'none') : '6, 6'}
                opacity={isActive ? 0.9 : 0.3}
                filter={isCurrentEdge ? 'url(#glow)' : undefined}
              />

              {/* Edge Protocol Tag */}
              {isActive && (
                <g transform={`translate(${controlX}, ${controlY})`}>
                  <rect
                    x={-45}
                    y={-14}
                    width={90}
                    height={24}
                    rx={6}
                    fill="#0A0B10"
                    stroke={isCurrentEdge ? '#06B6D4' : 'rgba(255, 255, 255, 0.2)'}
                    strokeWidth={1}
                  />
                  <text
                    x={0}
                    y={3}
                    textAnchor="middle"
                    fill={isCurrentEdge ? '#22D3EE' : '#9CA3AF'}
                    fontSize={11}
                    fontWeight={700}
                    fontFamily="monospace"
                  >
                    {edge.protocol}
                  </text>
                </g>
              )}

              {/* Pulsing High-Speed Data Packet */}
              {isCurrentEdge && (
                <circle
                  cx={packetX}
                  cy={packetY}
                  r={7}
                  fill="#22D3EE"
                  filter="url(#glow)"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Architecture Server Node Cards */}
      {nodes.map((node) => {
        const pos = nodeMap.get(node.id);
        if (!pos) return null;

        const isRevealed = node.stepRevealed <= currentStep;
        const isCurrentlyActive = node.stepRevealed === currentStep;

        const entrance = spring({
          frame: frame - (node.stepRevealed - 1) * 30,
          fps,
          config: { damping: 15, stiffness: 140 },
        });

        const scale = interpolate(entrance, [0, 1], [0.8, 1]);
        const opacity = interpolate(entrance, [0, 1], [0, 1]);

        return (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity: isRevealed ? opacity : 0.25,
              width: 175,
              padding: '12px 14px',
              backgroundColor: isCurrentlyActive ? '#111422' : '#0B0D14',
              border: `2px solid ${
                isCurrentlyActive
                  ? '#06B6D4'
                  : isRevealed
                  ? 'rgba(168, 85, 247, 0.4)'
                  : 'rgba(255, 255, 255, 0.1)'
              }`,
              borderRadius: 16,
              boxShadow: isCurrentlyActive
                ? '0 0 30px rgba(6, 182, 212, 0.35), 0 10px 25px rgba(0, 0, 0, 0.8)'
                : '0 8px 20px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              zIndex: isCurrentlyActive ? 10 : 2,
              transition: 'all 0.3s ease',
            }}
          >
            {/* Top row: Icon + LED */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: 24 }}>{node.icon}</span>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: isCurrentlyActive ? '#22D3EE' : isRevealed ? '#10B981' : '#6B7280',
                  boxShadow: isCurrentlyActive ? '0 0 10px #22D3EE' : undefined,
                }}
              />
            </div>

            {/* Label */}
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: '#FFFFFF',
                fontFamily: 'sans-serif',
                marginTop: 2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {node.label}
            </div>

            {/* Sublabel */}
            <div
              style={{
                fontSize: 12,
                color: isCurrentlyActive ? '#A5F3FC' : '#9CA3AF',
                fontFamily: 'monospace',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {node.sublabel}
            </div>
          </div>
        );
      })}
    </div>
  );
};

