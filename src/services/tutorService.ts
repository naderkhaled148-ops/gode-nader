export interface TutorChatRequest {
  message: string;
  tutorRole: 'science_teacher' | 'experiment_mentor' | 'study_coach';
  chapterContext?: string;
  conversationHistory?: { role: 'user' | 'model'; text: string }[];
}

export const askTutor = async (req: TutorChatRequest): Promise<string> => {
  try {
    const res = await fetch('/api/tutor/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      if (data.fallbackReply) return data.fallbackReply;
      throw new Error(data.error || 'تعذر الاتصال بالمعلم في الوقت الحالي');
    }

    const data = await res.json();
    return data.reply;
  } catch (error: any) {
    console.warn('Tutor service fallback:', error);
    // Friendly, scientifically grounded offline response
    return `مرحباً يا بطل! يسعدني دائماً اهتمامك العلمي.
بشأن سؤالك، تذكر القاعدة الأساسية في منهج العلوم:
1. انقباض العضلات يسحب العظام بالتناوب.
2. إنبات البذور يحتاج: ماء + هواء + درجة حرارة مناسبة (والضوء ضروري للنمو بعد الإنبات).
3. في التجارب العادلة: نغير عاملاً واحداً ونثبت بقية العوامل بدقة.
تأكد من مراجعة قسم "أمثلة للحل" و "ملخصات الدروس" في المنصة وستجد رسوماً وشرحاً وافياً!`;
  }
};
