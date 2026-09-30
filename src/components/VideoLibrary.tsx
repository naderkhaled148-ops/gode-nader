import React, { useState } from 'react';
import {
  Play,
  PlaySquare,
  Clock,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkle,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { CURRICULUM_CHAPTERS } from '../data/curriculumData';
import { VideoLesson } from '../types';
import { soundEffects } from '../utils/soundEffects';

interface VideoLibraryProps {
  onOpenSummaries: (chapterId: string) => void;
  onOpenQuiz: (chapterId: string) => void;
}

export const VideoLibrary: React.FC<VideoLibraryProps> = ({
  onOpenSummaries,
  onOpenQuiz,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson | null>(
    CURRICULUM_CHAPTERS[0].video
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isNarrating, setIsNarrating] = useState<boolean>(false);
  const [playerMode, setPlayerMode] = useState<'embed' | 'interactive'>('embed');

  const allVideos = CURRICULUM_CHAPTERS.map(ch => ({
    ...ch.video,
    chapterNumber: ch.number,
    chapterTitle: ch.title,
    chapterId: ch.id,
  }));

  // Handle Voice Narration of Lesson
  const handleToggleNarration = () => {
    if (!('speechSynthesis' in window)) {
      alert('ميزة القراءة الصوتية غير مدعومة في متصفحك الحالي');
      return;
    }

    if (isNarrating) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
      return;
    }

    if (!selectedVideo) return;

    soundEffects.playTap();
    const narrationText = `درس: ${selectedVideo.title}. إليك أهم النقاط المستفادة: ${selectedVideo.takeaways.join('. ')}.`;
    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.9;

    utterance.onend = () => setIsNarrating(false);
    utterance.onerror = () => setIsNarrating(false);

    window.speechSynthesis.speak(utterance);
    setIsNarrating(true);
  };

  const handleSelectVideo = (vid: VideoLesson) => {
    soundEffects.playTap();
    if (isNarrating) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
    }
    setSelectedVideo(vid);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <PlaySquare className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              مكتبة الفيديوهات والشروحات التفاعلية
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            شاهد مقاطع وثائقية وتجارب معملية حية، أو استمع للشرح الصوتي التفاعلي لتعزيز الفهم والاستيعاب.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio narration button */}
          <button
            onClick={handleToggleNarration}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
              isNarrating
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100'
            }`}
          >
            {isNarrating ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            <span>{isNarrating ? 'إيقاف الراوي الصوتي' : 'استمع للشرح الصوتي للدرس'}</span>
          </button>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl">
            {allVideos.length} فيديو تعليمي
          </span>
        </div>
      </div>

      {/* Main Video Viewer Area */}
      {selectedVideo && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          {/* Player controls mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundEffects.playTap();
                  setPlayerMode('embed');
                  setIsPlaying(true);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  playerMode === 'embed'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                مشغل الفيديو المباشر
              </button>
              <button
                onClick={() => {
                  soundEffects.playTap();
                  setPlayerMode('interactive');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  playerMode === 'interactive'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                لوحة العرض التفاعلية الذكية
              </button>
            </div>

            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>المدة: {selectedVideo.duration}</span>
            </span>
          </div>

          {/* Active Video Display */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner flex items-center justify-center text-white">
            {playerMode === 'embed' ? (
              isPlaying ? (
                <iframe
                  src={`${selectedVideo.videoUrl}?autoplay=1&rel=0&modestbranding=1`}
                  title={selectedVideo.title}
                  className="w-full h-full border-0 rounded-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div
                  onClick={() => {
                    soundEffects.playTap();
                    setIsPlaying(true);
                  }}
                  className="absolute inset-0 cursor-pointer group flex flex-col items-center justify-center text-center p-6 bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url(${selectedVideo.thumbnailUrl})`,
                  }}
                >
                  <div className="w-20 h-20 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-2xl shadow-rose-500/50 group-hover:scale-115 transition-transform duration-300">
                    <Play className="w-9 h-9 fill-white ml-1" />
                  </div>
                  <div className="mt-4 space-y-1">
                    <span className="text-xs font-bold text-rose-400 bg-rose-950/80 px-3.5 py-1 rounded-full border border-rose-800/60 inline-block">
                      اضغط للتشغيل الفوري 🎬
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">{selectedVideo.title}</h3>
                    <p className="text-xs text-slate-300">
                      شاهد الشرح المرئي بدقة عالية مع الرسوم التوضيحية
                    </p>
                  </div>
                </div>
              )
            ) : (
              /* Interactive visual mode with voice & key summaries */
              <div className="absolute inset-0 p-8 flex flex-col justify-between bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-400">لوحة الشرح التفاعلي والمختبر</span>
                  </div>
                  <button
                    onClick={handleToggleNarration}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isNarrating ? 'إيقاف الراوي' : 'تشغيل الراوي الآن'}</span>
                  </button>
                </div>

                <div className="my-auto space-y-3 max-w-xl">
                  <h3 className="text-2xl sm:text-3xl font-black text-white">{selectedVideo.title}</h3>
                  <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>المحاور الجوهرية للدرس:</span>
                    </div>
                    {selectedVideo.takeaways.map((t, idx) => (
                      <p key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400">✦</span>
                        <span>{t}</span>
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-white/10">
                  <span>مدة الحصة: {selectedVideo.duration} دقيقة</span>
                  <button
                    onClick={() => {
                      setPlayerMode('embed');
                      setIsPlaying(true);
                    }}
                    className="text-white hover:text-rose-400 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>التبديل إلى الفيديو المرئي</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Video Metadata & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {selectedVideo.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {selectedVideo.takeaways[0] || 'شرح تفصيلي للمفاهيم والتجارب العلمية'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenSummaries(selectedVideo.id.replace('v_', 'ch').replace('v', 'ch'))}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>ملخص الدرس</span>
              </button>
              <button
                onClick={() => {
                  soundEffects.playVictory();
                  onOpenQuiz(selectedVideo.id.replace('v_', 'ch').replace('v', 'ch'));
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all cursor-pointer shadow-xs"
              >
                <span>خوض اختبار الفصل</span>
              </button>
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>أهم النقاط المستفادة من المشاهدة:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {selectedVideo.takeaways.map((point, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 flex items-start gap-2.5 text-xs text-slate-800 dark:text-slate-200 font-semibold leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Playlist Grid */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
          قائمة فيديوهات وشروحات المنهج كاملة:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allVideos.map(vid => {
            const isSelected = selectedVideo?.id === vid.id;
            return (
              <div
                key={vid.id}
                onClick={() => handleSelectVideo(vid)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-500 ring-2 ring-rose-500/20 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-400'
                }`}
              >
                <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center text-white">
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-bold text-white">
                    {vid.duration} دقيقة
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 block mb-0.5">
                    الفصل {vid.chapterNumber}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {vid.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {vid.takeaways[0]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
