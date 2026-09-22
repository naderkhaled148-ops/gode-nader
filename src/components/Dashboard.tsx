import React from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Flame,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  BookOpen,
  PlayCircle,
  HelpCircle,
  TrendingUp,
  Award,
  ChevronLeft,
} from 'lucide-react';
import { StudentProfile, StudyTask, DailyChallenge } from '../types';
import { CURRICULUM_CHAPTERS } from '../data/curriculumData';
import { TabType } from './Navigation';

interface DashboardProps {
  profile: StudentProfile;
  tasks: StudyTask[];
  challenges: DailyChallenge[];
  onSelectTab: (tab: TabType, extraParam?: string) => void;
  onToggleTask: (taskId: string) => void;
  onClaimChallenge: (challengeId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  tasks,
  challenges,
  onSelectTab,
  onToggleTask,
  onClaimChallenge,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.date === todayStr);
  const completedTodayTasks = todayTasks.filter(t => t.completed).length;

  const passedChaptersCount = Object.keys(profile.quizScores).length;
  const curriculumProgressPct = Math.round((passedChaptersCount / CURRICULUM_CHAPTERS.length) * 100);

  // Determine current focus chapter (first unpassed or Chapter 1)
  const nextChapter =
    CURRICULUM_CHAPTERS.find(c => !profile.quizScores[c.id]) || CURRICULUM_CHAPTERS[0];

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card with Textbook Mascot Characters */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 text-white p-6 sm:p-8 shadow-md">
        {/* Background decorative circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-2xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold text-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>مرحباً بك مجدداً يا بطل العلوم • {profile.name}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
              خطة المذاكرة جاهزة، وأبطالك الثلاثة (الذكي، الفطن، العبقري) بانتظارك!
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              لديك اليوم <strong className="text-amber-300 underline font-bold">{todayTasks.length} مهام مراجعة</strong>. أنجزتها بنسبة{' '}
              <strong className="text-white">{todayTasks.length ? Math.round((completedTodayTasks / todayTasks.length) * 100) : 100}%</strong> حتى الآن.
            </p>
          </div>

          {/* Quick Mascot Box & Start Focus */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('focus')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition-all hover:scale-102 cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              <span>بدء جلسة مذاكرة (25 دقيقة)</span>
            </button>
            <button
              onClick={() => onSelectTab('quizzes')}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-emerald-300" />
              <span>خوض امتحان جديد</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Recommended Path + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Learning Path (Smart Suggestion) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  مسار التعلم المقترح لك اليوم
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  بناءً على تقدمك الدراسي الحالي في منهج العلوم
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              الفصل {nextChapter.number}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                  {nextChapter.unit}
                </span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  الفصل {nextChapter.number}: {nextChapter.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                  {nextChapter.summary.overview}
                </p>
              </div>
              <div className="w-16 h-16 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex flex-col items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-medium">الشخصية</span>
                <span className="text-sm font-extrabold">{nextChapter.character}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 italic flex items-center gap-2">
              <span className="text-amber-500 font-bold not-italic">💬 {nextChapter.character}:</span>
              <span>"{nextChapter.characterQuote}"</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => onSelectTab('summaries')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>قراءة الملخص الذكي</span>
              </button>
              <button
                onClick={() => onSelectTab('examples')}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>أمثلة محلولة من الكتاب</span>
              </button>
              <button
                onClick={() => onSelectTab('quizzes')}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>بدء الاختبار</span>
              </button>
            </div>
          </div>

          {/* Curriculum overall progress bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">
                إجمالي إتقان فصول كتاب العلوم ({passedChaptersCount} من {CURRICULUM_CHAPTERS.length} فصول)
              </span>
              <span className="text-emerald-600 dark:text-emerald-400">{curriculumProgressPct}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${curriculumProgressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Daily Challenges Widget */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  تحديات اليوم الممتعة
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  اكسب نقاط XP إضافية لترقية مستواك
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {challenges.map(ch => {
              const isReady = ch.current >= ch.target;
              return (
                <div
                  key={ch.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    ch.completed
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <span className="text-xl">{ch.icon}</span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {ch.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                          {ch.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                      +{ch.xpReward} XP
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between gap-3">
                    <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${Math.min(100, (ch.current / ch.target) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 shrink-0">
                      {ch.current} / {ch.target}
                    </span>

                    {ch.completed ? (
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        تم الاستلام
                      </span>
                    ) : isReady ? (
                      <button
                        onClick={() => onClaimChallenge(ch.id)}
                        className="px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold transition-colors cursor-pointer"
                      >
                        استلام الجائزة!
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400">جاري الإنجاز</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Today's Revision Schedule Preview & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  مهام جدول المذاكرة لليوم
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  التزم بالخطة الزمنية لتحقيق أعلى معدل تحصيل
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectTab('schedule')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>عرض الجدول كاملاً</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {todayTasks.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              لا توجد مهام مجدولة لليوم. أضف مهمة جديدة من تبويب الجدول!
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {todayTasks.map(task => (
                <div
                  key={task.id}
                  className="py-3 flex items-center justify-between gap-3 group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                        task.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                      }`}
                      aria-label="تحديد كمكتمل"
                    >
                      {task.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <div>
                      <p
                        className={`text-sm font-bold ${
                          task.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {task.subject}
                        </span>
                        <span>•</span>
                        <span>{task.time}</span>
                        <span>•</span>
                        <span>{task.durationMinutes} دقيقة</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      task.priority === 'high'
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                        : task.priority === 'medium'
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {task.priority === 'high' ? 'أولوية قصوى' : task.priority === 'medium' ? 'متوسطة' : 'عادية'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Teacher Chat Banner */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-2xl p-6 text-white border border-indigo-700 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl">
              👨‍🏫
            </div>
            <h3 className="text-lg font-extrabold tracking-tight">
              هل واجهت نقطة صعبة في منهج العلوم؟
            </h3>
            <p className="text-xs text-indigo-100/90 leading-relaxed">
              تحدث فوراً مع مستر رضا نصار أو البروفيسور العبقري للإجابة على تساؤلاتك وتبسيط المفاهيم الصعبة خطوة بخطوة.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('tutor')}
            className="w-full py-2.5 rounded-xl bg-white text-indigo-950 hover:bg-indigo-50 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-102 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span>اسأل المعلم الآن (استجابة فورية)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
