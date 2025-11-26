
import React, { useState } from 'react';
import { MissionCard } from './components/MissionCard';
import { ProblemSolver } from './components/ProblemSolver';
import { MissionId, MissionConfig, Difficulty } from './types';
import { Sigma, Infinity as InfinityIcon, Divide, BarChart3, Trophy, BookOpen, Star, Sparkles } from 'lucide-react';

// Configuration for the 4 missions with Unsplash Images
const MISSIONS: MissionConfig[] = [
  {
    id: MissionId.ARITHMETIC,
    title: 'อนุกรมเลขคณิต',
    description: 'ฝึกฝนการหาผลต่างร่วม พจน์ทั่วไป และผลบวกของอนุกรมที่เพิ่มหรือลดอย่างคงที่',
    icon: 'A',
    color: 'accent-blue',
    gradient: 'from-blue-600 to-cyan-500',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800' // Stairs/Math
  },
  {
    id: MissionId.GEOMETRIC,
    title: 'อนุกรมเรขาคณิต',
    description: 'เรียนรู้เกี่ยวกับอัตราส่วนร่วมและการเติบโตแบบทวีคูณของตัวเลข',
    icon: 'G',
    color: 'accent-purple',
    gradient: 'from-purple-600 to-pink-500',
    imageUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=800' // Spiral/Fractal
  },
  {
    id: MissionId.INFINITE,
    title: 'อนุกรมอนันต์ & ลิมิต',
    description: 'สำรวจความมหัศจรรย์ของอนันต์ การลู่เข้า และลู่ออกของอนุกรม',
    icon: 'I',
    color: 'accent-teal',
    gradient: 'from-teal-600 to-emerald-500',
    imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800' // Space/Infinite
  },
  {
    id: MissionId.SIGMA,
    title: 'สัญลักษณ์ Sigma',
    description: 'เจาะลึกสัญลักษณ์แทนการบวก (Σ) และการประยุกต์ใช้ในการแก้โจทย์ปัญหา',
    icon: 'S',
    color: 'accent-rose',
    gradient: 'from-rose-600 to-orange-500',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800' // Architecture/Structure
  }
];

const renderIcon = (iconStr: string) => {
  switch (iconStr) {
    case 'A': return <BarChart3 className="w-8 h-8" />;
    case 'G': return <Divide className="w-8 h-8" />;
    case 'I': return <InfinityIcon className="w-8 h-8" />;
    case 'S': return <Sigma className="w-8 h-8" />;
    default: return <BookOpen className="w-8 h-8" />;
  }
};

