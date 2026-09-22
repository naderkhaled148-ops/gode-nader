import React from 'react';
import {
  Award,
  Flame,
  Sparkles,
  Trophy,
  CheckCircle2,
  Lock,
  X,
  Star,
} from 'lucide-react';
import { StudentProfile } from '../types';
import { AVAILABLE_BADGES } from '../data/curriculumData';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
}

export const RewardsModal: React.FC<RewardsModalProps> = ({
  isOpen,
  onClose,
  profile,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                خزانة الأوسمة والجوائز التشجيعية
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                نظام المكافآت والأوسمة المحفزة لالتزام وتفوق أبطال العلوم
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level and streak stats card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center text-2xl shadow-md">
              🏅
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                الرتبة الأكاديمية
              </span>
              <h4 className="text-base font-black text-slate-900 dark:text-white">
                المستوى {profile.level}: باحث متميز
              </h4>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-0.5">
                {profile.xp} نقطة خبرة (متبقي {profile.xpToNextLevel - profile.xp} XP للمستوى التالي)
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1 text-amber-500 font-black text-base">
              <Flame className="w-5 h-5 fill-amber-500" />
              <span>{profile.streakDays}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400">أيام التزام</span>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>الأوسمة العلمية المتاحة:</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AVAILABLE_BADGES.map(badge => {
              const isUnlocked = profile.badges.includes(badge.id);

              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                    isUnlocked
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                      isUnlocked
                        ? 'bg-white dark:bg-slate-800 shadow-xs ring-2 ring-emerald-500/20'
                        : 'bg-slate-200 dark:bg-slate-700 grayscale'
                    }`}
                  >
                    {isUnlocked ? badge.icon : '🔒'}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <h5 className="text-xs font-black text-slate-900 dark:text-white">
                        {badge.name}
                      </h5>
                      {isUnlocked && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {badge.description}
                    </p>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block pt-0.5">
                      {isUnlocked ? '✦ وسام مكتسب' : 'قيد الإنجاز'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
