import { StudentProfile, StudyTask, DailyChallenge, GoogleSheetsConfig } from '../types';
import { CURRICULUM_CHAPTERS } from '../data/curriculumData';

const STORAGE_KEYS = {
  PROFILE: 'nobogh_student_profile',
  TASKS: 'nobogh_study_tasks',
  CHALLENGES: 'nobogh_daily_challenges',
  SHEETS_CONFIG: 'nobogh_sheets_config',
  OFFLINE_STATUS: 'nobogh_offline_sync_queue',
};

const DEFAULT_PROFILE: StudentProfile = {
  name: 'طالب العلم المتميز',
  age: 11,
  grade: 'الصف الخامس الابتدائي',
  school: 'مدرسة التفوق الحديثة',
  level: 2,
  xp: 320,
  xpToNextLevel: 500,
  streakDays: 4,
  totalStudyMinutes: 285,
  lastStudyDate: new Date().toISOString().split('T')[0],
  avatar: 'owl',
  badges: ['b_first_quiz', 'b_streak_3'],
  theme: 'light',
  skills: {
    observation: 85,
    analysis: 75,
    fairExperiment: 80,
    conceptRetention: 90,
    examReadiness: 78,
  },
  quizScores: {
    ch1: { score: 4, total: 4, date: '2026-09-20', passed: true },
    ch3: { score: 3, total: 3, date: '2026-09-21', passed: true },
  },
};

const DEFAULT_TASKS: StudyTask[] = [
  {
    id: 'task_1',
    title: 'مراجعة انقباض وانبساط عضلات الذراع والمفاصل',
    subject: 'العلوم العامة',
    subjectId: 'science',
    chapterId: 'ch1',
    date: new Date().toISOString().split('T')[0],
    time: '16:00',
    durationMinutes: 30,
    completed: true,
    reminderEnabled: true,
    priority: 'high',
    notes: 'حل تدريبات كتاب المدرسة ص 10 وص 11',
  },
  {
    id: 'task_2',
    title: 'حل أسئلة تجربة إنبات البذور وتثبيت العوامل',
    subject: 'العلوم العامة',
    subjectId: 'science',
    chapterId: 'ch3',
    date: new Date().toISOString().split('T')[0],
    time: '17:15',
    durationMinutes: 45,
    completed: false,
    reminderEnabled: true,
    priority: 'high',
    notes: 'مراجعة دور النشا واختبار اليود البني إلى الأزرق',
  },
  {
    id: 'task_3',
    title: 'مراجعة مسائل النسبة والكسور العشرية',
    subject: 'الرياضيات',
    subjectId: 'math',
    date: new Date().toISOString().split('T')[0],
    time: '18:30',
    durationMinutes: 35,
    completed: false,
    reminderEnabled: true,
    priority: 'medium',
    notes: 'التدرب على التمارين المحلولة',
  },
  {
    id: 'task_4',
    title: 'قراءة نص استماع لغة الضاد وحفظ المعاني الجديدة',
    subject: 'اللغة العربية (لغة الضاد)',
    subjectId: 'arabic',
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    durationMinutes: 25,
    completed: false,
    reminderEnabled: false,
    priority: 'low',
    notes: 'تحضير درس النحو',
  },
];

const DEFAULT_CHALLENGES: DailyChallenge[] = [
  {
    id: 'dc1',
    title: 'حل اختبار فصل كامل',
    description: 'أتمم اختباراً واحداً من اختبارات العلوم وحقق أكثر من 80%',
    icon: '🎯',
    xpReward: 50,
    current: 1,
    target: 1,
    completed: true,
  },
  {
    id: 'dc2',
    title: 'جلسة تركيز 25 دقيقة',
    description: 'أكمل جلسة بومودورو مذاكرة واحدة دون مغادرة الشاشة',
    icon: '⏱️',
    xpReward: 40,
    current: 1,
    target: 2,
    completed: false,
  },
  {
    id: 'dc3',
    title: 'طرح سؤال علمي على المعلم الذكي',
    description: 'استشر المعلم المتخصص في نقطة صعبة في الدرس',
    icon: '💬',
    xpReward: 30,
    current: 0,
    target: 1,
    completed: false,
  },
];

export const getStoredProfile = (): StudentProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
};

export const saveStoredProfile = (profile: StudentProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile locally', e);
  }
};

export const getStoredTasks = (): StudyTask[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) return DEFAULT_TASKS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_TASKS;
  }
};

export const saveStoredTasks = (tasks: StudyTask[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks locally', e);
  }
};

export const getStoredChallenges = (): DailyChallenge[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
    if (!raw) return DEFAULT_CHALLENGES;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CHALLENGES;
  }
};

export const saveStoredChallenges = (challenges: DailyChallenge[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
  } catch (e) {
    console.error('Failed to save challenges locally', e);
  }
};

export const getSheetsConfig = (): GoogleSheetsConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SHEETS_CONFIG);
    if (!raw) return { autoSync: false };
    return JSON.parse(raw);
  } catch {
    return { autoSync: false };
  }
};

export const saveSheetsConfig = (cfg: GoogleSheetsConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SHEETS_CONFIG, JSON.stringify(cfg));
  } catch (e) {
    console.error('Failed to save sheets config', e);
  }
};

