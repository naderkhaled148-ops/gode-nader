import React, { useState } from 'react';
import {
  Play,
  PlaySquare,
  Clock,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { CURRICULUM_CHAPTERS } from '../data/curriculumData';
import { VideoLesson } from '../types';

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

  const allVideos = CURRICULUM_CHAPTERS.map(ch => ({
    ...ch.video,
    chapterNumber: ch.number,
    chapterTitle: ch.title,
    chapterId: ch.id,
  }));

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
              مكتبة الفيديوهات التعليمية الممتعة
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            مقاطع تعليمية وتجارب معملية قصيرة مصممة لتبسيط مفاهيم العلوم للصف الخامس، مع أهم النقاط المستفادة.
          </p>
        </div>

        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
          {allVideos.length} فيديوهات شاملة
        </span>
      </div>

      {/* Main Video Viewer Area */}
      {selectedVideo && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          {/* Simulated Video Player / Visual Stage */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center text-white group">
            {/* Visual background gradient with science motifs */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/80 via-slate-900 to-indigo-950/80 opacity-90" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 z-10">
              <div className="w-18 h-18 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 group-hover:scale-110 transition-transform cursor-pointer">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/60 inline-block">
                  شرح تفاعلي بالرسوم المتحركة
                </span>
                <h3 className="text-xl sm:text-2xl font-black">{selectedVideo.title}</h3>
                <p className="text-xs text-slate-300 flex items-center justify-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>المدة: {selectedVideo.duration} دقيقة</span>
                </p>
              </div>
            </div>
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
                onClick={() => onOpenSummaries(selectedVideo.id.replace('v_', 'ch'))}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>ملخص الدرس</span>
              </button>
              <button
                onClick={() => onOpenQuiz(selectedVideo.id.replace('v_', 'ch'))}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all cursor-pointer shadow-xs"
              >
                <span>خوض اختبار الفيديو</span>
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
          قائمة فيديوهات المنهج كاملة:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allVideos.map(vid => {
            const isSelected = selectedVideo?.id === vid.id;
            return (
              <div
                key={vid.id}
                onClick={() => setSelectedVideo(vid)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-400'
                }`}
              >
                <div className="relative aspect-video rounded-xl bg-slate-800 overflow-hidden flex items-center justify-center text-white">
                  <Play className="w-6 h-6 text-white/80" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-bold">
                    {vid.duration} دقيقة
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">
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
