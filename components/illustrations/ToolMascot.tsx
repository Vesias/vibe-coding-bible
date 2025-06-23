/**
 * Sacred Tool Mascot Illustration Component
 * 
 * Creates beautiful SVG illustrations for each sacred coding tool
 * with distinctive personalities and divine tech aesthetics.
 */

import React from 'react';
import { DesignTokens } from '../../lib/sacred-design/visual-system';
import { TOOL_MASCOTS } from '../../lib/illustrations/generator';

interface ToolMascotProps {
  toolName: 'Claude' | 'Cline' | 'Cursor' | 'GitHub Copilot';
  size?: 'small' | 'medium' | 'large' | 'hero';
  style?: 'character' | 'icon' | 'portrait';
  animated?: boolean;
  showTitle?: boolean;
  className?: string;
}

export const ToolMascot: React.FC<ToolMascotProps> = ({
  toolName,
  size = 'medium',
  style = 'character',
  animated = true,
  showTitle = true,
  className = ''
}) => {
  const mascot = TOOL_MASCOTS.find(m => m.name === toolName);
  if (!mascot) return null;

  const sizeMap = {
    small: 120,
    medium: 200,
    large: 300,
    hero: 400
  };

  const svgSize = sizeMap[size];

  // Generate unique IDs
  const gradientId = `mascot-gradient-${toolName.toLowerCase()}`;
  const glowId = `mascot-glow-${toolName.toLowerCase()}`;
  const shadowId = `mascot-shadow-${toolName.toLowerCase()}`;

  return (
    <div className={`tool-mascot ${className}`}>
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        xmlns="http://www.w3.org/2000/svg"
        className={animated ? 'animate-mascot-float' : ''}
      >
        <defs>
          {/* Mascot Gradient */}
          <radialGradient id={gradientId} cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor={mascot.primaryColor} stopOpacity="1" />
            <stop offset="100%" stopColor={DesignTokens.colors.primary.deepMidnightBlue} stopOpacity="0.8" />
          </radialGradient>

          {/* Divine Glow */}
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Shadow Filter */}
          <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor={mascot.primaryColor} floodOpacity="0.3"/>
          </filter>
        </defs>

        {/* Background Aura */}
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={svgSize * 0.45}
          fill={`url(#${gradientId})`}
          opacity="0.1"
        />

        {/* Mascot-specific Illustration */}
        {renderMascotContent(toolName, svgSize, mascot, gradientId, glowId, shadowId, style)}

        {/* Title */}
        {showTitle && (
          <text
            x={svgSize / 2}
            y={svgSize - 20}
            textAnchor="middle"
            fontSize={size === 'hero' ? '14' : size === 'large' ? '12' : '10'}
            fontFamily={DesignTokens.typography.fonts.subheading.family}
            fontWeight="600"
            fill={mascot.primaryColor}
            filter={`url(#${glowId})`}
          >
            {mascot.germanTitle}
          </text>
        )}

        {/* Animated Sacred Rings */}
        {animated && (
          <>
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={svgSize * 0.35}
              stroke={mascot.primaryColor}
              strokeWidth="1"
              fill="none"
              opacity="0.2"
              className="animate-spin-slow"
            />
            <circle
              cx={svgSize / 2}
              cy={svgSize / 2}
              r={svgSize * 0.4}
              stroke={mascot.primaryColor}
              strokeWidth="0.5"
              fill="none"
              opacity="0.1"
              className="animate-spin-reverse"
            />
          </>
        )}
      </svg>
    </div>
  );
};

/**
 * Render specific content for each tool mascot
 */
