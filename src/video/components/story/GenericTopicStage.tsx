import React from 'react';
import { useCurrentFrame } from 'remotion';
import type { ExplainerScript, ArchitectureNode } from '../../../schema/types';
import { AutoTechIcon, BrandHubCircle } from '../icons/TechLogos';

interface GenericTopicStageProps {
  script: ExplainerScript;
  sceneIndex: number; // 1, 2, 3, 4
}

export const GenericTopicStage: React.FC<GenericTopicStageProps> = ({ script, sceneIndex }) => {
  const frame = useCurrentFrame();

  // Active step in script
  const step = script.steps[sceneIndex - 1] || script.steps[0];
  const activeNodeIds = new Set(step?.activeNodeIds || []);
  const activeEdgeIds = new Set(step?.activeEdgeIds || []);

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

        {/* Central Company Brand Hub */}
        <div
          style={{
            position: 'absolute',
            top: '46%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        >
          <BrandHubCircle name={script.company} size={110} />
        </div>

        {/* Dynamic Nodes with Authentic Vector Logos */}
        {script.nodes.map((node: ArchitectureNode) => {
          const isActive = activeNodeIds.has(node.id) || sceneIndex === 1;
          const nodePulse = isActive ? Math.sin((frame + node.x) / 10) * 4 : 0;

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
              {/* Real Authentic SVG Vector Icon */}
              <div
                style={{
                  padding: 12,
                  borderRadius: 18,
                  backgroundColor: isActive ? 'rgba(17, 24, 39, 0.95)' : 'rgba(15, 23, 42, 0.7)',
                  border: `2px solid ${isActive ? '#22D3EE' : 'rgba(255, 255, 255, 0.12)'}`,
                  boxShadow: isActive ? '0 0 25px rgba(34, 211, 238, 0.4)' : undefined,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AutoTechIcon name={`${node.label} ${node.sublabel}`} size={56} active={isActive} />
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
            {step?.stepTitle || 'SYSTEM ARCHITECTURE BREAKTHROUGH'}
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
            {step?.narration}
          </span>
        </div>

        {step?.calloutMetric && (
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
            {step.calloutMetric}
          </div>
        )}
      </div>
    </div>
  );
};
