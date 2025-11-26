import React from 'react';
import { MissionConfig } from '../types';
import { ArrowRight, Play } from 'lucide-react';

interface MissionCardProps {
  mission: MissionConfig;
  onClick: (mission: MissionConfig) => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({ mission, onClick }) => {
  return (
    <div 
      onClick={() => onClick(mission)}
      className="group relative overflow-hidden rounded-3xl cursor-pointer h-72 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-accent-blue/20 border border-white/5"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${mission.imageUrl})` }}
      />
      
      {/* Gradient Overlay - Always visible but stronger at bottom */}
      <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40 opacity-90 transition-opacity duration-300`} />
      
      {/* Active Gradient on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${mission.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500 mix-blend-overlay`} />

      <div className="relative z-10 flex flex-col h-full justify-between p-8">
        <div className="flex justify-between items-start">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white backdrop-blur-md bg-white/10 border border-white/20 shadow-lg group-hover:bg-white/20 transition-all duration-300`}>
            {mission.icon}
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
            <Play className="w-3 h-3 text-white fill-current" />
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">{mission.title}</h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-4 opacity-90 font-light">
            {mission.description}
          </p>
          
          <div className="flex items-center text-xs font-semibold tracking-wider text-white/80 uppercase">
            <span className="flex items-center group-hover:text-white transition-colors">
              เริ่มภารกิจ <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </div>
        </div>
      </div>
      
      {/* Decorative Border Glow */}
      <div className={`absolute inset-0 border-2 border-transparent group-hover:border-${mission.color.split('-')[1]}-500/50 rounded-3xl transition-colors duration-300`} />
    </div>
  );
};