function renderMascotContent(
  toolName: string,
  size: number,
  mascot: any,
  gradientId: string,
  glowId: string,
  shadowId: string,
  style: string
): JSX.Element {
  const centerX = size / 2;
  const centerY = size / 2;
  const scale = size / 200; // Base scale for 200px

  switch (toolName) {
    case 'Claude': // Sankt Claude der Allwissende
      return (
        <g>
          {/* Divine Scroll Base */}
          <rect
            x={centerX - 60 * scale}
            y={centerY - 40 * scale}
            width={120 * scale}
            height={80 * scale}
            fill={`url(#${gradientId})`}
            filter={`url(#${shadowId})`}
            rx={10 * scale}
          />
          
          {/* Golden Halo */}
          <circle
            cx={centerX}
            cy={centerY - 50 * scale}
            r={25 * scale}
            stroke={DesignTokens.colors.primary.techGold}
            strokeWidth={3 * scale}
            fill="none"
            filter={`url(#${glowId})`}
            opacity="0.8"
          />
          
          {/* Wisdom Eyes */}
          <circle
            cx={centerX - 15 * scale}
            cy={centerY - 20 * scale}
            r={8 * scale}
            fill={DesignTokens.colors.primary.techGold}
            filter={`url(#${glowId})`}
          />
          <circle
            cx={centerX + 15 * scale}
            cy={centerY - 20 * scale}
            r={8 * scale}
            fill={DesignTokens.colors.primary.techGold}
            filter={`url(#${glowId})`}
          />
          
          {/* Ancient Scrolls */}
          <rect
            x={centerX - 50 * scale}
            y={centerY - 10 * scale}
            width={100 * scale}
            height={4 * scale}
            fill={DesignTokens.colors.primary.techGold}
            opacity="0.6"
          />
          <rect
            x={centerX - 40 * scale}
            y={centerY}
            width={80 * scale}
            height={4 * scale}
            fill={DesignTokens.colors.primary.techGold}
            opacity="0.6"
          />
          <rect
            x={centerX - 30 * scale}
            y={centerY + 10 * scale}
            width={60 * scale}
            height={4 * scale}
            fill={DesignTokens.colors.primary.techGold}
            opacity="0.6"
          />

          {/* Divine Light Rays */}
          {[...Array(8)].map((_, i) => (
            <line
              key={i}
              x1={centerX}
              y1={centerY - 50 * scale}
              x2={centerX + Math.cos(i * Math.PI / 4) * 70 * scale}
              y2={centerY - 50 * scale + Math.sin(i * Math.PI / 4) * 70 * scale}
              stroke={DesignTokens.colors.primary.techGold}
              strokeWidth={1 * scale}
              opacity="0.4"
            />
          ))}
        </g>
      );

    case 'Cline': // Cline der Mächtige
      return (
        <g>
          {/* Power Core */}
          <circle
            cx={centerX}
            cy={centerY}
            r={50 * scale}
            fill={`url(#${gradientId})`}
            filter={`url(#${shadowId})`}
          />
          
          {/* Electric Lightning */}
          <path
            d={`M ${centerX - 20 * scale} ${centerY - 40 * scale} L ${centerX + 10 * scale} ${centerY - 10 * scale} L ${centerX - 10 * scale} ${centerY - 10 * scale} L ${centerX + 20 * scale} ${centerY + 40 * scale} L ${centerX - 5 * scale} ${centerY + 10 * scale} L ${centerX + 5 * scale} ${centerY + 10 * scale} Z`}
            fill={DesignTokens.colors.primary.electricIndigo}
            filter={`url(#${glowId})`}
          />
          
          {/* Tech Armor Segments */}
          <rect
            x={centerX - 60 * scale}
            y={centerY - 15 * scale}
            width={30 * scale}
            height={30 * scale}
            fill={mascot.primaryColor}
            filter={`url(#${shadowId})`}
            rx={5 * scale}
          />
          <rect
            x={centerX + 30 * scale}
            y={centerY - 15 * scale}
            width={30 * scale}
            height={30 * scale}
            fill={mascot.primaryColor}
            filter={`url(#${shadowId})`}
            rx={5 * scale}
          />
          
          {/* Command Interface */}
          <rect
            x={centerX - 25 * scale}
            y={centerY + 20 * scale}
            width={50 * scale}
            height={20 * scale}
            fill={DesignTokens.colors.secondary.matrixGreen}
            opacity="0.7"
            rx={5 * scale}
          />
          
          {/* Power Indicators */}
          {[...Array(3)].map((_, i) => (
            <circle
              key={i}
              cx={centerX - 10 * scale + i * 10 * scale}
              cy={centerY + 30 * scale}
              r={3 * scale}
              fill={DesignTokens.colors.secondary.matrixGreen}
              filter={`url(#${glowId})`}
            />
          ))}
        </g>
      );

    case 'Cursor': // Cursor der Präzise
      return (
        <g>
          {/* Precision Crosshair */}
          <circle
            cx={centerX}
            cy={centerY}
            r={40 * scale}
            stroke={mascot.primaryColor}
            strokeWidth={3 * scale}
            fill="none"
            filter={`url(#${glowId})`}
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={20 * scale}
            stroke={mascot.primaryColor}
            strokeWidth={2 * scale}
            fill="none"
            opacity="0.7"
          />
          
          {/* Laser Beams */}
          <line
            x1={centerX - 60 * scale}
            y1={centerY}
            x2={centerX + 60 * scale}
            y2={centerY}
            stroke={DesignTokens.colors.secondary.matrixGreen}
            strokeWidth={2 * scale}
            filter={`url(#${glowId})`}
            opacity="0.8"
          />
          <line
            x1={centerX}
            y1={centerY - 60 * scale}
            x2={centerX}
            y2={centerY + 60 * scale}
            stroke={DesignTokens.colors.secondary.matrixGreen}
            strokeWidth={2 * scale}
            filter={`url(#${glowId})`}
            opacity="0.8"
          />
          
          {/* Precision Center */}
          <circle
            cx={centerX}
            cy={centerY}
            r={5 * scale}
            fill={DesignTokens.colors.secondary.matrixGreen}
            filter={`url(#${glowId})`}
          />
          
          {/* Surgical Tools */}
          <rect
            x={centerX - 2 * scale}
            y={centerY - 50 * scale}
            width={4 * scale}
            height={30 * scale}
            fill={mascot.primaryColor}
            filter={`url(#${shadowId})`}
          />
          <polygon
            points={`${centerX},${centerY - 55 * scale} ${centerX - 5 * scale},${centerY - 45 * scale} ${centerX + 5 * scale},${centerY - 45 * scale}`}
            fill={DesignTokens.colors.secondary.matrixGreen}
            filter={`url(#${glowId})`}
          />
          
          {/* Focus Indicators */}
          {[...Array(4)].map((_, i) => (
            <rect
              key={i}
              x={centerX + Math.cos(i * Math.PI / 2) * 45 * scale - 2 * scale}
              y={centerY + Math.sin(i * Math.PI / 2) * 45 * scale - 5 * scale}
              width={4 * scale}
              height={10 * scale}
              fill={mascot.primaryColor}
              opacity="0.6"
            />
          ))}
        </g>
      );

    case 'GitHub Copilot': // Copilot der Begleiter
      return (
        <g>
          {/* Collaborative Circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={45 * scale}
            fill={`url(#${gradientId})`}
            filter={`url(#${shadowId})`}
          />
          
          {/* Partnership Hands */}
          <ellipse
            cx={centerX - 25 * scale}
            cy={centerY}
            rx={15 * scale}
            ry={25 * scale}
            fill={mascot.primaryColor}
            filter={`url(#${shadowId})`}
            transform={`rotate(-20 ${centerX - 25 * scale} ${centerY})`}
          />
          <ellipse
            cx={centerX + 25 * scale}
            cy={centerY}
            rx={15 * scale}
            ry={25 * scale}
            fill={mascot.primaryColor}
            filter={`url(#${shadowId})`}
            transform={`rotate(20 ${centerX + 25 * scale} ${centerY})`}
          />
          
          {/* Friendly Face */}
          <circle
            cx={centerX - 10 * scale}
            cy={centerY - 10 * scale}
            r={4 * scale}
            fill={"white"}
          />
          <circle
            cx={centerX + 10 * scale}
            cy={centerY - 10 * scale}
            r={4 * scale}
            fill={"white"}
          />
          <path
            d={`M ${centerX - 15 * scale} ${centerY + 10 * scale} Q ${centerX} ${centerY + 20 * scale} ${centerX + 15 * scale} ${centerY + 10 * scale}`}
            stroke={"white"}
            strokeWidth={2 * scale}
            fill="none"
          />
          
          {/* Collaborative Tools */}
          <rect
            x={centerX - 30 * scale}
            y={centerY + 30 * scale}
            width={60 * scale}
            height={15 * scale}
            fill={"white"}
            opacity="0.8"
            rx={7 * scale}
          />
          
          {/* Helper Indicators */}
          {[...Array(3)].map((_, i) => (
            <circle
              key={i}
              cx={centerX - 15 * scale + i * 15 * scale}
              cy={centerY + 37 * scale}
              r={3 * scale}
              fill={mascot.primaryColor}
            />
          ))}
        </g>
      );

    default:
      return <></>;
  }
}

export default ToolMascot;