"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, CheckCircle2, ChevronDown, Flame } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useTaskContext } from "@/context/TaskContext";

type TimerMode = "focus" | "shortBreak" | "longBreak" | "custom";

const MODE_DURATIONS = {
  focus: 25 * 60 * 1000,
  shortBreak: 5 * 60 * 1000,
  longBreak: 15 * 60 * 1000,
};

const MODE_COLORS = {
  focus: "text-neon-purple",
  shortBreak: "text-neon-cyan",
  longBreak: "text-neon-blue",
  custom: "text-amber-500",
};

export default function FocusPage() {
  const { tasks, toggleTask } = useTaskContext();
  
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(MODE_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const { addNotification } = useTaskContext();
  const [sessionCount, setSessionCount] = useState(0);

  const [customMinutes, setCustomMinutes] = useState("2");
  const [customSeconds, setCustomSeconds] = useState("0");

  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [showTaskSelector, setShowTaskSelector] = useState(false);

  const endTimeRef = useRef<number | null>(null);
  const reqRef = useRef<number | null>(null);

  const playAlarm = useCallback(() => {
    try {
      const savedSound = localStorage.getItem("taskify_sound");
      if (savedSound === "false") return; // Respect user settings

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playTone = (freq: number, startTime: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);
        
        gain.gain.setValueAtTime(0.3, startTime); // Gentle volume
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      // Play 3 gentle beeps (A5, A5, C6)
      const now = audioCtx.currentTime;
      playTone(880, now, 0.15); 
      playTone(880, now + 0.25, 0.15);
      playTone(1046.50, now + 0.5, 0.4); 
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  }, []);

  // High Precision Timer Logic
  useEffect(() => {
    if (!isRunning) {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
      return;
    }

    endTimeRef.current = Date.now() + timeLeft;

    const tick = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTimeRef.current! - now);
      setTimeLeft(remaining);
      
      if (remaining > 0) {
        reqRef.current = requestAnimationFrame(tick);
      } else {
        setIsRunning(false);
        playAlarm(); // Play beep sound
        
        addNotification(
          "Timer Complete! 🎯", 
          `Your ${mode} session has finished. Great job!`, 
          "success"
        );

        if (mode === "focus" || mode === "custom") {
          setSessionCount((prev) => prev + 1);
          handleModeSwitch("shortBreak");
        }
      }
    };
    
    reqRef.current = requestAnimationFrame(tick);

    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [isRunning, mode, addNotification]);

  const handleModeSwitch = useCallback((newMode: TimerMode, mVal?: string, sVal?: string) => {
    setMode(newMode);
    setIsRunning(false);
    if (newMode === "custom") {
      const mParsed = parseFloat(mVal ?? customMinutes);
      const sParsed = parseFloat(sVal ?? customSeconds);
      let totalMs = 0;
      if (!isNaN(mParsed) && mParsed >= 0) totalMs += Math.floor(mParsed * 60 * 1000);
      if (!isNaN(sParsed) && sParsed >= 0) totalMs += Math.floor(sParsed * 1000);
      setTimeLeft(totalMs > 0 ? totalMs : 0);
    } else {
      setTimeLeft(MODE_DURATIONS[newMode]);
    }
  }, [customMinutes, customSeconds]);

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === "custom") {
      const mParsed = parseFloat(customMinutes);
      const sParsed = parseFloat(customSeconds);
      let totalMs = 0;
      if (!isNaN(mParsed) && mParsed >= 0) totalMs += Math.floor(mParsed * 60 * 1000);
      if (!isNaN(sParsed) && sParsed >= 0) totalMs += Math.floor(sParsed * 1000);
      setTimeLeft(totalMs > 0 ? totalMs : 0);
    } else {
      setTimeLeft(MODE_DURATIONS[mode as keyof typeof MODE_DURATIONS]);
    }
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  // Formatting (MM:SS.ms)
  const totalSeconds = timeLeft / 1000;
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  const ms = Math.floor((timeLeft % 1000) / 10); // 2 digits for ms

  const formattedM = m.toString().padStart(2, '0');
  const formattedS = s.toString().padStart(2, '0');
  const formattedMs = ms.toString().padStart(2, '0');

  // Clock Hand Calculations
  // The main hand sweeps 360 degrees in 60 seconds.
  const secondsFraction = (totalSeconds % 60) / 60;
  // Elapsed seconds = 60 - remaining seconds (so it ticks clockwise as time goes down)
  const elapsedFraction = 1 - secondsFraction;
  const handRotation = elapsedFraction * 360; 

  // Inner dial (minutes)
  const minutesFraction = (m % 60) / 60;
  const elapsedMinutesFraction = 1 - minutesFraction;
  const innerHandRotation = elapsedMinutesFraction * 360;

  // Render SVG Ticks
  const renderTicks = () => {
    const ticks = [];
    for (let i = 0; i < 60; i++) {
      const isFive = i % 5 === 0;
      const angle = (i * 6) * (Math.PI / 180);
      
      const rOuter = 135;
      const rInner = isFive ? 122 : 128;
      
      const x1 = 150 + rOuter * Math.sin(angle);
      const y1 = 150 - rOuter * Math.cos(angle);
      const x2 = 150 + rInner * Math.sin(angle);
      const y2 = 150 - rInner * Math.cos(angle);
      
      ticks.push(
        <line 
          key={i} 
          x1={x1} y1={y1} x2={x2} y2={y2} 
          className={isFive ? "stroke-gray-400 dark:stroke-gray-500" : "stroke-gray-200 dark:stroke-gray-700"} 
          strokeWidth={isFive ? 2 : 1} 
        />
      );

      // Add numbers every 5 ticks
      if (isFive && i !== 0) {
        const rText = 108;
        const tx = 150 + rText * Math.sin(angle);
        const ty = 150 - rText * Math.cos(angle);
        ticks.push(
          <text 
            key={`txt-${i}`} 
            x={tx} y={ty} 
            textAnchor="middle" 
            alignmentBaseline="middle" 
            className="text-[10px] fill-gray-500 dark:fill-gray-400 font-bold"
          >
            {i}
          </text>
        );
      }
    }
    // "60" at top
    ticks.push(
      <text 
        key="txt-60" 
        x={150} y={42} 
        textAnchor="middle" 
        alignmentBaseline="middle" 
        className="text-[11px] fill-gray-600 dark:fill-gray-300 font-bold"
      >
        60
      </text>
    );
    return ticks;
  };

  const renderInnerTicks = () => {
    const ticks = [];
    for (let i = 0; i < 30; i++) {
      const isFive = i % 5 === 0;
      const angle = (i * 12) * (Math.PI / 180);
      
      const rOuter = 30;
      const rInner = isFive ? 25 : 27;
      
      const x1 = 150 + rOuter * Math.sin(angle);
      const y1 = 200 - rOuter * Math.cos(angle);
      const x2 = 150 + rInner * Math.sin(angle);
      const y2 = 200 - rInner * Math.cos(angle);
      
      ticks.push(
        <line 
          key={`inner-${i}`} 
          x1={x1} y1={y1} x2={x2} y2={y2} 
          className="stroke-gray-300 dark:stroke-gray-600" 
          strokeWidth={1} 
        />
      );
    }
    return ticks;
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  return (
    <div className="max-w-4xl mx-auto pb-20 pt-4 px-4 flex flex-col items-center justify-center min-h-[85vh]">
      
      {/* Task Selector */}
      <div className="w-full max-w-sm mb-6 relative z-20">
        <div 
          onClick={() => setShowTaskSelector(!showTaskSelector)}
          className="flex items-center justify-between p-3.5 bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl cursor-pointer hover:bg-white/80 dark:hover:bg-white/5 transition-all shadow-sm"
        >
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-0.5">
              Current Focus
            </span>
            <span className={`text-sm font-medium ${selectedTask ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
              {selectedTask ? selectedTask.title : "Select a task..."}
            </span>
          </div>
          <ChevronDown size={18} className={`text-gray-400 transition-transform ${showTaskSelector ? 'rotate-180' : ''}`} />
        </div>

        <AnimatePresence>
          {showTaskSelector && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-[#1a1a2e] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto z-50 no-scrollbar"
            >
              {activeTasks.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">No active tasks.</div>
              ) : (
                activeTasks.map(task => (
                  <div 
                    key={task.id}
                    onClick={() => {
                      setSelectedTaskId(task.id);
                      setShowTaskSelector(false);
                    }}
                    className="p-3 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    {task.title}
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {selectedTask && (
          <div className="flex justify-center mt-3">
            <button 
              onClick={() => {
                toggleTask(selectedTask.id);
                setSelectedTaskId("");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-green-500/20 transition-colors"
            >
              <CheckCircle2 size={12} />
              Mark as Completed
            </button>
          </div>
        )}
      </div>

      {/* Main Timer Card */}
      <GlassCard className="w-full max-w-md p-6 flex flex-col items-center relative overflow-hidden shadow-2xl bg-white/40 dark:bg-black/40 border-white/40 dark:border-white/10 backdrop-blur-3xl">
        
        {/* Mode Toggles */}
        <div className="flex w-full bg-black/5 dark:bg-black/40 p-1 rounded-3xl mb-10 border border-gray-200 dark:border-white/5 flex-wrap justify-center gap-1">
          {(['focus', 'shortBreak', 'longBreak', 'custom'] as TimerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => handleModeSwitch(m)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                mode === m 
                  ? 'bg-white dark:bg-[#1f1f3a] text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {m === 'focus' ? 'Focus' : m === 'shortBreak' ? 'Short Break' : m === 'longBreak' ? 'Long Break' : 'Custom'}
            </button>
          ))}
        </div>

        {mode === 'custom' && (
          <div className="mb-10 flex flex-col items-center">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Set Custom Timer</span>
            <div className="flex items-center gap-4 bg-white/50 dark:bg-black/30 px-6 py-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-inner">
              <input 
                type="text" 
                inputMode="numeric"
                pattern="[0-9]*"
                value={customMinutes}
                onChange={(e) => {
                  setCustomMinutes(e.target.value);
                  handleModeSwitch('custom', e.target.value, customSeconds);
                }}
                placeholder="00"
                className="w-20 bg-transparent text-5xl font-black text-center text-gray-900 dark:text-white focus:outline-none placeholder:text-gray-300 dark:placeholder:text-gray-700"
              />
              <span className="text-4xl text-gray-400 font-bold mb-2">:</span>
              <input 
                type="text" 
                inputMode="numeric"
                pattern="[0-9]*"
                value={customSeconds}
                onChange={(e) => {
                  setCustomSeconds(e.target.value);
                  handleModeSwitch('custom', customMinutes, e.target.value);
                }}
                placeholder="00"
                className="w-20 bg-transparent text-5xl font-black text-center text-gray-900 dark:text-white focus:outline-none placeholder:text-gray-300 dark:placeholder:text-gray-700"
              />
            </div>
          </div>
        )}

        {/* Retro Flip Clock UI */}
        <div className="flex items-center justify-center w-full gap-4 md:gap-6 mb-8 select-none">
          {/* Minutes Flip Card */}
          <div className="flex flex-col items-center">
            <div 
              className="relative bg-[#111] border border-gray-800 rounded-xl overflow-hidden shadow-2xl w-24 h-32 sm:w-32 sm:h-40 md:w-40 md:h-48 flex items-center justify-center"
              style={{ perspective: 1000 }}
            >
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={formattedM}
                  initial={{ rotateX: -90, y: -20, opacity: 0 }}
                  animate={{ rotateX: 0, y: 0, opacity: 1 }}
                  exit={{ rotateX: 90, y: 20, opacity: 0 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 120, damping: 14 }}
                  className={`absolute text-[60px] sm:text-[80px] md:text-[110px] font-black tabular-nums drop-shadow-lg ${MODE_COLORS[mode]}`}
                >
                  {formattedM}
                </motion.span>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/40 pointer-events-none z-10" />
              {/* Flip Line */}
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-black z-20 shadow-[0_1px_0_rgba(255,255,255,0.1)]" />
              {/* Reflection */}
              <div className="absolute top-0 left-0 right-0 bottom-1/2 bg-white/5 pointer-events-none z-10" />
            </div>
            <span className="text-gray-700 dark:text-gray-500 uppercase tracking-[0.3em] text-[10px] font-bold mt-4">Minutes</span>
          </div>

          <div className="flex flex-col items-center justify-center pb-6">
            <span className={`text-4xl sm:text-5xl md:text-7xl font-bold animate-pulse ${MODE_COLORS[mode]}`}>:</span>
          </div>

          {/* Seconds Flip Card */}
          <div className="flex flex-col items-center">
            <div 
              className="relative bg-[#111] border border-gray-800 rounded-xl overflow-hidden shadow-2xl w-24 h-32 sm:w-32 sm:h-40 md:w-40 md:h-48 flex items-center justify-center"
              style={{ perspective: 1000 }}
            >
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={formattedS}
                  initial={{ rotateX: -90, y: -20, opacity: 0 }}
                  animate={{ rotateX: 0, y: 0, opacity: 1 }}
                  exit={{ rotateX: 90, y: 20, opacity: 0 }}
                  transition={{ duration: 0.4, type: "spring", stiffness: 120, damping: 14 }}
                  className={`absolute text-[60px] sm:text-[80px] md:text-[110px] font-black tabular-nums drop-shadow-lg ${MODE_COLORS[mode]}`}
                >
                  {formattedS}
                </motion.span>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/40 pointer-events-none z-10" />
              {/* Flip Line */}
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-black z-20 shadow-[0_1px_0_rgba(255,255,255,0.1)]" />
              {/* Reflection */}
              <div className="absolute top-0 left-0 right-0 bottom-1/2 bg-white/5 pointer-events-none z-10" />
            </div>
            <span className="text-gray-700 dark:text-gray-500 uppercase tracking-[0.3em] text-[10px] font-bold mt-4">Seconds</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center w-full gap-6 mt-8">
          <button 
            onClick={resetTimer}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <RotateCcw size={20} />
          </button>
          
          <button 
            onClick={toggleTimer}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 ${
              isRunning 
                ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10' 
                : 'bg-gradient-to-br from-neon-purple to-neon-blue text-white'
            }`}
          >
            {isRunning ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-1" />}
          </button>
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm flex items-center justify-center gap-2">
        <Flame size={16} className="text-orange-500" />
        <span className="font-medium">{sessionCount} Focus {sessionCount === 1 ? 'Session' : 'Sessions'} Completed</span>
      </div>

    </div>
  );
}
