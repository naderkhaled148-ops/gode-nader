import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  Moon,
  Sun,
  Cloud,
  CloudCheck,
  Bell,
  Award,
  Layers,
  CheckCircle,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { StudentProfile, GoogleSheetsConfig } from '../types';

interface HeaderProps {
  profile: StudentProfile;
  sheetsConfig: GoogleSheetsConfig;
  onOpenSheetsSync: () => void;
  onOpenRewards: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  notificationsCount: number;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  sheetsConfig,
  onOpenSheetsSync,
  onOpenRewards,
  isDark,
  onToggleTheme,
  notificationsCount,
  onOpenNotifications,
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const progressPercent = Math.min(100, Math.round((profile.xp / profile.xpToNextLevel) * 100));

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand & Companion Mascot */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 ring-2 ring-emerald-500/20">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                منصة نُـبـوغ
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
                  الصف الخامس
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              رفيق المذاكرة الذكي • منهج العلوم والمراجعة الفعالة
            </p>
          </div>
        </div>

        {/* Center / Stats: Streak & Level */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Streak Flame */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 cursor-pointer hover:scale-105 transition-transform"
            title="أيام الالتزام المتتالية بالمذاكرة"
            onClick={onOpenRewards}
          >
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
            <span className="text-sm font-bold">{profile.streakDays}</span>
            <span className="text-xs font-medium hidden md:inline">أيام التزام</span>
          </div>

          {/* Level & XP */}
          <div
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-200 cursor-pointer hover:scale-105 transition-transform"
            onClick={onOpenRewards}
            title="نقاط الخبرة والمستوى الأكاديمي"
          >
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-xs font-bold leading-tight">
                <span>المستوى {profile.level}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">({profile.xp} XP)</span>
              </div>
              <div className="w-18 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-0.5">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls: Google Sheets Sync, Theme, Notifications */}
        <div className="flex items-center gap-2">
          {/* Online/Offline Status Indicator */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
              isOnline
                ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
            }`}
            title={isOnline ? 'متصل بالإنترنت - يتم الحفظ والمزامنة' : 'وضع غير متصل - يعمل بدون إنترنت مع حفظ محلي آمن'}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span className="hidden lg:inline">{isOnline ? 'متصل' : 'بدون نت'}</span>
          </div>

          {/* Google Sheets Sync Button */}
          <button
            onClick={onOpenSheetsSync}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              sheetsConfig.lastSynced
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-emerald-500'
            }`}
            title="مزامنة مع Google Sheets ونسخ احتياطي سحابي"
          >
            <Cloud className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Google Sheets</span>
            {sheetsConfig.lastSynced && (
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
            )}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="التنبيهات والتذكيرات الدراسية"
            aria-label="التنبيهات"
          >
            <Bell className="w-5 h-5" />
            {notificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
                {notificationsCount}
              </span>
            )}
          </button>

          {/* Theme Toggle (Day / Night Mode) */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي (مريح للعين)'}
            aria-label="تبديل الوضع"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
};
