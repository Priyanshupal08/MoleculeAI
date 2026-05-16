import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { Drug } from '../data/drugs';

interface PropertyRadarProps {
  drug: Drug;
}

export const PropertyRadar: React.FC<PropertyRadarProps> = ({ drug }) => {
  const data = [
    { subject: 'Likeness', A: drug.qed * 100, fullMark: 100 },
    { subject: 'Absorp.', A: drug.admet.absorption, fullMark: 100 },
    { subject: 'Distrib.', A: drug.admet.distribution, fullMark: 100 },
    { subject: 'Metab.', A: drug.admet.metabolism, fullMark: 100 },
    { subject: 'Excret.', A: drug.admet.excretion, fullMark: 100 },
    { subject: 'Safety', A: drug.admet.toxicity, fullMark: 100 },
  ];

  return (
    <div className="h-[340px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="62%" data={data}>
          <PolarGrid 
            stroke="rgba(255,255,255,0.05)" 
            radialLines={true}
          />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ 
              fill: '#ffffff', 
              fontSize: 10, 
              fontWeight: 800,
              letterSpacing: '0.05em'
            }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={false} 
            axisLine={false}
          />
          <Radar
            name={drug.name || 'Molecule'}
            dataKey="A"
            stroke="#bef264"
            strokeWidth={4}
            fill="url(#radarGradient)"
            fillOpacity={0.4}
            animationBegin={0}
            animationDuration={2000}
            transition-easing="cubic-bezier(0.16, 1, 0.3, 1)"
          />
          <defs>
            <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#bef264" stopOpacity={0.8}/>
              <stop offset="100%" stopColor="#bef264" stopOpacity={0.1}/>
            </linearGradient>
            <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
