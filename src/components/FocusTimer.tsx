import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Coffee,
  BookOpen,
  Award,
  Bell,
} from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface FocusTimerProps {
  onSessionComplete: (minutes: number, xp: number) => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ onSessionComplete }) => {
  const [mode, setMode] = useState<'study' | 'break'>('study');
  const [totalSeconds, setTotalSeconds] = useState<number>(25 * 60);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [soundMode, setSoundMode] = useState<'none' | 'rain' | 'alpha' | 'forest'>('none');
  const [completionBanner, setCompletionBanner] = useState<string | null>(null);

  // Set preset
  const setPreset = (mins: number, newMode: 'study' | 'break') => {
    soundEffects.playTap();
    setIsActive(false);
    setMode(newMode);
    setTotalSeconds(mins * 60);
    setSecondsLeft(mins * 60);
  };

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      setIsActive(false);
      soundEffects.stopAmbient();
      setSoundMode('none');

      // Play timer completion chime
      soundEffects.playTimerBell();

      if (mode === 'study') {
        const completedMins = Math.round(totalSeconds / 60);
        const xpEarned = completedMins * 2;
        onSessionComplete(completedMins, xpEarned);

        try {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 },
          });
        } catch (e) {}

        setCompletionBanner(`🎉 مبروك يا بطل! أتممت جلسة مذاكرة بتركيز مدتها ${completedMins} دقيقة وحصلت على +${xpEarned} XP! خذ استراحة قصيرة.`);
        setPreset(5, 'break');
      } else {
        setCompletionBanner('☕ انتهت فترة الاستراحة! حان وقت استئناف المذاكرة بنشاط!');
        setPreset(25, 'study');
      }
    }

    return () => clearInterval(interval);
  }, [isActive, secondsLeft, mode, totalSeconds]);

  // Ambient sound selection using robust soundEffects
  const handleSoundSelect = (type: 'rain' | 'alpha' | 'forest') => {
    soundEffects.playTap();
    if (soundMode === type) {
      soundEffects.stopAmbient();
      setSoundMode('none');
    } else {
      const started = soundEffects.startAmbient(type);
      if (started) {
        setSoundMode(type);
      }
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    soundEffects.playTap();
    setIsActive(prev => {
      const next = !prev;
      if (!next) {
        soundEffects.stopAmbient();
        setSoundMode('none');
      }
      return next;
    });
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progressPercent = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
          <Timer className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
          مؤقت التركيز الذكي (تقنية بومودورو مع أصوات هادئة)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          ذاكر بتركيز تام لمدة 25 دقيقة، ثم استرح 5 دقائق لتثبيت المعلومات وتنشيط الذاكرة.
        </p>
      </div>

      {/* Completion Alert Banner */}
      {completionBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-200 animate-bounce">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600 animate-spin" />
            <span>{completionBanner}</span>
          </div>
          <button
            onClick={() => setCompletionBanner(null)}
            className="text-emerald-700 hover:text-emerald-900 font-extrabold px-2 py-1 cursor-pointer"
          >
            إغلاق ✕
          </button>
        </div>
      )}

      {/* Main Timer Display Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-8 flex flex-col items-center">
        {/* Mode Selector */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setPreset(25, 'study')}
            className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              mode === 'study'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>جلسة مذاكرة (25 د)</span>
          </button>
          <button
            onClick={() => setPreset(5, 'break')}
            className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              mode === 'break'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>استراحة قصيرة (5 د)</span>
          </button>
        </div>

        {/* Big Circular Progress & Digits */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* SVG ring */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-slate-100 dark:text-slate-800 stroke-current"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className={`${
                mode === 'study' ? 'text-emerald-500' : 'text-amber-400'
              } stroke-current transition-all duration-1000`}
              strokeWidth="6"
              strokeDasharray={276}
              strokeDashoffset={276 - (276 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Time digits in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
            <span className="text-5xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-xs font-bold text-slate-400">
              {mode === 'study' ? 'جلسة استذكار نشط' : 'استراحة وانتعاش'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPreset(totalSeconds / 60, mode)}
            className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            title="إعادة ضبط المؤقت"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className={`px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg transition-all hover:scale-105 cursor-pointer ${
              isActive
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
            }`}
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
            <span>{isActive ? 'إيقاف مؤقت' : 'ابدأ التركيز الآن'}</span>
          </button>
        </div>

        {/* Ambient Focus Sounds (Offline Synthesizer) */}
        <div className="w-full pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span>أصوات خلفية لعزل المشتتات (تعمل مباشرة بدون إنترنت):</span>
            </span>
            {soundMode !== 'none' && (
              <button
                onClick={() => {
                  soundEffects.stopAmbient();
                  setSoundMode('none');
                }}
                className="text-rose-500 hover:underline cursor-pointer"
              >
                إيقاف الصوت ✕
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handleSoundSelect('rain')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                soundMode === 'rain'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              🌧️ صوت المطر الهادئ
            </button>
            <button
              onClick={() => handleSoundSelect('alpha')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                soundMode === 'alpha'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              🧘 موجات ألفا للتركيز الذهني
            </button>
            <button
              onClick={() => handleSoundSelect('forest')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                soundMode === 'forest'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              🍃 نسيم الطبيعة الهادئ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
