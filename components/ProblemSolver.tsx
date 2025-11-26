import React, { useState, useEffect, useRef } from 'react';
import { MathProblem, Difficulty, MissionId } from '../types';
import { generateProblem, askTutor } from '../services/geminiService';
import { Check, X, HelpCircle, RefreshCw, Send, Lightbulb, Calculator, Bot, User, ArrowLeft, ChevronRight, GraduationCap } from 'lucide-react';

interface ProblemSolverProps {
  missionId: MissionId;
  difficulty: Difficulty;
  onBack: () => void;
}

export const ProblemSolver: React.FC<ProblemSolverProps> = ({ missionId, difficulty, onBack }) => {
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [tutorChat, setTutorChat] = useState<{role: 'user'|'ai', text: string}[]>([]);
  const [tutorInput, setTutorInput] = useState('');
  const [askingTutor, setAskingTutor] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize
  useEffect(() => {
    loadNewProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missionId, difficulty]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [tutorChat, askingTutor]);

  const loadNewProblem = async () => {
    setLoading(true);
    setProblem(null);
    setUserAnswer('');
    setIsCorrect(null);
    setShowExplanation(false);
    setTutorChat([]);
    try {
      const p = await generateProblem(missionId, difficulty);
      setProblem(p);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = () => {
    if (!problem) return;
    const val = parseFloat(userAnswer);
    if (isNaN(val)) return;

    // Allow small margin of error for decimals
    const correct = Math.abs(val - problem.correctAnswer) < 0.01;
    setIsCorrect(correct);
    if (correct) {
      setShowExplanation(true);
    }
  };

  const handleAskTutor = async () => {
    if (!tutorInput.trim() || !problem) return;
    const userMsg = tutorInput;
    setTutorInput('');
    setTutorChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setAskingTutor(true);

    const context = `Problem: ${problem.question}. Correct Answer: ${problem.correctAnswer}. User's input so far: ${userAnswer}`;
    const reply = await askTutor(userMsg, context);
    
    setTutorChat(prev => [...prev, { role: 'ai', text: reply }]);
    setAskingTutor(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-8 animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-accent-blue/20 rounded-full blur-xl animate-pulse"></div>
          <div className="w-24 h-24 border-4 border-slate-700/50 rounded-full"></div>
          <div className="absolute top-0 left-0 w-24 h-24 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Calculator className="text-white/80 w-8 h-8 animate-bounce" />
          </div>
        </div>
        <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-white">กำลังสร้างโจทย์...</h3>
            <p className="text-slate-400 font-light">AI กำลังคำนวณตัวเลขและตรวจสอบความถูกต้อง</p>
        </div>
      </div>
    );
  }

  if (!problem) return (
    <div className="flex flex-col items-center justify-center p-10 glass-panel rounded-3xl text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-2">
            <X className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-white">เกิดข้อผิดพลาดในการโหลด</h3>
        <button onClick={loadNewProblem} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
            ลองใหม่อีกครั้ง
        </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up pb-10">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6 px-2">
        <button onClick={onBack} className="flex items-center text-slate-400 hover:text-white transition-colors group glass-button px-4 py-2 rounded-full">
             <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
             <span className="text-sm font-medium">ออกจากการทำโจทย์</span>
        </button>
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border bg-opacity-20 backdrop-blur-sm shadow-lg ${
           difficulty.includes('Easy') ? 'bg-green-500 border-green-500 text-green-300' :
           difficulty.includes('Medium') ? 'bg-yellow-500 border-yellow-500 text-yellow-300' :
           'bg-red-500 border-red-500 text-red-300'
        }`}>
          {difficulty}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Main Problem Area */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="glass-panel rounded-3xl p-8 lg:p-10 shadow-2xl relative overflow-hidden group hover:border-white/10 transition-colors duration-500">
            {/* Background decorative elements */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-accent-blue/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-accent-blue/30 transition-colors duration-700"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent-purple/20 rounded-full blur-[60px] pointer-events-none group-hover:bg-accent-purple/30 transition-colors duration-700"></div>
            
            <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-8">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl text-white shadow-lg shadow-blue-900/20">
                        <GraduationCap size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-300 uppercase tracking-wider text-xs mb-1">คำถาม</h2>
                        <h3 className="text-white text-xl font-bold leading-none">หาคำตอบจากโจทย์นี้</h3>
                    </div>
                </div>
                
                <div className="space-y-8 mb-10">
                    <p className="text-2xl md:text-3xl text-white leading-relaxed font-medium font-sans drop-shadow-sm">
                        {problem.question}
                    </p>
                    {problem.sequenceData && (
                        <div className="relative group/seq">
                            <div className="absolute inset-0 bg-gradient-to-r from-accent-teal/20 to-emerald-500/20 blur-xl opacity-0 group-hover/seq:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative p-6 bg-slate-900/60 rounded-2xl border border-slate-700/50 font-mono text-xl md:text-3xl text-accent-teal text-center tracking-widest shadow-inner">
                            {problem.sequenceData}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-4 bg-slate-900/40 p-6 rounded-2xl border border-white/5">
                    <label className="block text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">คำตอบของคุณ</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 group">
                            <input
                                type="number"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="ใส่คำตอบที่นี่..."
                                className={`w-full bg-slate-950/80 border-2 rounded-xl px-6 py-4 text-2xl font-mono focus:outline-none transition-all duration-300 shadow-inner ${
                                isCorrect === true ? 'border-green-500/50 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 
                                isCorrect === false ? 'border-red-500/50 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 
                                'border-slate-700/50 group-hover:border-slate-600 focus:border-accent-blue text-white'
                                }`}
                                disabled={isCorrect === true}
                                onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                            />
                            {problem.variableUnit && (
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-medium bg-slate-900/80 px-2 py-1 rounded">
                                {problem.variableUnit}
                                </span>
                            )}
                        </div>
                        <button
                        onClick={handleCheck}
                        disabled={!userAnswer || isCorrect === true}
                        className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center shadow-lg transform active:scale-95 whitespace-nowrap ${
                            isCorrect === true ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white cursor-default shadow-green-900/20' :
                            'bg-gradient-to-r from-accent-blue to-blue-600 hover:to-blue-500 text-white shadow-blue-900/20 hover:shadow-blue-500/30 ring-2 ring-white/10'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                        {isCorrect === true ? <><Check className="mr-2" /> ถูกต้อง!</> : <><Send className="mr-2 w-5 h-5" /> ส่งคำตอบ</>}
                        </button>
                    </div>

                    {isCorrect === false && (
                        <div className="flex items-center text-red-300 text-sm animate-pulse bg-red-500/10 p-3 rounded-lg border border-red-500/20 mt-2">
                        <X size={16} className="mr-2" /> คำตอบยังไม่ถูก ลองดูอีกครั้ง หรือถาม AI Tutor ทางขวาได้เลย
                        </div>
                    )}
                </div>
            </div>
          </div>

          {/* Explanation / Success State */}
          {showExplanation && (
            <div className="glass-panel border-l-4 border-l-green-500 rounded-3xl p-8 animate-fade-in-up relative overflow-hidden shadow-2xl">
               <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-500/20 rounded-full blur-3xl pointer-events-none"></div>
               
              <div className="flex items-start space-x-5 relative z-10">
                <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-white/5">
                        <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                            <Lightbulb size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white">เฉลยละเอียดทีละขั้นตอน</h3>
                    </div>
                  
                  <div className="space-y-0 relative pl-2">
                    {/* Timeline Line */}
                    <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-700/50"></div>
                    
                    {problem.explanationSteps.map((step, index) => (
                      <div key={index} className="flex items-start group relative pb-8 last:pb-0">
                        {/* Timeline Dot */}
                        <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg mr-5 border-2 transition-all duration-300 ${
                            'bg-slate-800 border-slate-700 text-slate-400 group-hover:border-green-500 group-hover:text-white group-hover:scale-110'
                        }`}>
                          {index + 1}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 pt-1.5">
                            <p className="text-slate-300 leading-relaxed font-light text-lg group-hover:text-white transition-colors">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 flex justify-end pt-6 border-t border-white/5">
                    <button 
                        onClick={loadNewProblem}
                        className="flex items-center space-x-3 bg-white text-slate-900 hover:bg-slate-200 px-8 py-4 rounded-xl transition-all hover:shadow-xl hover:-translate-y-1 font-bold group"
                    >
                        <RefreshCw size={20} className={`group-hover:rotate-180 transition-transform duration-500 ${loading ? "animate-spin" : ""}`} />
                        <span>ทำข้อต่อไป</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {!showExplanation && isCorrect !== true && (
             <div className="flex justify-center pt-4">
                <button 
                  onClick={() => setShowExplanation(true)}
                  className="text-slate-500 hover:text-white text-sm hover:underline transition-all flex items-center opacity-60 hover:opacity-100"
                >
                  <Lightbulb size={14} className="mr-2"/> ยอมแพ้และขอดูเฉลย
                </button>
             </div>
          )}
        </div>

        {/* AI Tutor Sidebar */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-[750px] glass-card rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden sticky top-24">
          <div className="p-5 border-b border-white/5 bg-slate-900/40 backdrop-blur-md flex items-center space-x-3">
            <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-tr from-accent-purple to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                    <Bot className="text-white w-7 h-7" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
            </div>
            <div>
                <h3 className="font-bold text-white text-lg">AI Math Tutor</h3>
                <p className="text-xs text-slate-400 flex items-center">
                    พร้อมช่วยเหลือตลอด 24 ชม.
                </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6 scroll-smooth bg-slate-950/20">
            {/* Initial System Message */}
            <div className="flex items-start space-x-3">
               <div className="w-8 h-8 bg-slate-800 rounded-full flex-shrink-0 flex items-center justify-center border border-slate-700">
                   <Bot size={14} className="text-accent-purple" />
               </div>
               <div className="bg-slate-800/90 backdrop-blur-sm p-4 rounded-2xl rounded-tl-none border border-slate-700/50 text-sm text-slate-200 shadow-md">
                  สวัสดี! ครูเป็น AI ผู้ช่วยสอนคณิตศาสตร์ <br/>
                  ติดขัดตรงไหน หรืออยากได้คำใบ้ พิมพ์ถามได้เลยครับ 👇
               </div>
            </div>

            {tutorChat.map((msg, idx) => (
              <div key={idx} className={`flex items-start space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''} animate-fade-in`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-md ${
                    msg.role === 'user' ? 'bg-gradient-to-br from-accent-blue to-blue-600' : 'bg-slate-800 border border-slate-700'
                }`}>
                  {msg.role === 'user' ? <User size={14} className="text-white"/> : <Bot size={14} className="text-accent-purple"/>}
                </div>
                <div className={`p-4 rounded-2xl text-sm shadow-md leading-relaxed max-w-[85%] ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-r from-accent-blue to-blue-600 text-white rounded-tr-none' 
                    : 'bg-slate-800/90 backdrop-blur-sm text-slate-200 rounded-tl-none border border-slate-700/50'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {askingTutor && (
              <div className="flex items-center space-x-3 animate-pulse">
                 <div className="w-8 h-8 bg-slate-800 rounded-full flex-shrink-0 flex items-center justify-center border border-slate-700">
                   <Bot size={14} className="text-accent-purple" />
               </div>
                <div className="bg-slate-800/50 p-3 rounded-2xl rounded-tl-none flex space-x-1 items-center h-10 w-16 justify-center">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-slate-900/60 backdrop-blur-xl border-t border-slate-700/50">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar mask-gradient-r">
              {[
                  { icon: <HelpCircle size={12}/>, text: "ขอคำใบ้หน่อย" },
                  { icon: null, text: "สูตรคืออะไร" },
                  { icon: null, text: "อธิบายวิธีทำ" }
              ].map((hint, i) => (
                <button 
                    key={i}
                    onClick={() => setTutorInput(hint.text)}
                    className="whitespace-nowrap px-4 py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 hover:border-accent-purple/50 text-slate-300 text-xs rounded-full transition-all flex items-center hover:text-white"
                >
                    {hint.icon && <span className="mr-1.5">{hint.icon}</span>} {hint.text}
                </button>
              ))}
            </div>
            <div className="flex space-x-2 relative">
              <input
                type="text"
                value={tutorInput}
                onChange={(e) => setTutorInput(e.target.value)}
                placeholder="พิมพ์ถามครู AI..."
                className="flex-1 bg-slate-950/80 border border-slate-700/70 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all placeholder:text-slate-600"
                onKeyDown={(e) => e.key === 'Enter' && handleAskTutor()}
              />
              <button 
                onClick={handleAskTutor}
                disabled={askingTutor || !tutorInput.trim()}
                className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-gradient-to-r from-accent-purple to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-purple-500/20"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};