import React, { useState } from 'react';
import {
  FileCheck2,
  Eye,
  EyeOff,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Filter,
} from 'lucide-react';
import { WORKED_EXAMPLES, CURRICULUM_CHAPTERS } from '../data/curriculumData';
import { WorkedExample } from '../types';

export const WorkedExamples: React.FC = () => {
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const toggleSolution = (id: string) => {
    setRevealedSolutions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredExamples = WORKED_EXAMPLES.filter(ex => {
    if (selectedFilter === 'all') return true;
    return ex.chapterId === selectedFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              نماذج وأمثلة للحل بالخطوات (تدرّب وحاول)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            أسئلة تطبيقية تحاكي امتحانات نهاية الفصل ونماذج كتاب المدرسة، مع منهجية "كيف تفكر كعالم" وإخفاء الحل لتجرب بنفسك أولاً.
          </p>
        </div>

        <button
          onClick={() => {
            const allRevealed: Record<string, boolean> = {};
            filteredExamples.forEach(e => (allRevealed[e.id] = true));
            setRevealedSolutions(allRevealed);
          }}
          className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
        >
          كشف جميع الحلول
        </button>
      </div>

      {/* Filter by Chapter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
            selectedFilter === 'all'
              ? 'bg-emerald-600 text-white'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          جميع الأمثلة ({WORKED_EXAMPLES.length})
        </button>
        {CURRICULUM_CHAPTERS.map(ch => (
          <button
            key={ch.id}
            onClick={() => setSelectedFilter(ch.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
              selectedFilter === ch.id
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            فصل {ch.number}: {ch.title.split(':')[0]}
          </button>
        ))}
      </div>

      {/* Examples List */}
      <div className="space-y-4">
        {filteredExamples.map((ex, idx) => {
          const isRevealed = !!revealedSolutions[ex.id];
          const chapter = CURRICULUM_CHAPTERS.find(c => c.id === ex.chapterId);

          return (
            <div
              key={ex.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-all"
            >
              {/* Question Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      {ex.context || `مثال تطبيقي ${idx + 1}`}
                    </h3>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      {chapter ? `الفصل ${chapter.number}: ${chapter.title.split(':')[0]}` : 'تطبيق علمي'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleSolution(ex.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isRevealed
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                >
                  {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{isRevealed ? 'إخفاء الإجابة' : 'عرض الحل والخطوات'}</span>
                </button>
              </div>

              {/* Question Body */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                <span className="text-xs font-bold text-slate-400 block mb-1">
                  نص السؤال والمشكلة العلمية:
                </span>
                <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-relaxed">
                  {ex.question}
                </p>
              </div>

              {/* Solution Area (Collapsible) */}
              {isRevealed ? (
                <div className="space-y-4 animate-in fade-in duration-200 pt-2">
                  {/* How to think like a scientist */}
                  <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-black text-amber-800 dark:text-amber-300">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span>كيف تفكر كعالم لحل هذا السؤال؟</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {ex.howToThink}
                    </p>
                  </div>

                  {/* Solution */}
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 space-y-1.5">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">
                      خطوات الحل المتسلسلة ونموذج الإجابة:
                    </span>
                    <p className="text-xs sm:text-sm font-extrabold text-emerald-950 dark:text-emerald-100 leading-relaxed">
                      {ex.solution}
                    </p>
                  </div>

                  {/* Scientific Rule */}
                  {ex.scientificRule && (
                    <div className="p-3.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <div className="text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
                        <strong>القاعدة العلمية المطبقة:</strong> {ex.scientificRule}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
                  <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
                    💡 فكر وجرّب الإجابة في كراستك أولاً قبل الضغط على "عرض الحل والخطوات"!
                  </p>
                  <button
                    onClick={() => toggleSolution(ex.id)}
                    className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    أنا جاهز، اكشف لي نموذج الحل الآن ←
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
