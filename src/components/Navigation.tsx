import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  GraduationCap,
  BookOpenText,
  FileCheck2,
  BotMessageSquare,
  PlaySquare,
  Timer,
  BarChart3,
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'schedule'
  | 'quizzes'
  | 'summaries'
  | 'examples'
  | 'tutor'
  | 'videos'
  | 'focus'
  | 'reports';

interface NavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'dashboard' as TabType, label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'schedule' as TabType, label: 'جدول المراجعة', icon: CalendarCheck, badge: 'تنبيهات' },
    { id: 'quizzes' as TabType, label: 'الامتحانات', icon: GraduationCap },
    { id: 'summaries' as TabType, label: 'الملخصات الذكية', icon: BookOpenText },
    { id: 'examples' as TabType, label: 'أمثلة للحل', icon: FileCheck2 },
    { id: 'tutor' as TabType, label: 'المعلم الذكي', icon: BotMessageSquare, highlight: true },
    { id: 'videos' as TabType, label: 'الفيديوهات', icon: PlaySquare },
    { id: 'focus' as TabType, label: 'مؤقت التركيز', icon: Timer },
    { id: 'reports' as TabType, label: 'التقارير والمهارات', icon: BarChart3 },
  ];

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                } ${tab.highlight && !isActive ? 'ring-1 ring-emerald-500/40 text-emerald-700 dark:text-emerald-300' : ''}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
