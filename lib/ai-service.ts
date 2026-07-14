"use server";

// ============================================
// AI Service - Claude API (Anthropic)
// ============================================

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

const DEFAULT_MODEL = "claude-haiku-4-5-20251001"; // ✅ الاسم القديم اللي كان يشتغل
const MAX_TOKENS = 8192;

// Rate limiting
let lastRequestTime = 0;
const MIN_INTERVAL_MS = 1000;

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callClaude(messages: { role: string; content: string }[], model = DEFAULT_MODEL, retries = 5) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY not configured in .env.local");
  }

  const now = Date.now();
  const timeSinceLast = now - lastRequestTime;
  if (timeSinceLast < MIN_INTERVAL_MS) {
    await sleep(MIN_INTERVAL_MS - timeSinceLast);
  }

  const formattedMessages = messages.map((m) => ({
    role: m.role === "user" ? "user" : "assistant",
    content: m.content,
  }));

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      lastRequestTime = Date.now();

      const response = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": ANTHROPIC_VERSION,
        },
        body: JSON.stringify({
          model,
          max_tokens: MAX_TOKENS,
          messages: formattedMessages,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Claude API error (attempt ${attempt}):`, errorText);

        if (response.status === 429) {
          await sleep(5000 * attempt);
          continue;
        }

        if (response.status >= 500) {
          await sleep(2000 * attempt);
          continue;
        }

        throw new Error(`Claude API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (data.content && data.content[0] && data.content[0].text) {
        return data.content[0].text;
      }

      throw new Error("Unexpected Claude response format");

    } catch (err) {
      console.error(`Attempt ${attempt} failed:`, err);
      if (attempt === retries) {
        throw new Error(`Failed after ${retries} retries: ${err instanceof Error ? err.message : "Unknown error"}`);
      }
      await sleep(2000 * attempt);
    }
  }

  throw new Error("Failed after max retries");
}

// ============================================
// Public API
// ============================================

export async function aiChat(messages: { role: string; content: string }[], model = DEFAULT_MODEL) {
  return callClaude(messages, model);
}

export async function aiStream(messages: { role: string; content: string }[], model = DEFAULT_MODEL) {
  return callClaude(messages, model);
}

export async function generateResearchContent(prompt: string, context?: Record<string, any>) {
  const systemContent = [
    "أنت باحث أكاديمي متخصص في كتابة الأوراق البحثية المقارنة المعيارية باللغة العربية.",
    "",
    "🔹 قواعد صارمة:",
    "- اكتب محتوى كاملاً ومفصلاً — لا تختصر أبداً",
    "- كل قسم يجب أن يكون شاملاً ويغطي جميع الجوانب",
    "- استخدم جداول Markdown (|) لتنظيم البيانات",
    "- استخدم ### للعناوين الرئيسية",
    "- استخدم **نص عريض** للنقاط المهمة",
    "- استخدم - للنقاط الفرعية",
    "- لا تترك أي قسم ناقص أو مقطوع",
    "- إذا كان المحتوى طويل — اكتبه كاملاً ولا تختصر",
    "- لا تستخدم \\t (Tab) — استخدم | للجداول",
    "- لا تستخدم ASCII art — استخدم Markdown فقط",
    "- لا تترك بيانات فارغة",
    "- لا تستخدم triple backticks إلا للكود البرمجي فقط",
    "",
    "🔹 تنسيق الجداول:",
    "| العمود 1 | العمود 2 | العمود 3 |",
    "|----------|----------|----------|",
    "| البيانات | البيانات | البيانات |",
    "",
    "🔹 ممنوع:",
    "- لا تختصر المحتوى",
    "- لا تترك جمل مقطوعة",
    "- لا تستخدم نصوص بديلة أو رموز بديلة",
  ].join("\n");

  const messages = [
    {
      role: "system",
      content: systemContent,
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  return callClaude(messages, DEFAULT_MODEL);
}

// Fallback / Mock mode for testing without API
export async function mockAiResponse(prompt: string): Promise<string> {
  await sleep(1000);
  return `【محتوى تجريبي】\n\n${prompt.substring(0, 100)}...\n\n[تم إنشاء هذا المحتوى في وضع الاختبار بدون AI]`;
}