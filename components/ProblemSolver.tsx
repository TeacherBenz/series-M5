
import React, { useState, useEffect, useRef } from 'react';
import { MathProblem, Difficulty, MissionId } from '../types';
import { generateProblem, askTutor } from '../services/geminiService';
import { Check, X, HelpCircle, RefreshCw, Send, Lightbulb, Calculator, Bot, User, ArrowLeft, ChevronRight } from 'lucide-react';

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
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-slate-700 rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Calculator className="text-slate-500 animate-pulse" />
          </div>
        </div>
        <p className="text-slate-400 font-light animate-pulse text-lg">AI กำลังวิเคราะห์และสร้างโจทย์...</p>
      </div>
    );
  }

  if (!problem) return <div className="text-center text-red-400 p-10 glass-panel rounded-xl">เกิดข้อผิดพลาดในการโหลดโจทย์</div>;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up pb-10">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6 px-2">
        <button onClick={onBack} className="flex items-center text-slate-400 hover:text-white transition-colors group">
          <div className="p-2 rounded-full bg-slate-800 group-hover:bg-slate-700 mr-2 transition-colors">
             <ArrowLeft size={16} />
          </div>
          <span className="text-sm font-medium">ออกจากการทำโจทย์</span>
        </button>
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border bg-opacity-20 backdrop-blur-sm ${
           difficulty.includes('Easy') ? 'bg-green-500 border-green-500 text-green-300' :
           difficulty.includes('Medium') ? 'bg-yellow-500 border-yellow-500 text-yellow-300' :
           'bg-red-500 border-red-500 text-red-300'
        }`}>
          {difficulty}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Problem Area */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="glass-panel rounded-3xl p-8 lg:p-10 shadow-2xl relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl text-white shadow-lg">
                    <Calculator size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white">คำถาม</h2>
                </div>
                
                <div className="space-y-6 mb-10">
                <p className="text-2xl md:text-3xl text-white leading-relaxed font-medium font-sans">
                    {problem.question}
                </p>
                {problem.sequenceData && (
                    <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-700/50 font-mono text-xl md:text-2xl text-accent-teal text-center tracking-widest shadow-inner">
                    {problem.sequenceData}
                    </div>
                )}
                </div>

                <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-400 uppercase tracking-wider">คำตอบของคุณ</label>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 group">
                    <input
                        type="number"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="0"
                        className={`w-full bg-slate-950/50 border-2 rounded-xl px-6 py-4 text-2xl font-mono focus:outline-none transition-all duration-300 shadow-inner ${
                        isCorrect === true ? 'border-green-500/50 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 
                        isCorrect === false ? 'border-red-500/50 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 
                        'border-slate-700 group-hover:border-slate-600 focus:border-accent-blue text-white'
                        }`}
                        disabled={isCorrect === true}
                        onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                    />
                    {problem.variableUnit && (
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                        {problem.variableUnit}
                        </span>
                    )}
                    </div>
                    <button
                    onClick={handleCheck}
                    disabled={!userAnswer || isCorrect === true}
                    className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center shadow-lg transform active:scale-95 ${
                        isCorrect === true ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white cursor-default shadow-green-900/20' :
                        'bg-gradient-to-r from-accent-blue to-blue-600 hover:to-blue-500 text-white shadow-blue-900/20 hover:shadow-blue-500/30'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                    {isCorrect === true ? <><Check className="mr-2" /> ถูกต้อง</> : 'ส่งคำตอบ'}
                    </button>
                </div>

                {isCorrect === false && (
                    <div className="flex items-center text-red-400 text-sm animate-pulse bg-red-500/10 p-3 rounded-lg border border-red-500/20 inline-block">
                    <X size={16} className="mr-2" /> ไม่ถูกต้อง ลองใหม่อีกครั้ง หรือถาม AI Tutor ทางขวาได้เลย
                    </div>
                )}
                </div>
            </div>
          </div>

          {/* Explanation / Success State */}
          {showExplanation && (
            <div className="glass-panel border-l-4 border-l-green-500 rounded-2xl p-8 animate-fade-in relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Lightbulb size={100} />
               </div>
              <div className="flex items-start space-x-5 relative z-10">
                <div className="p-3 bg-green-500 rounded-xl text-white shadow-lg mt-1">
                  <Check size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-6">เฉลยวิธีทำ</h3>
                  <div className="space-y-3">
                    {problem.explanationSteps.map((step, index) => (
                      <div key={index} className="flex items-start group">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 border border-slate-600 group-hover:border-green-500/50 group-hover:bg-green-500/10 text-slate-400 group-hover:text-green-400 flex items-center justify-center text-xs font-mono mr-4 mt-0.5 transition-colors">
                          {index + 1}
                        </span>
                        <p className="text-slate-300 leading-relaxed font-light text-lg">{step}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button 
                        onClick={loadNewProblem}
                        className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl transition-all hover:shadow-lg border border-slate-600 group"
                    >
                        <RefreshCw size={18} className={`group-hover:rotate-180 transition-transform duration-500 ${loading ? "animate-spin" : ""}`} />
                        <span>ข้อต่อไป</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {!showExplanation && isCorrect !== true && (
             <div className="flex justify-center">
                <button 
                  onClick={() => setShowExplanation(true)}
                  className="text-slate-500 hover:text-slate-300 text-sm underline transition-colors flex items-center"
                >
                  <Lightbulb size={14} className="mr-2"/> ยอมแพ้และดูเฉลย
                </button>
             </div>
          )}
        </div>

        {/* AI Tutor Sidebar */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-[700px] glass-card rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-700/50 bg-slate-900/30 backdrop-blur-md flex items-center space-x-3">
            <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-tr from-accent-purple to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <Bot className="text-white w-6 h-6" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
            </div>
            <div>
                <h3 className="font-bold text-white">AI Math Tutor</h3>
                <p className="text-xs text-slate-400 flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                    Online
                </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6 scroll-smooth">
            {/* Initial System Message */}
            <div className="flex items-start space-x-3">
               <div className="w-8 h-8 bg-slate-800 rounded-full flex-shrink-0 flex items-center justify-center border border-slate-700">
                   <Bot size={14} className="text-accent-purple" />
               </div>
               <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-2xl rounded-tl-none border border-slate-700/50 text-sm text-slate-200 shadow-md">
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
                    : 'bg-slate-800/80 backdrop-blur-sm text-slate-200 rounded-tl-none border border-slate-700/50'
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

          <div className="p-4 bg-slate-900/50 backdrop-blur-md border-t border-slate-700/50">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar mask-gradient-r">
              <button 
                onClick={() => setTutorInput("ขอคำใบ้หน่อย")}
                className="whitespace-nowrap px-4 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-accent-purple/50 text-slate-300 text-xs rounded-full transition-all flex items-center"
              >
                <HelpCircle size={12} className="mr-1.5"/> ขอคำใบ้
              </button>
              <button 
                onClick={() => setTutorInput("ขอสูตรที่ต้องใช้")}
                className="whitespace-nowrap px-4 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-accent-purple/50 text-slate-300 text-xs rounded-full transition-all"
              >
                สูตรคืออะไร
              </button>
              <button 
                onClick={() => setTutorInput("อธิบายทีละขั้นตอน")}
                className="whitespace-nowrap px-4 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-accent-purple/50 text-slate-300 text-xs rounded-full transition-all"
              >
                อธิบายวิธีทำ
              </button>
            </div>
            <div className="flex space-x-2 relative">
              <input
                type="text"
                value={tutorInput}
                onChange={(e) => setTutorInput(e.target.value)}
                placeholder="พิมพ์ข้อความ..."
                className="flex-1 bg-slate-950 border border-slate-700/70 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleAskTutor()}
              />
              <button 
                onClick={handleAskTutor}
                disabled={askingTutor || !tutorInput.trim()}
                className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-gradient-to-r from-accent-purple to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
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