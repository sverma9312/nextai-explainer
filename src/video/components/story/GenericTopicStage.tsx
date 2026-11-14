import React from 'react';
import { useCurrentFrame } from 'remotion';
import type { ExplainerScript, ArchitectureNode } from '../../../schema/types';
import {
  AutoTechIcon,
  BrandHubCircle,
  PersonVector,
  RedisLogo,
  DatabaseCylinderVector,
  CreditCardVector,
  ServerRackVector,
} from '../icons/TechLogos';

interface GenericTopicStageProps {
  script: ExplainerScript;
  sceneIndex: number; // 1, 2, 3, 4
}

export const GenericTopicStage: React.FC<GenericTopicStageProps> = ({ script, sceneIndex }) => {
  const frame = useCurrentFrame();

  // Active step in script:
  // sceneIndex 1 = Hook / Context Overview (no step yet)
  // sceneIndex 2 = Step 1 (script.steps[0])
  // sceneIndex 3 = Step 2 (script.steps[1])
  // sceneIndex 4 = Step 3 (script.steps[2])
  const isHookScene = sceneIndex === 1;
  const stepIndex = sceneIndex - 2;
  const step = !isHookScene ? (script.steps[stepIndex] || script.steps[0]) : null;

  const activeNodeIds = new Set(
    isHookScene
      ? script.nodes.map((n) => n.id)
      : (step?.activeNodeIds || [])
  );
  const activeEdgeIds = new Set(
    isHookScene
      ? script.edges.map((e) => e.id)
      : (step?.activeEdgeIds || [])
  );

  const cardTitle = isHookScene
    ? `${script.company.toUpperCase()} ARCHITECTURE OVERVIEW`
    : (step?.stepTitle || 'SYSTEM ARCHITECTURE BREAKTHROUGH');

  const cardDescription = isHookScene
    ? (script.problemStatement || script.hook)
    : (step?.narration || '');

  const cardCallout = isHookScene
    ? (script.scaleMetric.split('//')[0]?.trim() || 'High Availability')
    : (step?.calloutMetric || '');

  return (
    <div
      style={{
        position: 'relative',
        width: 900,
        height: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 0',
      }}
    >
      {/* Visual Canvas Area with Nodes & Connected Real Vectors */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 720,
          backgroundColor: '#07090E',
          borderRadius: 28,
          border: '2px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
          overflow: 'hidden',
        }}
      >
        {/* Subtle grid lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)',
            backgroundSize: '40px 40px',
            opacity: 0.6,
          }}
        />

        {/* Animated Connecting Dotted Doodle Lines */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {script.edges?.map((edge) => {
            const fromNode = script.nodes.find((n) => n.id === edge.from);
            const toNode = script.nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const isEdgeActive = activeEdgeIds.has(edge.id) || sceneIndex === 1;
            const strokeColor = isEdgeActive ? '#22D3EE' : 'rgba(255, 255, 255, 0.15)';

            return (
              <line
                key={edge.id}
                x1={`${fromNode.x}%`}
                y1={`${fromNode.y}%`}
                x2={`${toNode.x}%`}
                y2={`${toNode.y}%`}
                stroke={strokeColor}
                strokeWidth={isEdgeActive ? 3 : 1.5}
                strokeDasharray="6 6"
              />
            );
          })}
        </svg>

        {/* Dynamic Nodes with Authentic Vector Logos */}
        {script.nodes.map((node: ArchitectureNode) => {
          const isActive = activeNodeIds.has(node.id) || sceneIndex === 1;
          const nodePulse = isActive ? Math.sin((frame + node.x) / 10) * 4 : 0;
          const matchedEntity = script.visualEntities?.find(
            (e) =>
              e.id === node.id ||
              node.label.toLowerCase().includes(e.id.toLowerCase()) ||
              node.label.toLowerCase().includes(e.iconQuery.toLowerCase()) ||
              e.label.toLowerCase().includes(node.label.toLowerCase())
          );

          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: `translate(-50%, -50%) scale(${1 + (nodePulse * 0.01)})`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: isActive ? 20 : 5,
                transition: 'all 0.3s ease',
                opacity: isActive ? 1 : 0.45,
              }}
            >
              {/* Clean Floating Vector Icon - Free from Enclosing Card Boxes */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  filter: isActive
                    ? 'drop-shadow(0 0 18px rgba(34, 211, 238, 0.85))'
                    : 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.5))',
                  transition: 'all 0.3s ease',
                }}
              >
                {node.type === 'client' || node.id === 'user' ? (
                  <PersonVector size={78} color={isActive ? '#22D3EE' : '#94A3B8'} label="YOU" />
                ) : node.type === 'cache' || node.label.toLowerCase().includes('redis') ? (
                  <RedisLogo size={68} glow={isActive} />
                ) : node.type === 'db' || node.label.toLowerCase().includes('aurora') || node.label.toLowerCase().includes('database') ? (
                  <DatabaseCylinderVector size={68} color={isActive ? '#38BDF8' : '#64748B'} />
                ) : node.label.toLowerCase().includes('card') || node.label.toLowerCase().includes('payment') || node.label.toLowerCase().includes('processor') ? (
                  <CreditCardVector size={74} color={isActive ? '#10B981' : '#64748B'} active={isActive} />
                ) : (
                  <AutoTechIcon
                    name={`${node.label} ${node.sublabel}`}
                    size={68}
                    active={isActive}
                    svgDataUri={matchedEntity?.svgDataUri}
                  />
                )}
              </div>

              {/* Node Labels */}
              <span
                style={{
                  marginTop: 8,
                  fontSize: 18,
                  fontFamily: '"Comic Sans MS", "Chalkboard SE", "Caveat", cursive, sans-serif',
                  fontWeight: 900,
                  color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
                  letterSpacing: 1,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {node.label}
              </span>

              <span
                style={{
                  fontSize: 13,
                  fontFamily: 'monospace',
                  color: isActive ? '#22D3EE' : 'rgba(255, 255, 255, 0.4)',
                  letterSpacing: 0.5,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {node.sublabel}
              </span>
            </div>
          );
        })}
      </div>

      {/* Narrative Metric & Architecture Callout Card */}
      <div
        style={{
          width: '100%',
          padding: '16px 24px',
          backgroundColor: '#0C0E17',
          borderRadius: 20,
          border: '2px solid rgba(34, 211, 238, 0.3)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span
            style={{
              fontSize: 22,
              fontFamily: '"Comic Sans MS", "Chalkboard SE", "Caveat", cursive, sans-serif',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: 1.5,
            }}
          >
            {cardTitle}
          </span>
          <span
            style={{
              fontSize: 15,
              color: 'rgba(255, 255, 255, 0.7)',
              fontFamily: 'sans-serif',
              maxWidth: 620,
              lineHeight: 1.3,
            }}
          >
            {cardDescription}
          </span>
        </div>

        {cardCallout && (
          <div
            style={{
              backgroundColor: 'rgba(34, 211, 238, 0.15)',
              border: '1.5px solid #22D3EE',
              borderRadius: 12,
              padding: '10px 18px',
              fontSize: 16,
              fontWeight: 900,
              fontFamily: 'monospace',
              color: '#22D3EE',
              whiteSpace: 'nowrap',
            }}
          >
            {cardCallout}
          </div>
        )}
      </div>
    </div>
  );
};