// Export all data as JSON backup
export const exportBackupJSON = (profile: StudentProfile, tasks: StudyTask[]): void => {
  const data = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    profile,
    tasks,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nobogh_study_backup_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// Export Revision Schedule as CSV
export const exportScheduleCSV = (tasks: StudyTask[]): void => {
  const headers = ['المعرف', 'المهمة الدراسية', 'المادة', 'التاريخ', 'الوقت', 'المدة بالدقائق', 'الحالة', 'الأولوية', 'الملاحظات'];
  const rows = tasks.map(t => [
    t.id,
    `"${t.title.replace(/"/g, '""')}"`,
    `"${t.subject}"`,
    t.date,
    t.time,
    t.durationMinutes,
    t.completed ? 'مكتملة' : 'قيد الانتظار',
    t.priority === 'high' ? 'عالية' : t.priority === 'medium' ? 'متوسطة' : 'عادية',
    `"${(t.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `جدول_المذاكرة_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// Export Academic Progress Report as CSV
export const exportProgressReportCSV = (profile: StudentProfile): void => {
  const rows = [
    ['اسم الطالب', profile.name],
    ['الصف الدراسي', profile.grade],
    ['المدرسة', profile.school],
    ['مستوى التقدم الأكاديمي', `المستوى ${profile.level}`],
    ['نقاط الخبرة (XP)', profile.xp],
    ['أيام الالتزام المتتالية', `${profile.streakDays} أيام`],
    ['إجمالي دقائق الاستذكار', `${profile.totalStudyMinutes} دقيقة`],
    ['', ''],
    ['--- تقييم المهارات المكتسبة ---', ''],
    ['الملاحظة العلمية الدقيقة', `${profile.skills.observation}%`],
    ['التحليل والاستنتاج المنطقي', `${profile.skills.analysis}%`],
    ['إجراء التجارب العادلة وضبط العوامل', `${profile.skills.fairExperiment}%`],
    ['استيعاب وتذكر المفاهيم الأساسية', `${profile.skills.conceptRetention}%`],
    ['الجاهزية للامتحانات المدرسية', `${profile.skills.examReadiness}%`],
    ['', ''],
    ['--- نتائج الاختبارات القصيرة للفصول ---', ''],
    ['الفصل', 'الدرجة', 'الإجمالي', 'النسبة المئوية', 'تاريخ الاختبار'],
  ];

  Object.entries(profile.quizScores).forEach(([chId, res]) => {
    const chapter = CURRICULUM_CHAPTERS.find(c => c.id === chId);
    const title = chapter ? `الفصل ${chapter.number}: ${chapter.title}` : chId;
    const pct = Math.round((res.score / res.total) * 100);
    rows.push([title, String(res.score), String(res.total), `${pct}%`, res.date]);
  });

  const csvContent = '\uFEFF' + rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `تقرير_التحصيل_الدراسي_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// Real Google Sheets API integration
export const syncWithGoogleSheets = async (
  accessToken: string,
  profile: StudentProfile,
  tasks: StudyTask[],
  existingSpreadsheetId?: string
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  // If no existing spreadsheet, create a new one
  let spreadsheetId = existingSpreadsheetId;
  let spreadsheetUrl = '';

  if (!spreadsheetId) {
    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: `منصة نبوغ - جدول المذاكرة والتحصيل: ${profile.name}`,
          locale: 'ar_EG',
        },
        sheets: [
          { properties: { title: 'جدول_المذاكرة', gridProperties: { rowCount: 100, columnCount: 10 } } },
          { properties: { title: 'تقرير_التحصيل_والمهارات', gridProperties: { rowCount: 50, columnCount: 8 } } },
        ],
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.json();
      throw new Error(err.error?.message || 'فشل إنشاء جدول بيانات Google Sheets');
    }

    const createdData = await createRes.json();
    spreadsheetId = createdData.spreadsheetId;
    spreadsheetUrl = createdData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
  } else {
    spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;
  }

  // Populate or Update Schedule Sheet
  const scheduleValues = [
    ['المعرف', 'المهمة الدراسية', 'المادة', 'التاريخ', 'الوقت', 'المدة (دقائق)', 'الحالة', 'الأولوية', 'الملاحظات'],
    ...tasks.map(t => [
      t.id,
      t.title,
      t.subject,
      t.date,
      t.time,
      t.durationMinutes,
      t.completed ? 'مكتملة ✅' : 'قيد الانتظار ⏳',
      t.priority === 'high' ? 'عالية 🔥' : t.priority === 'medium' ? 'متوسطة ⚡' : 'عادية 🌿',
      t.notes || '',
    ]),
  ];

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/جدول_المذاكرة!A1:I${scheduleValues.length}?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: scheduleValues,
    }),
  });

  // Populate or Update Progress Sheet
  const progressValues = [
    ['البيان', 'القيمة'],
    ['اسم الطالب', profile.name],
    ['الصف الدراسي', profile.grade],
    ['المستوى الأكاديمي', profile.level],
    ['نقاط الخبرة (XP)', profile.xp],
    ['سلسلة الالتزام (أيام)', profile.streakDays],
    ['إجمالي دقائق المذاكرة', profile.totalStudyMinutes],
    ['تاريخ آخر تحديث', new Date().toLocaleString('ar-EG')],
    ['', ''],
    ['تقييم المهارة', 'النسبة المئوية'],
    ['الملاحظة العلمية', `${profile.skills.observation}%`],
    ['التحليل والاستنتاج', `${profile.skills.analysis}%`],
    ['التجارب العادلة', `${profile.skills.fairExperiment}%`],
    ['استيعاب المفاهيم', `${profile.skills.conceptRetention}%`],
    ['الجاهزية للامتحانات', `${profile.skills.examReadiness}%`],
  ];

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/تقرير_التحصيل_والمهارات!A1:B${progressValues.length}?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: progressValues,
    }),
  });

  return {
    spreadsheetId: spreadsheetId!,
    spreadsheetUrl,
  };
};
