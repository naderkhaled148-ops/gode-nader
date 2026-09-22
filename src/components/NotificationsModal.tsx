import React from 'react';
import {
  Bell,
  Clock,
  CheckCircle2,
  CalendarCheck,
  X,
  Volume2,
} from 'lucide-react';
import { StudyTask } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: StudyTask[];
  onTriggerTestAlert: (task: StudyTask) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  tasks,
  onTriggerTestAlert,
}) => {
  if (!isOpen) return null;

  const reminderTasks = tasks.filter(t => t.reminderEnabled && !t.completed);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                تنبيهات وتذكيرات المذاكرة
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                قائمة التنبيهات المخصصة لكل مادة لضمان الالتزام بالجدول
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {reminderTasks.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              لا توجد تنبيهات قادمة حالياً. يمكنك تفعيل التنبيهات لأي مهمة من جدول المذاكرة!
            </div>
          ) : (
            reminderTasks.map(task => (
              <div
                key={task.id}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                      {task.subject}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {task.date} • {task.time}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {task.title}
                  </h4>
                </div>

                <button
                  onClick={() => onTriggerTestAlert(task)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>تنبيه تجريبي</span>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
