import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  GraduationCap,
  Calendar,
  Clock,
  Flame,
  FileSpreadsheet,
} from 'lucide-react';
import { StudentProfile } from '../types';
import { CURRICULUM_CHAPTERS } from '../data/curriculumData';
import { exportProgressReportCSV } from '../services/storageService';

interface ProgressReportProps {
  profile: StudentProfile;
  onOpenSheetsSync: () => void;
  onRetakeExam: (chapterId: string) => void;
}

export const ProgressReport: React.FC<ProgressReportProps> = ({
  profile,
  onOpenSheetsSync,
  onRetakeExam,
}) => {
  const testedCount = Object.keys(profile.quizScores).length;
  let totalScore = 0;
  let totalMax = 0;

  Object.values(profile.quizScores).forEach(s => {
    totalScore += s.score;
    totalMax += s.total;
  });

  const averagePercentage = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

  const skillsList = [
    { name: 'الملاحظة العلمية الدقيقة', value: profile.skills.observation, icon: '🔍' },
    { name: 'التحليل والاستنتاج المنطقي', value: profile.skills.analysis, icon: '🧠' },
    { name: 'إجراء التجارب العادلة وضبط العوامل', value: profile.skills.fairExperiment, icon: '🔬' },
    { name: 'استيعاب وتذكر المفاهيم الأساسية', value: profile.skills.conceptRetention, icon: '💡' },
    { name: 'الجاهزية للامتحانات المدرسية', value: profile.skills.examReadiness, icon: '📝' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              تقرير التحصيل الدراسي وتطور المهارات العلمية
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            تقرير تحليلي دوري شامل لولي الأمر والطالب، يقيس معدل الاستيعاب، ونسب إنجاز الامتحانات، والمهارات المكتسبة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportProgressReportCSV(profile)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="تصدير كملف Excel / CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير Excel</span>
          </button>
          <button
            onClick={onOpenSheetsSync}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            title="مزامنة فورية مع Google Sheets"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>حفظ في Google Sheets</span>
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="طباعة التقرير"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>متوسط درجات الامتحانات</span>
            <GraduationCap className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {averagePercentage}%
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            {testedCount} اختبارات منجزة
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>أيام الالتزام المتتالية</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-500">
            {profile.streakDays} أيام
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            سلسلة التزام نشطة 🔥
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>إجمالي دقائق الاستذكار</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {profile.totalStudyMinutes} د
          </div>
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
            حوالي {(profile.totalStudyMinutes / 60).toFixed(1)} ساعة مذاكرة
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>المستوى ونقاط الخبرة</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
            المستوى {profile.level}
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            {profile.xp} / {profile.xpToNextLevel} XP
          </span>
        </div>
      </div>

      {/* Skills Assessment Bars */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            مقياس المهارات العلمية المكتسبة:
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            تقييم المهارات الخمس الأساسية بناءً على حل التمارين والتجارب العملية
          </p>
        </div>

        <div className="space-y-4">
          {skillsList.map((skill, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <span>{skill.icon}</span>
                  <span>{skill.name}</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                  {skill.value}%
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${skill.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chapters Exam History Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            سجل نتائج امتحانات الفصول الدراسية:
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            متابعة دقيقة لدرجات كل فصل مع إمكانية إعادة الاختبار لتحسين النتيجة
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                <th className="pb-3 pr-2">الفصل الدراسي</th>
                <th className="pb-3">الدرجة المحققة</th>
                <th className="pb-3">النسبة المئوية</th>
                <th className="pb-3">تاريخ الاختبار</th>
                <th className="pb-3">الحالة</th>
                <th className="pb-3 text-left pl-2">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {CURRICULUM_CHAPTERS.map(ch => {
                const res = profile.quizScores[ch.id];
                const pct = res ? Math.round((res.score / res.total) * 100) : null;
                const isPassed = res && pct! >= 75;

                return (
                  <tr key={ch.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 pr-2 font-bold text-slate-900 dark:text-white">
                      الفصل {ch.number}: {ch.title.split(':')[0]}
                    </td>
                    <td className="py-3.5 font-semibold text-slate-700 dark:text-slate-300">
                      {res ? `${res.score} من ${res.total}` : '—'}
                    </td>
                    <td className="py-3.5 font-extrabold">
                      {pct !== null ? (
                        <span className={pct >= 75 ? 'text-emerald-600' : 'text-amber-500'}>
                          {pct}%
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3.5 text-slate-400">{res ? res.date : '—'}</td>
                    <td className="py-3.5">
                      {res ? (
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                            isPassed
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {isPassed ? 'تم الاجتياز بتفوق' : 'يحتاج مراجعة'}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">قيد الانتظار</span>
                      )}
                    </td>
                    <td className="py-3.5 text-left pl-2">
                      <button
                        onClick={() => onRetakeExam(ch.id)}
                        className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        {res ? 'إعادة الاختبار' : 'بدء الاختبار'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
