import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Bell,
  BellRing,
  Filter,
  Download,
  AlertCircle,
  FileSpreadsheet,
  Flame,
  Layers,
} from 'lucide-react';
import { StudyTask, SubjectId, Priority } from '../types';
import { INITIAL_SUBJECTS, CURRICULUM_CHAPTERS } from '../data/curriculumData';
import { exportScheduleCSV } from '../services/storageService';

interface StudyScheduleProps {
  tasks: StudyTask[];
  onAddTask: (task: Omit<StudyTask, 'id'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenSheetsSync: () => void;
  onTriggerNotification: (title: string, body: string) => void;
}

export const StudySchedule: React.FC<StudyScheduleProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onOpenSheetsSync,
  onTriggerNotification,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [activeDateFilter, setActiveDateFilter] = useState<'today' | 'upcoming' | 'all'>('all');

  // Form State for new task
  const [newTitle, setNewTitle] = useState('');
  const [newSubjectId, setNewSubjectId] = useState<SubjectId>('science');
  const [newChapterId, setNewChapterId] = useState('ch1');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('17:00');
  const [newDuration, setNewDuration] = useState(30);
  const [newPriority, setNewPriority] = useState<Priority>('high');
  const [newReminder, setNewReminder] = useState(true);
  const [newNotes, setNewNotes] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks.filter(t => {
    if (selectedSubject !== 'all' && t.subjectId !== selectedSubject) return false;
    if (activeDateFilter === 'today' && t.date !== todayStr) return false;
    if (activeDateFilter === 'upcoming' && t.date < todayStr) return false;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const subjectObj = INITIAL_SUBJECTS.find(s => s.id === newSubjectId);
    onAddTask({
      title: newTitle.trim(),
      subject: subjectObj?.name || 'مادة دراسية',
      subjectId: newSubjectId,
      chapterId: newSubjectId === 'science' ? newChapterId : undefined,
      date: newDate,
      time: newTime,
      durationMinutes: Number(newDuration),
      completed: false,
      reminderEnabled: newReminder,
      priority: newPriority,
      notes: newNotes.trim(),
    });

    // Reset and close
    setNewTitle('');
    setNewNotes('');
    setShowAddModal(false);

    if (newReminder) {
      onTriggerNotification(
        `تمت جدولة مهمة مراجعة: ${newTitle}`,
        `موعد المذاكرة: ${newTime} (${newDuration} دقيقة)`
      );
    }
  };

  const handleTestAlert = (task: StudyTask) => {
    onTriggerNotification(
      `تذكير بمذاكرة: ${task.subject}`,
      `حان الآن موعد: ${task.title} - المدة: ${task.durationMinutes} دقيقة. استعد وركز يا بطل!`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              جدول المراجعة الزمني والتنبيهات المخصصة
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {tasks.filter(t => t.completed).length} من {tasks.length} منجزة
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            نظام ذكي لجدولة المواد الدراسية، تحديد الأولويات، وتفعيل التذكيرات الصوتية قبل الموعد لضمان الالتزام.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => exportScheduleCSV(tasks)}
            className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="تصدير جدول المراجعة كملف Excel / CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير Excel/CSV</span>
          </button>
          <button
            onClick={onOpenSheetsSync}
            className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="مزامنة فورية مع Google Sheets"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>مزامنة Google Sheets</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مهمة مراجعة</span>
          </button>
        </div>
      </div>

      {/* Filters: By Date & Subject */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        {/* Date Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveDateFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeDateFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            جميع المهام ({tasks.length})
          </button>
          <button
            onClick={() => setActiveDateFilter('today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeDateFilter === 'today'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            مهام اليوم ({tasks.filter(t => t.date === todayStr).length})
          </button>
          <button
            onClick={() => setActiveDateFilter('upcoming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeDateFilter === 'upcoming'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            المهام القادمة
          </button>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap cursor-pointer ${
              selectedSubject === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            الكل
          </button>
          {INITIAL_SUBJECTS.map(subj => (
            <button
              key={subj.id}
              onClick={() => setSelectedSubject(subj.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap cursor-pointer ${
                selectedSubject === subj.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
              }`}
            >
              {subj.name}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
              لا توجد مهام دراسية تطابق هذا الفلتر
            </h3>
            <p className="text-xs text-slate-400">
              اضغط على زر "إضافة مهمة مراجعة" لجدولة جلسة دراسية جديدة مع تذكيرات مخصصة.
            </p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const isToday = task.date === todayStr;
            return (
              <div
                key={task.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  task.completed
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40 opacity-80'
                    : isToday
                    ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center border mt-0.5 transition-all shrink-0 cursor-pointer ${
                      task.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 bg-white dark:bg-slate-800'
                    }`}
                    title={task.completed ? 'إلغاء الإكمال' : 'تحديد كمكتمل والحصول على نقاط XP'}
                  >
                    {task.completed && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                        {task.subject}
                      </span>
                      {isToday && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                          اليوم
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          task.priority === 'high'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                            : task.priority === 'medium'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {task.priority === 'high' ? 'أولوية قصوى 🔥' : task.priority === 'medium' ? 'أولوية متوسطة' : 'عادية'}
                      </span>
                    </div>

                    <h4
                      className={`text-sm sm:text-base font-extrabold ${
                        task.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </h4>

                    {task.notes && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        📝 {task.notes}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <div className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{task.date}</span>
                      </div>
                      <div className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{task.time}</span>
                      </div>
                      <div className="flex items-center gap-1 font-medium">
                        <span>المدة: {task.durationMinutes} دقيقة</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Action Icons: Test alert & Delete */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleTestAlert(task)}
                    className="p-2 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
                    title="إرسال تنبيه تجريبي لهذة المادة"
                  >
                    <BellRing className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="حذف المهمة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                إضافة مهمة مراجعة دراسية جديدة
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold cursor-pointer"
              >
                إغلاق ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  عنوان المهمة أو موضوع الدرس *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مراجعة تجربة الإنبات وتأثير اليود"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    المادة الدراسية
                  </label>
                  <select
                    value={newSubjectId}
                    onChange={e => setNewSubjectId(e.target.value as SubjectId)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    {INITIAL_SUBJECTS.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {newSubjectId === 'science' && (
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      الفصل المرتبط من كتاب العلوم
                    </label>
                    <select
                      value={newChapterId}
                      onChange={e => setNewChapterId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    >
                      {CURRICULUM_CHAPTERS.map(c => (
                        <option key={c.id} value={c.id}>
                          الفصل {c.number}: {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    التاريخ
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الوقت
                  </label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    المدة المقترحة
                  </label>
                  <select
                    value={newDuration}
                    onChange={e => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value={15}>15 دقيقة (مراجعة سريعة)</option>
                    <option value={25}>25 دقيقة (جلسة بومودورو)</option>
                    <option value={45}>45 دقيقة (درس كامل)</option>
                    <option value={60}>60 دقيقة (فصل واختبار)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    درجة الأهمية
                  </label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="high">أولوية قصوى 🔥 (قبل الامتحان)</option>
                    <option value="medium">أولوية متوسطة ⚡</option>
                    <option value="low">أولوية عادية 🌿</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="reminderCheckbox"
                    checked={newReminder}
                    onChange={e => setNewReminder(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded-sm border-slate-300"
                  />
                  <label htmlFor="reminderCheckbox" className="font-bold text-slate-700 dark:text-slate-300">
                    تفعيل التنبيه المخصص للمهمة
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ملاحظات أو صفحات محددة للكتاب
                </label>
                <textarea
                  rows={2}
                  placeholder="مثال: مراجعة أسئلة حاول وتدرب ص 32 وصفحة 33"
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  حفظ في الجدول
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
