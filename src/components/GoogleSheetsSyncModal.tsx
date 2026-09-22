import React, { useState } from 'react';
import {
  Cloud,
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  X,
  FileJson,
} from 'lucide-react';
import { StudentProfile, StudyTask, GoogleSheetsConfig } from '../types';
import { googleSignIn, getAccessToken } from '../services/authService';
import {
  syncWithGoogleSheets,
  exportBackupJSON,
  exportScheduleCSV,
  saveSheetsConfig,
} from '../services/storageService';

interface GoogleSheetsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  tasks: StudyTask[];
  sheetsConfig: GoogleSheetsConfig;
  onUpdateSheetsConfig: (cfg: GoogleSheetsConfig) => void;
  onRestoreBackup: (profile: StudentProfile, tasks: StudyTask[]) => void;
}

export const GoogleSheetsSyncModal: React.FC<GoogleSheetsSyncModalProps> = ({
  isOpen,
  onClose,
  profile,
  tasks,
  sheetsConfig,
  onUpdateSheetsConfig,
  onRestoreBackup,
}) => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSheetsSync = async () => {
    setIsSyncing(true);
    setStatusMsg('جاري الاتصال بـ Google والمزامنة السحابية...');
    setErrorMsg(null);

    try {
      let token = await getAccessToken();
      if (!token) {
        const signResult = await googleSignIn();
        token = signResult?.accessToken || '';
      }

      if (!token) {
        throw new Error('لم يتم استلام تصريح Google Sheets. يمكنك استخدام النسخ الاحتياطي بصيغة JSON أو Excel أدناه.');
      }

      const result = await syncWithGoogleSheets(
        token,
        profile,
        tasks,
        sheetsConfig.spreadsheetId
      );

      const updatedCfg: GoogleSheetsConfig = {
        spreadsheetId: result.spreadsheetId,
        spreadsheetUrl: result.spreadsheetUrl,
        lastSynced: new Date().toISOString(),
        autoSync: true,
      };

      onUpdateSheetsConfig(updatedCfg);
      saveSheetsConfig(updatedCfg);
      setStatusMsg('تمت المزامنة بنجاح وحفظ أحدث نسخة في Google Sheets!');
    } catch (err: any) {
      console.warn('Sheets sync error:', err);
      setErrorMsg(
        err.message ||
          'تعذر استكمال المزامنة المباشرة مع Google Sheets. تم تجهيز خيار النسخ الاحتياطي الفوري بصيغة JSON و Excel بدون إنترنت!'
      );
      setStatusMsg(null);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.profile && parsed.tasks) {
          onRestoreBackup(parsed.profile, parsed.tasks);
          setStatusMsg('تم استرجاع النسخة الاحتياطية بنجاح على هذا الجهاز!');
          setErrorMsg(null);
        } else {
          setErrorMsg('ملف النسخ الاحتياطي غير متوافق');
        }
      } catch (err) {
        setErrorMsg('فشل قراءة ملف النسخ الاحتياطي');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                النسخ الاحتياطي السحابي والمزامنة عبر الأجهزة
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Google Sheets • مزامنة البيانات عبر أجهزة متعددة • العمل بدون إنترنت
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

        {/* Status / Error Alerts */}
        {statusMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs font-bold text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Google Sheets Sync Section */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-teal-50/40 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                المزامنة مع Google Sheets
              </h4>
            </div>
            {sheetsConfig.lastSynced && (
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                آخر مزامنة: {new Date(sheetsConfig.lastSynced).toLocaleTimeString('ar-EG')}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            يتم إنشاء وتحديث ملف Google Sheets منظم يحتوي على جدول المهام اليومي، درجات الامتحانات، وتقييم المهارات تلقائياً.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={handleGoogleSheetsSync}
              disabled={isSyncing}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'جاري المزامنة...' : 'مزامنة مع Google Sheets الآن'}</span>
            </button>

            {sheetsConfig.spreadsheetUrl && (
              <a
                href={sheetsConfig.spreadsheetUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
              >
                <span>فتح الجدول في Google</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Offline Backup & Transfer Section */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>النسخ الاحتياطي ونقل البيانات بين الأجهزة (يعمل بدون إنترنت):</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => exportBackupJSON(profile, tasks)}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-right space-y-1 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                <Download className="w-4 h-4 text-emerald-600" />
                <span>تحميل نسخة احتياطية (JSON)</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                احفظ كل تقدمك ومهامك في ملف مشفر لنقله لهاتف أو كمبيوتر آخر
              </p>
            </button>

            <label className="p-3.5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 bg-white dark:bg-slate-900 text-right space-y-1 transition-all cursor-pointer block">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                <Upload className="w-4 h-4 text-blue-600" />
                <span>استرجاع نسخة من ملف</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                اختر ملف .json سبق تحميله لاستعادة التقدم فوراً
              </p>
            </label>
          </div>
        </div>

        {/* Footer */}
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
