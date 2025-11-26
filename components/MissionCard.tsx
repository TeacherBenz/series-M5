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
      className="group relative overflow-hidden rounded-[2rem] cursor-pointer h-80 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-accent-blue/20 border border-white/10"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${mission.imageUrl})` }}
      />
      
      {/* Gradient Overlay - Stronger at bottom for text readability */}
      <div className={`absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/30 opacity-95 transition-opacity duration-300`} />
      
      {/* Active Gradient on Hover - Color Burst */}
      <div className={`absolute inset-0 bg-gradient-to-br ${mission.gradient} opacity-0 group-hover:opacity-40 transition-opacity duration-500 mix-blend-overlay`} />

      <div className="relative z-10 flex flex-col h-full justify-between p-8">
        <div className="flex justify-between items-start">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white backdrop-blur-md bg-white/10 border border-white/20 shadow-lg group-hover:bg-white/20 transition-all duration-300 group-hover:rotate-6`}>
            {mission.icon}
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 border border-white/20">
            <Play className="w-4 h-4 text-white fill-current ml-0.5" />
          </div>
        </div>
        
        <div>
          <h3 className="text-3xl font-bold text-white mb-3 drop-shadow-md group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-200 transition-all">{mission.title}</h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-6 opacity-90 font-light line-clamp-2">
            {mission.description}
          </p>
          
          <div className="flex items-center text-xs font-bold tracking-widest text-white/70 uppercase group-hover:text-white transition-colors">
            <span className="flex items-center bg-white/5 px-4 py-2 rounded-full border border-white/5 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
              เริ่มภารกิจ <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </div>
        </div>
      </div>
      
      {/* Decorative Border Glow */}
      <div className={`absolute inset-0 border-2 border-transparent group-hover:border-${mission.color.split('-')[1]}-500/30 rounded-[2rem] transition-colors duration-300 pointer-events-none`} />
    </div>
  );
};