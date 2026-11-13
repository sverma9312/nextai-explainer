import React from 'react';
import type { ArchitectureStep } from '../../schema/types.js';

interface StepCalloutBarProps {
  steps: ArchitectureStep[];
  currentStep: number;
}

export const StepCalloutBar: React.FC<StepCalloutBarProps> = ({
  steps,
  currentStep,
}) => {
  const activeStepData = steps[currentStep - 1] || steps[0];

  return (
    <div
      style={{
        position: 'absolute',
        top: 1350,
        left: 50,
        right: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        zIndex: 10,
      }}
    >
      {/* 3 Step Indicator Tabs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
        }}
      >
        {steps.map((st, i) => {
          const stepNum = i + 1;
          const isSelected = stepNum === currentStep;
          const isPast = stepNum < currentStep;

          return (
            <div
              key={st.stepNumber}
              style={{
                padding: '8px 12px',
                borderRadius: 10,
                background: isSelected
                  ? 'rgba(6, 182, 212, 0.16)'
                  : isPast
                  ? 'rgba(16, 185, 129, 0.12)'
                  : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${
                  isSelected
                    ? '#06B6D4'
                    : isPast
                    ? 'rgba(16, 185, 129, 0.35)'
                    : 'rgba(255, 255, 255, 0.1)'
                }`,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  background: isSelected ? '#06B6D4' : isPast ? '#10B981' : '#1F2937',
                  color: '#FFFFFF',
                  fontSize: 11,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {stepNum}
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: isSelected ? '#FFFFFF' : '#9CA3AF',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontFamily: 'sans-serif',
                }}
              >
                {st.stepTitle.replace(/^\d+\s*\/\/\s*/, '')}
              </span>
            </div>
          );
        })}
      </div>

      {/* Active Callout Metric Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(168, 85, 247, 0.12)',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          borderRadius: 14,
          padding: '12px 20px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <span
          style={{
            fontSize: 15,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#D8B4FE',
            fontFamily: 'monospace',
          }}
        >
          {activeStepData.stepTitle}
        </span>
        <span
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: '#34D399',
            fontFamily: 'monospace',
          }}
        >
          ⚡ {activeStepData.calloutMetric}
        </span>
      </div>
    </div>
  );
};
