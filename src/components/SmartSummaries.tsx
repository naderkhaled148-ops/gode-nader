import React, { useState } from 'react';
import {
  BookOpenText,
  Volume2,
  VolumeX,
  Sparkles,
  Layers,
  FlaskConical,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Share2,
  Printer,
  Compass,
} from 'lucide-react';
import { CURRICULUM_CHAPTERS } from '../data/curriculumData';
import { Chapter } from '../types';
import { soundEffects } from '../utils/soundEffects';

interface SmartSummariesProps {
  initialChapterId?: string;
  onStartExam: (chapterId: string) => void;
}

export const SmartSummaries: React.FC<SmartSummariesProps> = ({
  initialChapterId,
  onStartExam,
}) => {
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    initialChapterId || CURRICULUM_CHAPTERS[0].id
  );
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'concepts' | 'diagrams' | 'experiment' | 'notes'>('concepts');

  const selectedChapter: Chapter =
    CURRICULUM_CHAPTERS.find(c => c.id === selectedChapterId) || CURRICULUM_CHAPTERS[0];

  // Text to speech for smart reading with fallback and voice detection
  const handleToggleSpeech = () => {
    soundEffects.playTap();
    if (!('speechSynthesis' in window)) {
      alert('ميزة القراءة الصوتية غير مدعومة في متصفحك الحالي');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${selectedChapter.title}. ${selectedChapter.summary.overview}. ${selectedChapter.summary.keyPoints.join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);

    // Pick best Arabic voice if available
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(v => v.lang.startsWith('ar') || v.lang.includes('ar'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }
    utterance.lang = 'ar-SA';
    utterance.rate = 0.92;
    utterance.pitch = 1.05;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
              <BookOpenText className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              الملخصات الذكية والمخططات التوضيحية
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            تلخيص تفاعلي لكل وحدة وفصل دراسي، يدعم المخططات البصرية، والتجارب العادلة، والقراءة الصوتية لتعزيز الفهم.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSpeech}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
            title="استماع للملخص بالصوت"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            <span>{isSpeaking ? 'إيقاف الاستماع' : 'استمع للملخص'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="طباعة بطاقة الملخص"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chapter Selection Horizontal Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {CURRICULUM_CHAPTERS.map(ch => {
          const isSelected = ch.id === selectedChapterId;
          return (
            <button
              key={ch.id}
              onClick={() => {
                setSelectedChapterId(ch.id);
                if (isSpeaking) window.speechSynthesis?.cancel();
                setIsSpeaking(false);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/30'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-400'
              }`}
            >
              <span>فصل {ch.number}: {ch.title.split(':')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Chapter Content Body */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        {/* Chapter Header Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md">
              {selectedChapter.unit} • الفصل {selectedChapter.number}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {selectedChapter.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              {selectedChapter.summary.overview}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-emerald-50/70 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg font-bold">
              {selectedChapter.character === 'الذكي' ? '🐕' : selectedChapter.character === 'الفطن' ? '🐱' : '🐥'}
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 block">
                مرشد هذا الفصل
              </span>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                {selectedChapter.character}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Sub-navigation */}
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('concepts')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'concepts'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            💡 النقاط الجوهرية والمفاهيم
          </button>
          <button
            onClick={() => setActiveTab('diagrams')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'diagrams'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            📊 المخططات والرسوم التفاعلية
          </button>
          <button
            onClick={() => setActiveTab('experiment')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'experiment'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            🔬 ركن التجربة العلمية العادلة
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            ⚠️ أخطاء شائعة وتحذيرات
          </button>
        </div>

        {/* Tab 1: Key Concepts */}
        {activeTab === 'concepts' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
              أهم المفاهيم والحقائق العلمية المقررة:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedChapter.summary.keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Diagrams */}
        {activeTab === 'diagrams' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
              المخطط البياني والتوضيحي للفصل:
            </h4>
            <div className="space-y-3">
              {(selectedChapter.summary.diagrams || []).map((diag, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-slate-800/80 dark:to-emerald-950/20 border border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <h5 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                      {diag.title}
                    </h5>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {diag.description}
                  </p>

                  <div className="pt-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                      العناصر والمكونات الرئيسية:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {diag.labels.map((lbl, eIdx) => (
                        <div
                          key={eIdx}
                          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-xs"
                        >
                          <strong className="block text-slate-900 dark:text-white">✦ {lbl.name}</strong>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">{lbl.info}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Fair Experiment Corner */}
        {activeTab === 'experiment' && selectedChapter.summary.experimentGuide && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {selectedChapter.summary.experimentGuide.title}
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-300">
                    قواعد التجربة العادلة وضبط المتغيرات العلمية
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/40 space-y-1.5">
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 block">
                    العامل المتغير الوحيد (المختبر):
                  </span>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">
                    {selectedChapter.summary.experimentGuide.testedFactor}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/40 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                    العوامل المثبتة (لضمان تجربة عادلة):
                  </span>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">
                    {selectedChapter.summary.experimentGuide.fixedFactors.join(' • ')}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 leading-relaxed font-semibold">
                🎯 <strong>الاستنتاج العلمي:</strong> {selectedChapter.summary.experimentGuide.conclusion}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Common Pitfalls & Core Rule */}
        {activeTab === 'notes' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 block">
                القاعدة الذهبية للفصل:
              </span>
              <p className="text-sm sm:text-base font-extrabold text-indigo-950 dark:text-indigo-100 leading-relaxed">
                ⚖️ {selectedChapter.summary.coreRule}
              </p>
            </div>

            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 pt-2">
              تنبيهات وأخطاء شائعة يقع فيها الطلاب في الامتحانات:
            </h4>
            <div className="space-y-2.5">
              <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 flex items-start gap-3">
                <span className="text-base shrink-0">⚠️</span>
                <p className="text-xs sm:text-sm font-bold text-rose-950 dark:text-rose-200 leading-relaxed">
                  تذكر دائماً أن العضلات تشد وتسحب العظام فقط، ولا تدفع العظام أبداً!
                </p>
              </div>
              <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 flex items-start gap-3">
                <span className="text-base shrink-0">⚠️</span>
                <p className="text-xs sm:text-sm font-bold text-rose-950 dark:text-rose-200 leading-relaxed">
                  في التجربة العادلة، تغيير أكثر من عامل واحد في نفس الوقت يُبطل التجربة ويجعل النتائج غير موثوقة.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA to start exam */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            هل استوعبت نقاط هذا الفصل؟ اختبر فهمك الآن وتأكد من تثبيت المعلومات!
          </div>
          <button
            onClick={() => onStartExam(selectedChapter.id)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <span>بدء امتحان الفصل {selectedChapter.number}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
