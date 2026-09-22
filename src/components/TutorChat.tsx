import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  RotateCcw,
  BookOpen,
  FlaskConical,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { askTutor } from '../services/tutorService';
import { CURRICULUM_CHAPTERS } from '../data/curriculumData';

interface Message {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
}

export const TutorChat: React.FC = () => {
  const [tutorRole, setTutorRole] = useState<'science_teacher' | 'experiment_mentor' | 'study_coach'>('science_teacher');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('all');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      text: `أهلاً بك يا بطل العلوم! معك مستر رضا نصار.
أنا هنا لأشرح لك أي نقطة صعبة في منهج العلوم للصف الخامس، أو أساعدك في حل تدريبات الكتاب المدرسي ونماذج الامتحانات.
بماذا تحب أن نبدأ اليوم؟`,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        text: m.text,
      }));

      const reply = await askTutor({
        message: text,
        tutorRole,
        chapterContext: selectedChapterId !== 'all' ? selectedChapterId : undefined,
        conversationHistory: history,
      });

      const tutorMsg: Message = {
        id: `t_${Date.now()}`,
        sender: 'tutor',
        text: reply,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, tutorMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `err_${Date.now()}`,
        sender: 'tutor',
        text: 'عذراً يا بني، حدث اتصال متقطع بالشبكة، لكن تأكد أنني معك دائماً. راجع قسم الملخصات والأمثلة المحلولة ستجد الشرح خطوة بخطوة!',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickChips = [
    'اشرح لي كيف تعمل عضلات الذراع معاً عند ثني وفرد اليد',
    'ما الفرق بين إنبات البذرة ونموها؟',
    'كيف أصمم تجربة علمية عادلة مع ضبط العوامل؟',
    'ما هي وظيفة القلب والأوعية الدموية في جسم الإنسان؟',
    'كيف نحسب قوة تكبير المجهر الضوئي المركب؟',
    'نظم لي خطة مراجعة للامتحان القادم',
  ];

  const tutorProfiles = [
    {
      id: 'science_teacher' as const,
      name: 'مستر رضا نصار',
      title: 'معلم أول العلوم والشرح التفاعلي',
      avatar: '👨‍🏫',
      color: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100',
    },
    {
      id: 'experiment_mentor' as const,
      name: 'البروفيسور العبقري',
      title: 'مرشد التجارب والمنهج العلمي',
      avatar: '🔬',
      color: 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-100',
    },
    {
      id: 'study_coach' as const,
      name: 'الأستاذة سارة',
      title: 'مستشارة تنظيم الوقت والتركيز',
      avatar: '👩‍🎓',
      color: 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Bot className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              المعلم الذكي والمتخصصون (إجابات فورية 24/7)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            اطرح أي تساؤل في منهج العلوم، أو استفسر عن خطوات التجارب، أو اطلب جدول مراجعة مخصص من المعلمين المتخصصين.
          </p>
        </div>

        {/* Chapter Context Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400">سياق الفصل:</label>
          <select
            value={selectedChapterId}
            onChange={e => setSelectedChapterId(e.target.value)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="all">كل منهج العلوم</option>
            {CURRICULUM_CHAPTERS.map(ch => (
              <option key={ch.id} value={ch.id}>
                الفصل {ch.number}: {ch.title.split(':')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tutor Persona Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {tutorProfiles.map(tp => {
          const isSelected = tutorRole === tp.id;
          return (
            <button
              key={tp.id}
              onClick={() => setTutorRole(tp.id)}
              className={`p-3.5 rounded-2xl border text-right transition-all flex items-center gap-3 cursor-pointer ${
                isSelected
                  ? `${tp.color} ring-2 ring-emerald-500/40 shadow-sm`
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400'
              }`}
            >
              <span className="text-2xl">{tp.avatar}</span>
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white">
                  {tp.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {tp.title}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Chat Area Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[560px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map(msg => {
            const isTutor = msg.sender === 'tutor';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isTutor ? 'justify-start' : 'justify-end'}`}
              >
                {isTutor && (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-1 ${
                    isTutor
                      ? 'bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80'
                      : 'bg-emerald-600 text-white rounded-tr-xs'
                  }`}
                >
                  <p className="whitespace-pre-line font-medium">{msg.text}</p>
                  <span
                    className={`block text-[10px] ${
                      isTutor ? 'text-slate-400 dark:text-slate-500' : 'text-emerald-100 text-left'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {!isTutor && (
                  <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>المعلم يكتب الإجابة النموذجية الآن...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">أسئلة مقترحة:</span>
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-[11px] font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap transition-colors cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="اكتب سؤالك هنا للمعلم (مثال: اشرح لي كيف تؤثر درجة الحرارة على إنبات البذور)..."
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer shrink-0"
            >
              <span>إرسال</span>
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