const App: React.FC = () => {
  const [activeMission, setActiveMission] = useState<MissionConfig | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  const handleMissionSelect = (mission: MissionConfig) => {
    setActiveMission(mission);
    setDifficulty(null);
  };

  const handleDifficultySelect = (diff: Difficulty) => {
    setDifficulty(diff);
  };

  const handleBackToHome = () => {
    setActiveMission(null);
    setDifficulty(null);
  };

  const handleBackToDifficulty = () => {
    setDifficulty(null);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-accent-blue selection:text-white pb-10">
      
      {/* Floating Navbar */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl flex items-center justify-between w-full max-w-5xl">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={handleBackToHome}>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Sigma className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 leading-tight">
                MathSeries
              </span>
              <span className="text-[10px] text-accent-blue tracking-widest uppercase font-semibold">Quest</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
             <div className="hidden sm:flex items-center px-4 py-1.5 bg-slate-800/50 rounded-full border border-slate-700/50">
                <Trophy className="w-4 h-4 text-yellow-500 mr-2" />
                <span className="text-sm font-medium text-slate-300">Level: <span className="text-white">Novice</span></span>
             </div>
             <div className="w-9 h-9 rounded-full bg-gradient-to-r from-accent-teal to-emerald-500 flex items-center justify-center text-white text-sm font-bold shadow-lg border-2 border-slate-900">
               P
             </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        {!activeMission && (
          <div className="animate-fade-in space-y-12">
            {/* Hero Section */}
            <header className="text-center max-w-4xl mx-auto relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-accent-purple/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
              
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-sm">
                 <Sparkles className="w-4 h-4 text-yellow-400" />
                 <span className="text-xs font-medium text-slate-300">AI-Powered Mathematics Learning</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight drop-shadow-xl">
                พิชิตโลกแห่ง <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-accent-purple to-accent-rose">อนุกรม</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                เรียนรู้คณิตศาสตร์ผ่าน 4 ภารกิจสุดท้าทาย พัฒนาทักษะของคุณด้วยโจทย์ที่สร้างขึ้นใหม่
                อย่างไม่มีที่สิ้นสุดด้วยพลังของ Gemini AI
              </p>
            </header>
            
            {/* Mission Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 px-2 md:px-10">
              {MISSIONS.map((mission) => (
                <MissionCard 
                  key={mission.id} 
                  mission={{...mission, icon: renderIcon(mission.icon) as any}} 
                  onClick={handleMissionSelect} 
                />
              ))}
            </div>
          </div>
        )}

        {activeMission && !difficulty && (
          <div className="animate-fade-in max-w-5xl mx-auto">
             <div className="mb-12 flex flex-col items-center text-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-64 bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 blur-3xl -z-10 rounded-full" />
                
                <button onClick={handleBackToHome} className="absolute left-0 top-2 p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white flex items-center">
                  &larr; กลับ
                </button>

                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center bg-gradient-to-br ${activeMission.gradient} shadow-2xl mb-6 rotate-3 hover:rotate-6 transition-transform`}>
                   <div className="text-white scale-150">{renderIcon(activeMission.icon)}</div>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">{activeMission.title}</h2>
                <p className="text-slate-400 text-lg">เลือกระดับความยากที่ต้องการท้าทาย</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {[Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD].map((diff, idx) => (
                  <button
                    key={diff}
                    onClick={() => handleDifficultySelect(diff)}
                    className="group relative flex flex-col items-center justify-center p-8 glass-panel rounded-3xl hover:border-white/20 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2 shadow-xl overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
                       idx === 0 ? 'from-green-500 to-emerald-400' :
                       idx === 1 ? 'from-yellow-500 to-orange-400' :
                       'from-red-500 to-rose-500'
                    }`} />
                    
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-slate-900 shadow-inner ${
                       idx === 0 ? 'text-green-400 shadow-green-900/20' :
                       idx === 1 ? 'text-yellow-400 shadow-yellow-900/20' :
                       'text-red-400 shadow-red-900/20'
                    }`}>
                        {idx === 0 && <Star className="w-8 h-8 fill-current" />}
                        {idx === 1 && <div className="flex"><Star className="w-6 h-6 fill-current"/><Star className="w-6 h-6 fill-current"/></div>}
                        {idx === 2 && <div className="flex relative"><Star className="w-8 h-8 fill-current absolute -top-1 left-1/2 -translate-x-1/2"/><Star className="w-5 h-5 fill-current mt-4 mr-3"/><Star className="w-5 h-5 fill-current mt-4 ml-3"/></div>}
                    </div>
                    
                    <span className="text-2xl font-bold text-white mb-2">{diff.split(' ')[0]}</span>
                    <span className="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full">{diff.match(/\((.*?)\)/)?.[1]}</span>
                    
                    <div className={`mt-6 w-full py-2 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 ${
                        idx === 0 ? 'bg-green-500/20 text-green-300' :
                        idx === 1 ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                    }`}>
                        เลือก
                    </div>
                  </button>
                ))}
             </div>
          </div>
        )}

        {activeMission && difficulty && (
          <ProblemSolver 
            missionId={activeMission.id} 
            difficulty={difficulty}
            onBack={handleBackToDifficulty}
          />
        )}
      </main>
    </div>
  );
};

export default App;