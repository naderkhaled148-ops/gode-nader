import express, { Request, Response } from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Gemini AI instance
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    time: new Date().toISOString(),
  });
});

// Specialized AI Tutor Chat Endpoint
app.post('/api/tutor/chat', async (req: Request, res: Response) => {
  try {
    const { message, tutorRole, chapterContext, conversationHistory } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'رسالة السؤال مطلوبة' });
      return;
    }

    const tutorPersonas: Record<string, string> = {
      'science_teacher': `أنت "مستر رضا"، معلم علوم متخصص وودود ومحفز للطلاب في المرحلة العمرية من 10 إلى 18 عاماً (خصوصاً الصف الخامس الابتدائي والصفوف الإعدادية).
أسلوبك: سهل ومبسط، دافئ، تشجع الطالب بكلمات مثل "يا بطل"، "يا دكتور المستقبل"، "أحسنت السؤال".
استخدم أمثلة واقعية وملموسة من كتاب علوم الصف الخامس (مثل العظام والعضلات، إنبات البذور، تجارب الماء والحرارة، زهرة اللوف، التبخر والتكثف).
قدّم الإجابة في نقاط واضحة ومحددة مع سؤال تفاعلي صغير في النهاية للتأكد من فهم الطالب.`,
      'experiment_mentor': `أنت "البروفيسور العبقري" (المستوحى من شخصية العبقري في كتاب العلوم)، خبير التجارب والاستقصاء العلمي.
أسلوبك: علمي شيّق، تشرح خطوات التجربة العادلة، كيفية تثبيت العوامل، كيفية استخدام المجهر وحساب قوة التكبير، وماذا نستنتج من الملاحظة.
تحدث بحماس واشرح "لماذا حدث ذلك؟".`,
      'study_coach': `أنت "الأستاذة سارة"، المرشدة الأكاديمية وخبيرة تنظيم الوقت وجداول المذاكرة.
أسلوبك: عملي ومنظم جداً ومحفز. تساعد الطلاب على تقسيم المواد، التغلب على التشتت، استخدام تقنية بومودورو بذكاء، ومراجعة الدروس دون توتر.`,
    };

    const selectedPersona = tutorPersonas[tutorRole] || tutorPersonas['science_teacher'];

    const systemInstruction = `${selectedPersona}
سياق الدرس الحالي: ${chapterContext || 'المنهج الدراسي والعلوم والمذاكرة'}.
تحدث باللغة العربية الفصحى المبسطة والمحببة للطلاب. لا تقدم إجابات معقدة أو مصطلحات غير مشروحة.`;

    if (!process.env.GEMINI_API_KEY) {
      // Fallback response if GEMINI_API_KEY is not configured
      const fallbackResponses = [
        `أهلاً بك يا بطل! سؤال ممتاز بخصوص: "${message.substring(0, 40)}..."\n\nتذكر القاعدة الذهبية في منهج العلوم: العوامل تؤثر مباشرة في النتائج. في التجارب العادلة نحرص دائماً على تغيير عامل واحد فقط وتثبيت بقية العوامل (مثل كمية الماء والضوء ودرجة الحرارة) للمقارنة الدقيقة!\n\nهل تحب أن نراجع ملخص هذا الدرس أو نجري الاختبار السريع معاً؟`,
        `مرحباً يا بطل العلم! فكرة رائعة. عند دراسة هذا المفهوم، تذكر كيف تنقبض وتنبسط العضلات لتحريك العظام، أو كيف تحتاج البذرة للماء والهواء والدفء لتنبت.\n\nاستمر في استكشاف الملخصات والأمثلة المحلولة في المنصة لتحقيق أعلى الدرجات!`,
      ];
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      res.json({ reply: randomResponse });
      return;
    }

    const ai = getAIClient();

    // Prepare contents
    const contents: any[] = [];
    if (Array.isArray(conversationHistory)) {
      for (const turn of conversationHistory.slice(-6)) {
        if (turn.role && turn.text) {
          contents.push({
            role: turn.role === 'user' ? 'user' : 'model',
            parts: [{ text: turn.text }],
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents as any,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'عذراً يا بطل، لم أستطع تكوين الإجابة في هذه اللحظة. يرجى إعادة المحاولة!';
    res.json({ reply });
  } catch (error: any) {
    console.error('Error in tutor chat:', error);
    res.status(500).json({
      error: 'حدث خطأ أثناء معالجة السؤال',
      details: error.message || String(error),
      fallbackReply: 'أهلاً بك يا بطل! راجع التلخيصات السريعة والأمثلة المحلولة في القسم الحالي، وستجد الشرح الوافي لكل خطوة!',
    });
  }
});

// Sync data / Sheet backup helper API (Server-side proxy if needed)
app.post('/api/sheets/backup-log', (req: Request, res: Response) => {
  const { studentName, grade, timestamp, summary } = req.body;
  // Log or handle metadata
  res.json({ success: true, loggedAt: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Study Platform server listening on port ${PORT}`);
  });
}

startServer();
