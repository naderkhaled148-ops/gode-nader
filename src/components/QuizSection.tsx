import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Award,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  Layers,
  Shuffle,
  ShieldAlert,
  Flame,
} from 'lucide-react';
import { CURRICULUM_CHAPTERS } from '../data/curriculumData';
import { getExamModelsForChapter } from '../data/examModelsData';
import { Chapter, QuizQuestion, StudentProfile, ExamModel } from '../types';
import { soundEffects } from '../utils/soundEffects';

interface QuizSectionProps {
  profile: StudentProfile;
  onQuizComplete: (chapterId: string, score: number, total: number) => void;
  onOpenSummaries: (chapterId: string) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  profile,
  onQuizComplete,
  onOpenSummaries,
}) => {
  const [selectedChapterId, setSelectedChapterId] = useState<string>(CURRICULUM_CHAPTERS[0].id);
  const [inQuizMode, setInQuizMode] = useState<boolean>(false);
  const [selectedModelCode, setSelectedModelCode] = useState<'A' | 'B' | 'C'>('A');
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [selectedExamModel, setSelectedExamModel] = useState<ExamModel | null>(null);

  const selectedChapter =
    CURRICULUM_CHAPTERS.find(c => c.id === selectedChapterId) || CURRICULUM_CHAPTERS[0];

  // Load models for current chapter
  const currentChapterModels = getExamModelsForChapter(selectedChapter.id, selectedChapter.quiz);

  // Shuffle and randomize questions helper to prevent repetition
  const shuffleQuestions = (qs: QuizQuestion[]) => {
    return [...qs].sort(() => Math.random() - 0.5);
  };

  const handleStartExam = (chId: string, modelCode: 'A' | 'B' | 'C' = 'A') => {
    soundEffects.playTap();
    const ch = CURRICULUM_CHAPTERS.find(c => c.id === chId) || CURRICULUM_CHAPTERS[0];
    const models = getExamModelsForChapter(ch.id, ch.quiz);
    const chosenModel = models.find(m => m.modelCode === modelCode) || models[0];

    // Randomize questions inside the model so consecutive attempts differ
    const randomized = shuffleQuestions(chosenModel.questions);

    setSelectedChapterId(chId);
    setSelectedModelCode(modelCode);
    setSelectedExamModel(chosenModel);
    setActiveQuestions(randomized);
    setInQuizMode(true);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setShowExplanation(false);
    setIsFinished(false);
  };

  const currentQ = activeQuestions[currentQuestionIdx] || {
    id: 'placeholder',
    type: 'multiple-choice',
    question: '',
    options: [],
    correctAnswer: 0,
    explanation: '',
    skillTested: 'conceptRetention',
  };

  const handleSelectOption = (optIdx: number) => {
    if (showExplanation || isFinished) return;
    setUserAnswers(prev => ({ ...prev, [currentQuestionIdx]: optIdx }));
    setShowExplanation(true);

    const isCorrect = optIdx === Number(currentQ.correctAnswer);

    if (isCorrect) {
      soundEffects.playCorrect();
      try {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.7 },
        });
      } catch (e) {}
    } else {
      soundEffects.playIncorrect();
    }
  };

  const handleNextQuestion = () => {
    soundEffects.playTap();
    setShowExplanation(false);
    if (currentQuestionIdx < activeQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      // Finish Quiz
      let score = 0;
      activeQuestions.forEach((q, idx) => {
        if (userAnswers[idx] === Number(q.correctAnswer)) {
          score += 1;
        }
      });
      setIsFinished(true);
      onQuizComplete(selectedChapter.id, score, activeQuestions.length);

      if (score >= activeQuestions.length * 0.75) {
        soundEffects.playVictory();
        try {
          confetti({
            particleCount: 110,
            spread: 85,
            origin: { y: 0.6 },
          });
        } catch (e) {}
      }
    }
  };

  const calculateFinalScore = () => {
    let score = 0;
    activeQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === Number(q.correctAnswer)) {
        score += 1;
      }
    });
    return score;
  };

  // Chapter Selection List View
  if (!inQuizMode) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                بنك الامتحانات الذكية ونماذج الاختبارات المتعددة
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              اختر أي فصل ثم حدد نموذج الامتحان المناسب (أ، ب، أو ج) بأسئلة عشوائية غير مكررة ومؤثرات صوتية فورية.
            </p>
          </div>

          <div className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>3 نماذج امتحانات لكل فصل دراسي</span>
          </div>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CURRICULUM_CHAPTERS.map(ch => {
            const models = getExamModelsForChapter(ch.id, ch.quiz);
            const result = profile.quizScores[ch.id];
            const isPassed = result && result.score / result.total >= 0.75;
            const pct = result ? Math.round((result.score / result.total) * 100) : null;

            return (
              <div
                key={ch.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md">
                      الفصل {ch.number}
                    </span>
                    {result ? (
                      <span
                        className={`text-xs font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isPassed
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {pct}% ({result.score}/{result.total})
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        لم يختبر بعد
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug">
                      {ch.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {ch.summary.overview}
                    </p>
                  </div>

                  {/* Multi-model Selector for this chapter */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                      اختر نموذج الامتحان:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {models.map(m => (
                        <button
                          key={m.id}
                          onClick={() => handleStartExam(ch.id, m.modelCode as any)}
                          className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 transition-all flex flex-col items-center justify-center cursor-pointer"
                        >
                          <span className="text-emerald-600 dark:text-emerald-400 font-black">
                            نموذج {m.modelCode}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {m.difficulty === 'easy' ? 'أساسي' : m.difficulty === 'medium' ? 'متوسط' : 'متقدم'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleStartExam(ch.id, 'A')}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>{result ? 'إعادة الاختبار (عشوائي)' : 'بدء الاختبار الشامل'}</span>
                  </button>
                  <button
                    onClick={() => onOpenSummaries(ch.id)}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="مراجعة ملخص الفصل أولاً"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Quiz View
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header bar of quiz */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
              الفصل {selectedChapter.number}
            </span>
            <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md">
              {selectedExamModel?.name || `نموذج (${selectedModelCode})`}
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
            {selectedChapter.title}
          </h2>
        </div>

        <button
          onClick={() => {
            soundEffects.playTap();
            setInQuizMode(false);
          }}
          className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
        >
          العودة لقائمة الفصول
        </button>
      </div>

      {!isFinished ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          {/* Progress bar and Model badge */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Shuffle className="w-3.5 h-3.5 text-emerald-500" />
                <span>السؤال {currentQuestionIdx + 1} من {activeQuestions.length} (ترتيب عشوائي غير مكرر)</span>
              </span>
              <span>التقدم: {Math.round(((currentQuestionIdx + 1) / activeQuestions.length) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIdx + 1) / activeQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {(currentQ.options || []).map((opt, optIdx) => {
              const isSelected = userAnswers[currentQuestionIdx] === optIdx;
              const isCorrect = optIdx === Number(currentQ.correctAnswer);

              let btnStyle =
                'border-slate-200 dark:border-slate-700 hover:border-emerald-500 bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-200';

              if (showExplanation) {
                if (isCorrect) {
                  btnStyle =
                    'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnStyle =
                    'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200';
                }
              } else if (isSelected) {
                btnStyle = 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 font-bold';
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={showExplanation}
                  className={`w-full text-right p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                      {['أ', 'ب', 'ج', 'د'][optIdx]}
                    </span>
                    <span className="text-sm font-medium leading-relaxed">{opt}</span>
                  </div>

                  {showExplanation && (
                    <div className="shrink-0">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-rose-600" />
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {showExplanation && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800 dark:text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>الشرح العلمي والتعليل:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Bottom Next Button */}
          {showExplanation && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <span>{currentQuestionIdx < activeQuestions.length - 1 ? 'السؤال التالي' : 'إنهاء وعرض النتيجة'}</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Finished View */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-emerald-400 mx-auto flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20">
            {calculateFinalScore() >= activeQuestions.length * 0.75 ? '🏆' : '🌱'}
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {calculateFinalScore() === activeQuestions.length
                ? 'درجة كاملة! عبقري متألق 🌟'
                : calculateFinalScore() >= activeQuestions.length * 0.75
                ? 'أحسنت صنعاً! مستوى ممتاز 🎉'
                : 'محاولة طيبة، راجع الملخص وكرر الاختبار! 📚'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              لقد أجبت بشكل صحيح على {calculateFinalScore()} من إجمالي {activeQuestions.length} أسئلة في {selectedExamModel?.name || `نموذج (${selectedModelCode})`}
            </p>
          </div>

          {/* Score card */}
          <div className="inline-flex items-center gap-6 px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs text-slate-400 block font-semibold">النسبة المئوية</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {Math.round((calculateFinalScore() / activeQuestions.length) * 100)}%
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <span className="text-xs text-slate-400 block font-semibold">النقاط المكتسبة</span>
              <span className="text-2xl font-black text-amber-500">
                +{calculateFinalScore() * 15} XP
              </span>
            </div>
          </div>

          {/* Review Mistakes List */}
          <div className="text-right space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">
              مراجعة الأسئلة وتثبيت الإجابات النموذجية:
            </h4>
            <div className="space-y-2">
              {activeQuestions.map((q, idx) => {
                const isCorrect = userAnswers[idx] === Number(q.correctAnswer);
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                      isCorrect
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200'
                        : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40 text-rose-900 dark:text-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold mb-1">
                      {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
                      <span>{q.question}</span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 pr-6">
                      الإجابة الصحيحة: <strong>{q.options ? q.options[Number(q.correctAnswer)] || q.correctAnswer : q.correctAnswer}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Other exam models recommendation */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h5 className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
              جرب نموذجاً آخر لنفس الفصل دون تكرار الأسئلة:
            </h5>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {currentChapterModels.map(m => (
                <button
                  key={m.id}
                  onClick={() => handleStartExam(selectedChapter.id, m.modelCode as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    m.modelCode === selectedModelCode
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
                  }`}
                >
                  بدء نموذج {m.modelCode} ({m.difficulty === 'easy' ? 'أساسي' : m.difficulty === 'medium' ? 'متوسط' : 'تحدي عباقرة'})
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => handleStartExam(selectedChapter.id, selectedModelCode)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة الاختبار الحالي</span>
            </button>
            <button
              onClick={() => {
                soundEffects.playTap();
                setInQuizMode(false);
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-md cursor-pointer transition-colors"
            >
              <span>العودة لجميع الامتحانات</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
