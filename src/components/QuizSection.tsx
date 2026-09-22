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
} from 'lucide-react';
import { CURRICULUM_CHAPTERS } from '../data/curriculumData';
import { Chapter, QuizQuestion, StudentProfile } from '../types';

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
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const selectedChapter =
    CURRICULUM_CHAPTERS.find(c => c.id === selectedChapterId) || CURRICULUM_CHAPTERS[0];
  const questions: QuizQuestion[] = selectedChapter.quiz.questions;

  const currentQ = questions[currentQuestionIdx];

  const handleStartQuiz = (chId: string) => {
    setSelectedChapterId(chId);
    setInQuizMode(true);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setShowExplanation(false);
    setIsFinished(false);
  };

  const handleSelectOption = (optIdx: number) => {
    if (showExplanation || isFinished) return;
    setUserAnswers(prev => ({ ...prev, [currentQuestionIdx]: optIdx }));
    setShowExplanation(true);

    // If correct, play subtle victory or trigger mini confetti
    if (optIdx === currentQ.correctAnswer) {
      try {
        confetti({
          particleCount: 25,
          spread: 40,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // Safe fallback
      }
    }
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      // Finish Quiz
      let score = 0;
      questions.forEach((q, idx) => {
        if (userAnswers[idx] === q.correctAnswer) {
          score += 1;
        }
      });
      setIsFinished(true);
      onQuizComplete(selectedChapter.id, score, questions.length);

      // Huge confetti celebration if passed
      if (score >= questions.length * 0.75) {
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch (e) {}
      }
    }
  };

  const calculateFinalScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
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
                بنك الامتحانات الشاملة لكل فصول العلوم
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              امتحان مخصص لكل فصل من فصول الكتاب المدرسي الـ 9 مع تصحيح فوري وشرح تفصيلي للإجابات الصحيحة.
            </p>
          </div>

          <div className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            أكملت {Object.keys(profile.quizScores).length} من {CURRICULUM_CHAPTERS.length} اختبارات
          </div>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURRICULUM_CHAPTERS.map(ch => {
            const result = profile.quizScores[ch.id];
            const isPassed = result && result.score / result.total >= 0.75;
            const pct = result ? Math.round((result.score / result.total) * 100) : null;

            return (
              <div
                key={ch.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
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

                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug">
                    {ch.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {ch.summary.overview}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span>💡 شخصية الفصل: <strong>{ch.character}</strong></span>
                    <span>•</span>
                    <span>{ch.quiz.questions.length} أسئلة</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleStartQuiz(ch.id)}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>{result ? 'إعادة الاختبار' : 'بدء الامتحان'}</span>
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
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">
            الفصل {selectedChapter.number}: {selectedChapter.unit}
          </span>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            {selectedChapter.title}
          </h2>
        </div>

        <button
          onClick={() => setInQuizMode(false)}
          className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
        >
          العودة لقائمة الفصول
        </button>
      </div>

      {!isFinished ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>السؤال {currentQuestionIdx + 1} من {questions.length}</span>
              <span>التقدم: {Math.round(((currentQuestionIdx + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
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
                <span>{currentQuestionIdx < questions.length - 1 ? 'السؤال التالي' : 'إنهاء وعرض النتيجة'}</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Finished View */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-emerald-400 mx-auto flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20">
            {calculateFinalScore() >= questions.length * 0.75 ? '🏆' : '🌱'}
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {calculateFinalScore() === questions.length
                ? 'درجة كاملة! عبقري متألق 🌟'
                : calculateFinalScore() >= questions.length * 0.75
                ? 'أحسنت صنعاً! مستوى ممتاز 🎉'
                : 'محاولة طيبة، راجع الملخص وكرر الاختبار! 📚'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              لقد أجبت بشكل صحيح على {calculateFinalScore()} من إجمالي {questions.length} أسئلة
            </p>
          </div>

          {/* Score card */}
          <div className="inline-flex items-center gap-6 px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-xs text-slate-400 block font-semibold">النسبة المئوية</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {Math.round((calculateFinalScore() / questions.length) * 100)}%
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
              {questions.map((q, idx) => {
                const isCorrect = userAnswers[idx] === q.correctAnswer;
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

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => handleStartQuiz(selectedChapter.id)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة الاختبار</span>
            </button>
            <button
              onClick={() => setInQuizMode(false)}
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
