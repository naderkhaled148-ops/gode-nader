import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { StudySchedule } from './components/StudySchedule';
import { QuizSection } from './components/QuizSection';
import { SmartSummaries } from './components/SmartSummaries';
import { WorkedExamples } from './components/WorkedExamples';
import { TutorChat } from './components/TutorChat';
import { VideoLibrary } from './components/VideoLibrary';
import { FocusTimer } from './components/FocusTimer';
import { ProgressReport } from './components/ProgressReport';
import { GoogleSheetsSyncModal } from './components/GoogleSheetsSyncModal';
import { RewardsModal } from './components/RewardsModal';
import { NotificationsModal } from './components/NotificationsModal';

import { StudentProfile, StudyTask, DailyChallenge, GoogleSheetsConfig } from './types';
import {
  getStoredProfile,
  saveStoredProfile,
  getStoredTasks,
  saveStoredTasks,
  getStoredChallenges,
  saveStoredChallenges,
  getSheetsConfig,
  saveSheetsConfig,
} from './services/storageService';

// Audio chime generator using Web Audio API
const playTone = (type: 'success' | 'alert' | 'xp') => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.3); // G5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'xp') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else {
      // alert
      osc.type = 'square';
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    // Ignore audio errors on unsupported environments
  }
};

export default function App() {
  const [profile, setProfile] = useState<StudentProfile>(getStoredProfile);
  const [tasks, setTasks] = useState<StudyTask[]>(getStoredTasks);
  const [challenges, setChallenges] = useState<DailyChallenge[]>(getStoredChallenges);
  const [sheetsConfig, setSheetsConfig] = useState<GoogleSheetsConfig>(getSheetsConfig);

  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [selectedChapterParam, setSelectedChapterParam] = useState<string>('ch1');

  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('nobogh_theme') === 'dark';
  });

  // Modals state
  const [sheetsSyncModalOpen, setSheetsSyncModalOpen] = useState<boolean>(false);
  const [rewardsModalOpen, setRewardsModalOpen] = useState<boolean>(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState<boolean>(false);

  // In-app alert banner
  const [activeAlert, setActiveAlert] = useState<{ title: string; body: string } | null>(null);

  // Apply theme to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('nobogh_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('nobogh_theme', 'light');
    }
  }, [isDark]);

  // Request Notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  // Periodic Reminder Checker: checks if any task matches current time
  useEffect(() => {
    const checkScheduleReminders = () => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;

      tasks.forEach(task => {
        if (!task.completed && task.reminderEnabled && task.date === todayStr && task.time === currentTimeStr) {
          triggerInAppNotification(
            `⏰ حان موعد مذاكرة: ${task.subject}`,
            `${task.title} - المدة المحددة: ${task.durationMinutes} دقيقة. انطلق وركز يا بطل!`
          );
        }
      });
    };

    const interval = setInterval(checkScheduleReminders, 60000);
    return () => clearInterval(interval);
  }, [tasks]);

  const triggerInAppNotification = (title: string, body: string) => {
    playTone('alert');
    setActiveAlert({ title, body });

    // Also trigger system browser notification if allowed
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
      } catch (e) {}
    }

    setTimeout(() => {
      setActiveAlert(null);
    }, 8000);
  };

  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        if (nextCompleted) {
          playTone('success');
          // Award XP and study minutes
          awardXP(30);
          updateStudyMinutes(t.durationMinutes);
        }
        return { ...t, completed: nextCompleted };
      }
      return t;
    });

    setTasks(updated);
    saveStoredTasks(updated);
  };

  const handleAddTask = (newTask: Omit<StudyTask, 'id'>) => {
    const taskWithId: StudyTask = {
      ...newTask,
      id: `task_${Date.now()}`,
    };
    const updated = [taskWithId, ...tasks];
    setTasks(updated);
    saveStoredTasks(updated);
    playTone('xp');
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter(t => t.id !== taskId);
    setTasks(updated);
    saveStoredTasks(updated);
  };

  const awardXP = (amount: number) => {
    setProfile(prev => {
      const nextXp = prev.xp + amount;
      let nextLevel = prev.level;
      let nextTarget = prev.xpToNextLevel;

      if (nextXp >= prev.xpToNextLevel) {
        nextLevel += 1;
        nextTarget += 500;
        try {
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 },
          });
        } catch (e) {}
        playTone('success');
      }

      const updated = {
        ...prev,
        xp: nextXp,
        level: nextLevel,
        xpToNextLevel: nextTarget,
      };
      saveStoredProfile(updated);
      return updated;
    });
  };

  const updateStudyMinutes = (mins: number) => {
    setProfile(prev => {
      const updated = {
        ...prev,
        totalStudyMinutes: prev.totalStudyMinutes + mins,
      };
      saveStoredProfile(updated);
      return updated;
    });
  };

  const handleClaimChallenge = (challengeId: string) => {
    const ch = challenges.find(c => c.id === challengeId);
    if (!ch || ch.completed) return;

    awardXP(ch.xpReward);
    playTone('success');

    const updated = challenges.map(c =>
      c.id === challengeId ? { ...c, completed: true } : c
    );
    setChallenges(updated);
    saveStoredChallenges(updated);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  };

  const handleQuizComplete = (chapterId: string, score: number, total: number) => {
    const passed = score / total >= 0.75;
    const gainedXp = score * 15;
    awardXP(gainedXp);

    setProfile(prev => {
      const updatedScores = {
        ...prev.quizScores,
        [chapterId]: {
          score,
          total,
          date: new Date().toISOString().split('T')[0],
          passed,
        },
      };

      // Also adjust skills
      const updatedSkills = {
        ...prev.skills,
        conceptRetention: Math.min(100, prev.skills.conceptRetention + 2),
        examReadiness: Math.min(100, prev.skills.examReadiness + 3),
      };

      const updated = {
        ...prev,
        quizScores: updatedScores,
        skills: updatedSkills,
      };
      saveStoredProfile(updated);
      return updated;
    });
  };

  const handleRestoreBackup = (restoredProfile: StudentProfile, restoredTasks: StudyTask[]) => {
    setProfile(restoredProfile);
    setTasks(restoredTasks);
    saveStoredProfile(restoredProfile);
    saveStoredTasks(restoredTasks);
    playTone('success');
  };

  const handleNavigateWithParam = (tab: TabType, extraParam?: string) => {
    if (extraParam) setSelectedChapterParam(extraParam);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans">
      {/* Active in-app notification banner */}
      {activeAlert && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[90%] p-4 rounded-2xl bg-amber-500 text-slate-950 font-bold shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top duration-200">
          <div className="space-y-0.5">
            <span className="text-xs uppercase tracking-wide block font-black">
              {activeAlert.title}
            </span>
            <p className="text-xs font-semibold leading-snug">{activeAlert.body}</p>
          </div>
          <button
            onClick={() => setActiveAlert(null)}
            className="text-xs font-black px-2 py-1 rounded-lg bg-black/15 hover:bg-black/25 cursor-pointer"
          >
            حسناً
          </button>
        </div>
      )}

      {/* Top Application Header */}
      <Header
        profile={profile}
        sheetsConfig={sheetsConfig}
        onOpenSheetsSync={() => setSheetsSyncModalOpen(true)}
        onOpenRewards={() => setRewardsModalOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(prev => !prev)}
        notificationsCount={tasks.filter(t => t.reminderEnabled && !t.completed).length}
        onOpenNotifications={() => setNotificationsModalOpen(true)}
      />

      {/* Main Navigation Bar */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={tab => handleNavigateWithParam(tab)}
      />

      {/* Main Workspace Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'dashboard' && (
          <Dashboard
            profile={profile}
            tasks={tasks}
            challenges={challenges}
            onSelectTab={handleNavigateWithParam}
            onToggleTask={handleToggleTask}
            onClaimChallenge={handleClaimChallenge}
          />
        )}

        {currentTab === 'schedule' && (
          <StudySchedule
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onOpenSheetsSync={() => setSheetsSyncModalOpen(true)}
            onTriggerNotification={triggerInAppNotification}
          />
        )}

        {currentTab === 'quizzes' && (
          <QuizSection
            profile={profile}
            onQuizComplete={handleQuizComplete}
            onOpenSummaries={chId => handleNavigateWithParam('summaries', chId)}
          />
        )}

        {currentTab === 'summaries' && (
          <SmartSummaries
            initialChapterId={selectedChapterParam}
            onStartExam={chId => handleNavigateWithParam('quizzes', chId)}
          />
        )}

        {currentTab === 'examples' && <WorkedExamples />}

        {currentTab === 'tutor' && <TutorChat />}

        {currentTab === 'videos' && (
          <VideoLibrary
            onOpenSummaries={chId => handleNavigateWithParam('summaries', chId)}
            onOpenQuiz={chId => handleNavigateWithParam('quizzes', chId)}
          />
        )}

        {currentTab === 'focus' && (
          <FocusTimer
            onSessionComplete={(mins, xp) => {
              updateStudyMinutes(mins);
              awardXP(xp);
            }}
          />
        )}

        {currentTab === 'reports' && (
          <ProgressReport
            profile={profile}
            onOpenSheetsSync={() => setSheetsSyncModalOpen(true)}
            onRetakeExam={chId => handleNavigateWithParam('quizzes', chId)}
          />
        )}
      </main>

      {/* Modals */}
      <GoogleSheetsSyncModal
        isOpen={sheetsSyncModalOpen}
        onClose={() => setSheetsSyncModalOpen(false)}
        profile={profile}
        tasks={tasks}
        sheetsConfig={sheetsConfig}
        onUpdateSheetsConfig={cfg => {
          setSheetsConfig(cfg);
          saveSheetsConfig(cfg);
        }}
        onRestoreBackup={handleRestoreBackup}
      />

      <RewardsModal
        isOpen={rewardsModalOpen}
        onClose={() => setRewardsModalOpen(false)}
        profile={profile}
      />

      <NotificationsModal
        isOpen={notificationsModalOpen}
        onClose={() => setNotificationsModalOpen(false)}
        tasks={tasks}
        onTriggerTestAlert={task =>
          triggerInAppNotification(
            `🔔 تنبيه مذاكرة: ${task.subject}`,
            `${task.title} - الموعد: ${task.time}`
          )
        }
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 py-5 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            منصة نُـبـوغ للمذاكرة الفعالة • مصممة للمنهج الدراسي للناشئين (10 - 18 سنة) مع دعم العمل بدون إنترنت والمزامنة السحابية.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSheetsSyncModalOpen(true)}
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              نسخ احتياطي سحابي
            </button>
            <span>•</span>
            <button
              onClick={() => handleNavigateWithParam('reports')}
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              تقارير التحصيل
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
