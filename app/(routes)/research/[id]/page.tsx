"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { useResearchStore } from "@/hooks/useResearchStore";
import { getStages } from "@/lib/stages";
import { shouldPause } from "@/lib/hitl";
import { executeStage } from "@/lib/orchestrator";
import { PipelineMessage } from "@/types";
import {
  Play, Pause, RotateCcw, Download, MessageSquare,
  ChevronLeft, BookOpen, CheckCircle, Clock, AlertCircle,
  FileText, BarChart3, Lightbulb, Search, Filter,
  FlaskConical, PenTool, Award, Send, Bot, User,
  Menu, X, Globe, Building2, TrendingUp, Check
} from "lucide-react";

const PHASE_ICONS: Record<string, any> = {
  A: Search, B: BookOpen, C: Lightbulb, D: BarChart3,
  E: FlaskConical, F: Filter, G: PenTool, H: Award,
};

const PHASE_NAMES: Record<string, string> = {
  A: "تحديد النطاق", B: "اكتشاف الأدبيات", C: "توليف المعرفة",
  D: "تصميم المقارنة", E: "جمع البيانات", F: "التحليل والقرار",
  G: "كتابة الورقة", H: "التصدير النهائي",
};

function mdToHtml(md: string): string {
  if (!md) return "";
  let html = md;

  // Clean markdown artifacts
  html = html.replace(/```[\w]*\n?/g, "").replace(/```/g, "");

  // Escape HTML
  html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Headings
  html = html.replace(/^#### (.*$)/gim, '<h4 style="font-size:16px;font-weight:700;color:#1e3a8a;margin:18px 0 10px;border-bottom:1px solid #bfdbfe;padding-bottom:6px;">$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3 style="font-size:18px;font-weight:700;color:#1e40af;margin:22px 0 12px;border-bottom:2px solid #93c5fd;padding-bottom:8px;display:flex;align-items:center;gap:10px;"><span style="width:8px;height:8px;background:#3b82f6;border-radius:50%;display:inline-block;flex-shrink:0;"></span>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 style="font-size:20px;font-weight:700;color:#1d4ed8;margin:26px 0 14px;">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 style="font-size:22px;font-weight:700;color:#1e3a8a;margin:28px 0 16px;border-bottom:3px solid #3b82f6;padding-bottom:10px;">$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em style="color:#1e293b;">$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#0f172a;background:#fef3c7;padding:2px 6px;border-radius:4px;">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em style="color:#475569;">$1</em>');
  html = html.replace(/__(.*?)__/g, '<strong style="color:#0f172a;background:#fef3c7;padding:2px 6px;border-radius:4px;">$1</strong>');
  html = html.replace(/_(.*?)_/g, '<em style="color:#475569;">$1</em>');

  // Tab-separated tables (like Dependent Variables table)
  const tabTableRegex = /^(\d+)\t(.+)$/gm;
  if (html.match(tabTableRegex)) {
    const lines = html.split('\n').filter((l: string) => l.trim());
    const tableLines: string[] = [];
    let inTable = false;

    lines.forEach((line: string) => {
      if (line.match(/^(\d+)\t/)) {
        inTable = true;
        tableLines.push(line);
      } else if (inTable && line.trim() && !line.match(/^[\-═┌┐└┘├┤┬┴┼]+$/)) {
        tableLines.push(line);
      } else if (inTable && !line.trim()) {
        inTable = false;
      }
    });

    if (tableLines.length > 0) {
      let tableHtml = '<div style="overflow-x:auto;margin:20px 0;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);border:1px solid #e2e8f0;"><table style="width:100%;border-collapse:collapse;font-size:14px;">';
      tableHtml += '<thead><tr style="background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;">';
      tableHtml += '<th style="border:1px solid #1e40af;padding:12px 16px;text-align:right;font-weight:600;font-size:14px;width:60px;">#</th>';
      tableHtml += '<th style="border:1px solid #1e40af;padding:12px 16px;text-align:right;font-weight:600;font-size:14px;">المتغير</th>';
      tableHtml += '<th style="border:1px solid #1e40af;padding:12px 16px;text-align:right;font-weight:600;font-size:14px;">التعريف</th>';
      tableHtml += '<th style="border:1px solid #1e40af;padding:12px 16px;text-align:right;font-weight:600;font-size:14px;">الوحدة</th>';
      tableHtml += '<th style="border:1px solid #1e40af;padding:12px 16px;text-align:right;font-weight:600;font-size:14px;">المؤشرات</th>';
      tableHtml += '</tr></thead><tbody>';

      tableLines.forEach((line: string, idx: number) => {
        const cells = line.split('\t').map((c: string) => c.trim()).filter((c: string) => c);
        if (cells.length < 2) return;
        const bg = idx % 2 === 0 ? "#fff" : "#f8fafc";
        tableHtml += `<tr style="background:${bg};">`;
        cells.forEach((c: string) => {
          // Convert • and <br> to proper HTML
          let cellContent = c.replace(/•/g, '<span style="color:#3b82f6;margin-left:6px;">•</span>').replace(/&lt;br&gt;/g, '<br/>');
          tableHtml += `<td style="border:1px solid #e2e8f0;padding:12px 16px;text-align:right;color:#334155;font-size:14px;line-height:1.7;">${cellContent}</td>`;
        });
        tableHtml += '</tr>';
      });
      tableHtml += '</tbody></table></div>';

      // Replace table lines with HTML
      tableLines.forEach((line: string) => {
        html = html.replace(line, '');
      });
      html = html.replace(/\n{3,}/g, '\n\n') + tableHtml;
    }
  }

  // Markdown Tables
  const tableRegex = /\|(.+)\|\n\|[-\s|:]+\|\n((?:\|.+(?:\n)?)+)/g;
  html = html.replace(tableRegex, (match, header, rows) => {
    const headers = header.split("|").map((h: string) => h.trim()).filter((h: string) => h);
    const rowLines = rows.trim().split("\n").filter((r: string) => r.trim());
    let tableHtml = '<div style="overflow-x:auto;margin:20px 0;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);border:1px solid #e2e8f0;"><table style="width:100%;border-collapse:collapse;font-size:14px;">';
    tableHtml += '<thead><tr style="background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;">';
    headers.forEach((h: string) => { tableHtml += `<th style="border:1px solid #1e40af;padding:12px 16px;text-align:right;font-weight:600;font-size:14px;">${h}</th>`; });
    tableHtml += '</tr></thead><tbody>';
    rowLines.forEach((line: string, idx: number) => {
      const cells = line.split("|").map((c: string) => c.trim()).filter((c: string) => c);
      const bg = idx % 2 === 0 ? "#fff" : "#f8fafc";
      tableHtml += `<tr style="background:${bg};">`;
      cells.forEach((c: string) => { tableHtml += `<td style="border:1px solid #e2e8f0;padding:12px 16px;text-align:right;color:#334155;font-size:14px;line-height:1.7;">${c}</td>`; });
      tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table></div>';
    return tableHtml;
  });

  // Blockquotes
  html = html.replace(/^&gt; (.*$)/gim, '<blockquote style="border-right:4px solid #10b981;background:#ecfdf5;padding:14px 18px;margin:14px 0;border-radius:0 10px 10px 0;color:#065f46;font-style:italic;font-size:15px;">$1</blockquote>');

  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:16px 0;font-size:15px;line-height:1.8;color:#334155;"><div style="font-size:13px;color:#64748b;margin-bottom:8px;font-weight:600;">📄 محتوى</div>$1</div>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code style="background:#eff6ff;color:#1d4ed8;padding:3px 8px;border-radius:5px;font-size:14px;font-family:monospace;border:1px solid #bfdbfe;font-weight:500;">$1</code>');

  // Horizontal rule
  html = html.replace(/^---$/gim, '<hr style="border:none;border-top:2px solid #e2e8f0;margin:24px 0;" />');

  // Numbered lists
  html = html.replace(/^(\d+)\.\s+(.*$)/gim, '<div style="display:flex;gap:12px;margin-bottom:8px;align-items:flex-start;"><span style="min-width:28px;height:28px;background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;box-shadow:0 2px 4px rgba(59,130,246,0.3);">$1</span><span style="color:#334155;line-height:1.7;font-size:15px;padding-top:2px;">$2</span></div>');

  // Bullet points - handle • and - and +
  html = html.replace(/^[\*\-\+]\s+(.*$)/gim, '<div style="display:flex;gap:12px;margin-bottom:8px;align-items:flex-start;padding-right:4px;"><span style="color:#3b82f6;font-size:18px;line-height:1.6;flex-shrink:0;margin-top:2px;">•</span><span style="color:#334155;line-height:1.7;font-size:15px;">$1</span></div>');

  // Handle • characters that are not at start of line
  html = html.replace(/([^\n])•/g, '$1<span style="color:#3b82f6;margin:0 6px;">•</span>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:none;border-bottom:1px solid #93c5fd;font-weight:500;">$1</a>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:10px;margin:14px 0;box-shadow:0 2px 8px rgba(0,0,0,0.1);" />');

  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p style="margin-bottom:16px;line-height:1.9;color:#334155;font-size:15px;">');
  html = html.replace(/\n/g, '<br/>');

  if (!html.startsWith('<')) { html = '<p style="margin-bottom:16px;line-height:1.9;color:#334155;font-size:15px;">' + html + '</p>'; }

  return html;
}


// ← دالة لاستخراج أسماء الممارسات من نص الـ AI — مُصلحة
function extractPartners(text: string): { name: string; country: string; similarity: string; description: string }[] {
  const partners: { name: string; country: string; similarity: string; description: string }[] = [];

  if (!text || text.trim().length === 0) return [];

  // نمط البحث: ### 1. اسم النظام
  const sectionRegex = /###\s*\d+\.\s*(.+?)(?=(?:###\s*\d+\.|$))/gs;
  let match;

  while ((match = sectionRegex.exec(text)) !== null) {
    const sectionText = match[0];
    const lines = sectionText.split("\n").map(l => l.trim()).filter(l => l.length > 0);

    if (lines.length === 0) continue;

    // استخراج الاسم من السطر الأول
    const nameMatch = lines[0].match(/###\s*\d+\.\s*(.+)/);
    const name = nameMatch ? nameMatch[1].trim() : lines[0];

    // نتأكد إن الاسم مو عنوان عام
    const genericTitles = ["استخراج", "بحث", "ربط", "تصنيف", "تحليل", "معالجة", "توثيق", "سجل", "بيانات", "معلومات", "نظام", "النص", "الذكي"];
    const isGeneric = genericTitles.some(t => name.includes(t) && name.length < 30);

    // لو العنوان عام وقصير، نتجاهله
    if (isGeneric && !name.includes("سنغافورة") && !name.includes("بريطانيا") && !name.includes("قطر") && !name.includes("أستراليا") && !name.includes("هولندا") && !name.includes("كندا")) {
      continue;
    }

    // استخراج الجهة المنفذة
    let entity = "غير محدد";
    const entityMatch = sectionText.match(/\*\*الجهة المنفذة:\*\*\s*(.+)/);
    if (entityMatch) entity = entityMatch[1].trim();

    // استخراج الدولة
    let country = "غير محدد";
    const countryMatch = sectionText.match(/\*\*الدولة:\*\*\s*(.+)/);
    if (countryMatch) country = countryMatch[1].trim();

    // استخراج نسبة التقارب
    let similarity = "غير محدد";
    const simMatch = sectionText.match(/\*\*نسبة التقارب:\*\*\s*(\d+%?)/);
    if (simMatch) similarity = simMatch[1].includes('%') ? simMatch[1].trim() : simMatch[1].trim() + '%';

    // استخراج الوصف
    let description = "لا يوجد وصف";
    const descMatch = sectionText.match(/\*\*الوصف:\*\*\s*(.+)/);
    if (descMatch) {
      description = descMatch[1].trim();
      // نضيف السطور اللي بعدها لو فيها محتوى
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].startsWith("- ") || lines[i].startsWith("**")) break;
        if (lines[i].length > 10) description += " " + lines[i];
      }
    }
    description = description.substring(0, 200);
    if (sectionText.length > 200) description += "...";

    partners.push({ name, country, similarity, description });
  }

  // لو ما استخرجنا شيء، نجرب نمط تاني
  if (partners.length === 0) {
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      // نبحث عن أسطر فيها اسم دولة معروفة
      const countryNames = ["سنغافورة", "بريطانيا", "أستراليا", "قطر", "هولندا", "كندا", "أمريكا", "الولايات المتحدة", "المانيا", "فرنسا", "اليابان", "كوريا", "الصين", "الإمارات", "السعودية"];
      const hasCountry = countryNames.some(c => line.includes(c));

      if (hasCountry && line.length > 10 && line.length < 100) {
        const country = countryNames.find(c => line.includes(c)) || "غير محدد";
        const name = line;
        partners.push({ name, country, similarity: "غير محدد", description: "تم استخراج من النص" });
      }
    }
  }

  return partners.slice(0, 6);
}

export default function ResearchPage() {
  const { id } = useParams();
  const { currentRun, messages, currentStage, isRunning, stageOutputs, setCurrentStage, addMessage, setStageOutput, setIsRunning } = useResearchStore();
  const [activeTab, setActiveTab] = useState<"pipeline" | "output" | "chat">("chat");
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [paused, setPaused] = useState(false);
  const [pauseReason, setPauseReason] = useState("");
  const [resumeFn, setResumeFn] = useState<(() => void) | null>(null);
  const [exporting, setExporting] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ← جديد: state لاختيار الجهة الممارسة
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [showPartnerSelection, setShowPartnerSelection] = useState(false);
  const [partnerDetails, setPartnerDetails] = useState<string>("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  const stages = getStages();

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory, chatLoading]);

  const runPipeline = useCallback(async () => {
    if (!currentRun) return;
    setIsRunning(true);
    
    // ← جديد: تمرير selectedPartner للـ context
    const context: any = { 
      topic: currentRun.topic, 
      initiativeTitle: currentRun.initiativeTitle, 
      initiativeSummary: currentRun.initiativeSummary, 
      localEntity: currentRun.localEntity,
      selectedPartner: selectedPartner,
      stage1_5: {
        benchmarkPartners: partnerDetails,
        selectedPartner: selectedPartner,
      },
    };
    
    for (const stage of stages) {
      if (stage.number < currentStage) continue;

      // ← جديد: توقف بعد المرحلة 1.5 لاختيار الجهة الممارسة
      if (stage.number === 1.5) {
        // ← جديد: لو المستخدم اختار ممارسة، نتخطى المرحلة 1.5
        if (selectedPartner) {
          continue;
        }
        
        setCurrentStage(1.5);
        const { output, messages: stageMessages } = await executeStage(1.5, context);
        stageMessages.forEach((msg: PipelineMessage) => addMessage(msg));
        setStageOutput(1.5, output);
        context.stage1_5 = output;
        setPartnerDetails(output.benchmarkPartners || "");
        setShowPartnerSelection(true);
        setIsRunning(false);
        return;
      }

      setCurrentStage(stage.number);
      const hitlCheck = shouldPause(stage.number, currentRun.mode);
      if (hitlCheck.pause) {
        setPaused(true); setPauseReason(hitlCheck.reason || "");
        await new Promise<void>((resolve) => setResumeFn(() => resolve));
        setPaused(false); setResumeFn(null);
      }
      try {
        const { output, messages: stageMessages } = await executeStage(stage.number, context);
        stageMessages.forEach((msg: PipelineMessage) => addMessage(msg));
        setStageOutput(stage.number, output);
        context[`stage${stage.number}`] = output;
      } catch (err) {
        addMessage({ stage: stage.number, phase: stage.phase, message: `خطأ في المرحلة ${stage.number}: ${err instanceof Error ? err.message : "خطأ غير معروف"}`, timestamp: new Date() });
        setIsRunning(false); return;
      }
    }
    setCurrentStage(24); setIsRunning(false);
  }, [currentRun, currentStage, setCurrentStage, addMessage, setStageOutput, setIsRunning, selectedPartner, partnerDetails]);

  const handleResume = () => { if (resumeFn) resumeFn(); };
  const handleStart = () => { setCurrentStage(1); runPipeline(); };
  const handleReset = () => { setCurrentStage(0); setPaused(false); setPauseReason(""); setChatHistory([]); setSelectedPartner(null); setShowPartnerSelection(false); setPartnerDetails(""); };

  // ← جديد: اختيار ممارسة والاستمرار
  const handleSelectPartner = (partnerName: string) => {
    setSelectedPartner(partnerName);
    setShowPartnerSelection(false);
    setCurrentStage(2);
    setTimeout(() => runPipeline(), 100);
  };

  const handleSkipPartner = () => {
    setShowPartnerSelection(false);
    setCurrentStage(2);
    setTimeout(() => runPipeline(), 100);
  };

  const handleSendChat = async () => {
    if (!chatMessage.trim() || chatLoading) return;
    const userText = chatMessage.trim();
    setChatMessage("");
    setChatHistory(prev => [...prev, { role: "user", content: userText }]);
    setChatLoading(true);
    try {
      const s = stageOutputs;
      const paperContext = `عنوان المبادرة: ${currentRun?.initiativeTitle || ""}\nالجهة المنفذة: ${currentRun?.localEntity || ""}\nالملخص: ${currentRun?.initiativeSummary || ""}\n\nمحتوى البحث:\n- المقدمة: ${s[1]?.analysis?.substring(0, 500) || ""}\n- تفكيك المشكلة: ${s[2]?.decomposition?.substring(0, 500) || ""}\n- الأدبيات: ${s[4]?.literature?.substring(0, 500) || ""}\n- الفرضيات: ${s[7]?.hypotheses?.substring(0, 500) || ""}\n- إطار المقارنة: ${s[8]?.framework?.substring(0, 500) || ""}\n- النتائج: ${s[13]?.results?.substring(0, 500) || ""}\n- الورقة الكاملة: ${s[17]?.draft?.substring(0, 1000) || ""}`.trim();
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: userText, context: paperContext, initiativeTitle: currentRun?.initiativeTitle || "" }) });
      const data = await response.json();
      if (data.reply) { setChatHistory(prev => [...prev, { role: "assistant", content: data.reply }]); }
      else { setChatHistory(prev => [...prev, { role: "assistant", content: "عذراً، لم أتمكن من معالجة سؤالك. يرجى المحاولة مرة أخرى." }]); }
    } catch (err) {
      console.error("Chat error:", err);
      setChatHistory(prev => [...prev, { role: "assistant", content: "عذراً، حدث خطأ في الاتصال. يرجى التحقق من الإنترنت والمحاولة مرة أخرى." }]);
    } finally { setChatLoading(false); }
  };

  const exportToWord = async () => {
    setExporting(true);
    try {
      const s = stageOutputs;
      const title = currentRun?.initiativeTitle || "ورقة بحثية";
      const entity = currentRun?.localEntity || "";
      const summary = currentRun?.initiativeSummary || "";
      const htmlContent = `<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>${title}</title><style>@page{size:A4;margin:2.5cm}*{box-sizing:border-box}body{font-family:"Segoe UI","Arial",sans-serif;direction:rtl;text-align:right;line-height:2;color:#1a1a2e;background:#fff;padding:40px;max-width:210mm;margin:0 auto}.cover{text-align:center;padding:60px 20px;border:3px solid #1e40af;border-radius:16px;margin-bottom:40px;background:linear-gradient(135deg,#f8fafc 0%,#e0e7ff 100%)}.cover h1{font-size:26px;color:#1e40af;margin-bottom:16px;font-weight:700}.cover .entity{font-size:16px;color:#475569;font-weight:500}.cover .badge{display:inline-block;margin-top:20px;padding:8px 24px;background:#1e40af;color:#fff;border-radius:20px;font-size:12px;font-weight:600}h2{font-size:18px;color:#1e40af;border-bottom:2px solid #1e40af;padding-bottom:8px;margin-top:32px;margin-bottom:16px;font-weight:700}h3{font-size:15px;color:#334155;margin-top:20px;margin-bottom:10px;font-weight:600}p{font-size:13px;margin-bottom:12px;text-align:justify;text-align-last:right}.abstract-box{background:#f1f5f9;border-right:4px solid #1e40af;padding:20px;border-radius:8px;margin-bottom:30px}.section{margin-bottom:24px}.hypothesis{background:#fef3c7;border-right:4px solid #f59e0b;padding:14px;border-radius:8px;margin:10px 0}.review-box{background:#ecfdf5;border-right:4px solid #10b981;padding:14px;border-radius:8px;margin:10px 0}.gap-box{background:#fef2f2;border-right:4px solid #ef4444;padding:14px;border-radius:8px;margin:10px 0}.footer{margin-top:50px;padding-top:20px;border-top:1px solid #e2e8f0;text-align:center;font-size:11px;color:#94a3b8}table{width:100%;border-collapse:collapse;margin:16px 0;font-size:12px}th,td{border:1px solid #cbd5e1;padding:10px;text-align:right}th{background:#1e40af;color:#fff;font-weight:600}tr:nth-child(even){background:#f8fafc}ul{margin:8px 0;padding-right:20px}li{margin-bottom:6px}.page-break{page-break-after:always}</style></head><body><div class="cover"><h1>${title}</h1><div class="entity">${entity}</div><div class="badge">ورقة بحثية مقارنة معيارية</div></div><div class="abstract-box"><h2 style="margin-top:0;border:none;">الملخص التنفيذي</h2><p>${summary.replace(/\n/g,"<br>")}</p></div><div class="section"><h2>1. المقدمة والإطار النظري</h2><p>${(s[1]?.analysis||"لم يتم إنشاء المحتوى بعد").replace(/\n/g,"<br>")}</p></div><div class="section"><h2>2. تفكيك المشكلة</h2><p>${(s[2]?.decomposition||"").replace(/\n/g,"<br>")}</p></div><div class="section"><h2>3. الأدبيات المرجعية</h2><p>${(s[4]?.literature||"").replace(/\n/g,"<br>")}</p></div><div class="section"><h2>4. توليف المعرفة</h2><p>${(s[6]?.synthesis||"").replace(/\n/g,"<br>")}</p></div><div class="section"><h2>5. الفرضيات البحثية</h2><div class="hypothesis">${(s[7]?.hypotheses||"").replace(/\n/g,"<br>")}</div></div><div class="section"><h2>6. إطار المقارنة المعيارية</h2><p>${(s[8]?.framework||"").replace(/\n/g,"<br>")}</p></div><div class="section"><h2>7. مؤشرات الأداء (KPIs)</h2><p>${(s[9]?.kpis||"").replace(/\n/g,"<br>")}</p></div><div class="section"><h2>8. خطة جمع البيانات</h2><p>${(s[10]?.dataPlan||"").replace(/\n/g,"<br>")}</p></div><div class="section"><h2>9. تحليل البيانات</h2><p>${(s[12]?.analysis||"").replace(/\n/g,"<br>")}</p></div><div class="section"><h2>10. النتائج</h2><p>${(s[13]?.results||"").replace(/\n/g,"<br>")}</p></div><div class="section"><h2>11. تحديد الفجوات والثغرات</h2><div class="gap-box">${(s[14]?.gaps||"").replace(/\n/g,"<br>")}</div></div><div class="page-break"></div><div class="section"><h2>12. الورقة البحثية الكاملة (IMRaD)</h2><p>${(s[17]?.draft||s[16]?.outline||"").replace(/\n/g,"<br>")}</p></div><div class="section"><h2>13. مراجعة الأقران</h2><div class="review-box">${(s[18]?.reviews||"").replace(/\n/g,"<br>")}</div></div><div class="section"><h2>14. النسخة المُحسّنة</h2><p>${(s[19]?.revision||"").replace(/\n/g,"<br>")}</p></div><div class="footer">تم إنشاء هذا البحث بواسطة نظام بيان — نظام البحث والمقارنة المعيارية<br>${new Date().toLocaleDateString("ar-SA")}</div></body></html>`;
      const blob = new Blob([htmlContent], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `${title}.doc`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    } catch (err) { console.error("Export error:", err); alert("حدث خطأ أثناء التصدير"); }
    finally { setExporting(false); }
  };

  const getFullPaper = () => {
    const s = stageOutputs;
    if (!s[17]?.draft && !s[19]?.revision) return null;
    const title = currentRun?.initiativeTitle || "";
    const entity = currentRun?.localEntity || "";
    const summary = currentRun?.initiativeSummary || "";

    const sections = [
      { num: "1", title: "المقدمة والإطار النظري", content: s[1]?.analysis || "" },
      { num: "2", title: "تفكيك المشكلة", content: s[2]?.decomposition || "" },
      { num: "3", title: "الأدبيات المرجعية", content: s[4]?.literature || "" },
      { num: "4", title: "توليف المعرفة", content: s[6]?.synthesis || "" },
      { num: "5", title: "الفرضيات البحثية", content: s[7]?.hypotheses || "" },
      { num: "6", title: "إطار المقارنة المعيارية", content: s[8]?.framework || "" },
      { num: "7", title: "مؤشرات الأداء (KPIs)", content: s[9]?.kpis || "" },
      { num: "8", title: "خطة جمع البيانات", content: s[10]?.dataPlan || "" },
      { num: "9", title: "تحليل البيانات", content: s[12]?.analysis || "" },
      { num: "10", title: "النتائج", content: s[13]?.results || "" },
      { num: "11", title: "تحديد الفجوات والثغرات", content: s[14]?.gaps || "" },
      { num: "12", title: "الورقة البحثية الكاملة (IMRaD)", content: s[17]?.draft || s[16]?.outline || "" },
      { num: "13", title: "مراجعة الأقران", content: s[18]?.reviews || "" },
      { num: "14", title: "النسخة المُحسّنة", content: s[19]?.revision || "" },
    ];

    return { title, entity, summary, sections };
  };

  // استخراج الممارسات من نص الـ AI
  const partners = extractPartners(partnerDetails);

  if (!currentRun) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600">لم يتم العثور على التشغيل</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden" dir="rtl">
      {/* ====== HEADER (Fixed) ====== */}
      <header className="bg-white border-b border-slate-200 shrink-0 z-40">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-base lg:text-lg font-bold text-slate-900 truncate max-w-[200px] lg:max-w-md">{currentRun.initiativeTitle}</h1>
            <span className="hidden sm:inline-flex px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
              {currentRun.mode === "FULL_AUTO" ? "تلقائي" : currentRun.mode === "REVIEW_EACH" ? "مراجعة كل مرحلة" : currentRun.mode === "REVIEW_CRITICAL" ? "مراجعة حرجة" : currentRun.mode === "CHAT_GUIDED" ? "محادثة" : currentRun.mode === "STEP_BY_STEP" ? "خطوة بخطوة" : "يدوي"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isRunning ? (
              <span className="flex items-center gap-1.5 text-amber-600 text-sm bg-amber-50 px-3 py-1 rounded-full"><Clock className="w-4 h-4 animate-spin" />جاري التشغيل...</span>
            ) : currentStage >= 23 ? (
              <span className="flex items-center gap-1.5 text-green-600 text-sm bg-green-50 px-3 py-1 rounded-full"><CheckCircle className="w-4 h-4" />مكتمل</span>
            ) : (
              <span className="flex items-center gap-1.5 text-slate-500 text-sm bg-slate-100 px-3 py-1 rounded-full"><Clock className="w-4 h-4" />في الانتظار</span>
            )}
          </div>
        </div>
      </header>

      {/* ====== BODY: Sidebar + Content ====== */}
      <div className="flex flex-1 overflow-hidden">

        {/* ====== SIDEBAR (Fixed, scrolls internally) ====== */}
        <aside className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 bg-white border-l border-slate-200 flex flex-col overflow-hidden shrink-0`}>
          {/* Progress */}
          <div className="p-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-800 text-sm">تقدم البحث</h3>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{Math.min(currentStage, 23)} / 23</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-l from-blue-500 to-blue-600 transition-all duration-700 rounded-full" style={{ width: `${Math.min((currentStage / 23) * 100, 100)}%` }} />
            </div>
          </div>

          {/* Stages List (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {stages.map((stage) => {
              const isActive = currentStage === stage.number && isRunning;
              const isCompleted = stageOutputs[stage.number] || currentStage > stage.number;
              const PhaseIcon = PHASE_ICONS[stage.phase];
              return (
                <div key={stage.number} className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-all ${isActive ? "bg-blue-50 border border-blue-200" : isCompleted ? "bg-green-50/60" : "hover:bg-slate-50"}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isActive ? "bg-blue-600 text-white animate-pulse" : isCompleted ? "bg-green-500 text-white" : "bg-slate-200 text-slate-500"}`}>
                    {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : stage.number}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium truncate ${isActive ? "text-blue-700" : isCompleted ? "text-green-700" : "text-slate-600"}`}>{stage.name}</p>
                    <p className="text-[10px] text-slate-400">{PHASE_NAMES[stage.phase]}</p>
                  </div>
                  {isActive && <PhaseIcon className="w-4 h-4 text-blue-500 animate-pulse shrink-0" />}
                </div>
              );
            })}
          </div>

          {/* Actions (Fixed at bottom) */}
          <div className="p-3 border-t border-slate-100 space-y-2 shrink-0">
            {!isRunning && currentStage === 0 && (
              <button onClick={handleStart} className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-700/20 font-semibold text-sm">
                <Play className="w-4 h-4" />بدء التشغيل
              </button>
            )}
            {currentStage >= 23 && (
              <button onClick={exportToWord} disabled={exporting} className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition font-semibold text-sm disabled:opacity-50">
                <Download className="w-4 h-4" />{exporting ? "جاري التصدير..." : "تحميل Word"}
              </button>
            )}
            <button onClick={handleReset} className="w-full border border-slate-300 hover:bg-slate-50 text-slate-700 py-2.5 rounded-xl flex items-center justify-center gap-2 transition text-sm font-medium">
              <RotateCcw className="w-4 h-4" />إعادة التعيين
            </button>
          </div>
        </aside>

        {/* ====== MAIN CONTENT (Fixed height, scrolls internally) ====== */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Tabs (Fixed) */}
          <div className="bg-white border-b border-slate-200 px-4 lg:px-6 py-2 flex items-center gap-1 shrink-0">
            <button onClick={() => setActiveTab("pipeline")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === "pipeline" ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}>
              <BarChart3 className="w-4 h-4" />سير العمل
            </button>
            <button onClick={() => setActiveTab("output")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === "output" ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}>
              <FileText className="w-4 h-4" />المخرجات
            </button>
            <button onClick={() => setActiveTab("chat")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === "chat" ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}>
              <MessageSquare className="w-4 h-4" />المحادثة
            </button>
          </div>

          {/* ====== CHAT TAB (Fixed layout) ====== */}
          {activeTab === "chat" && (
            <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-slate-50/50 to-white">

              {/* Chat Header (Fixed) */}
              <div className="px-4 lg:px-8 py-3 border-b border-slate-100 flex items-center gap-3 shrink-0">
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 text-sm">مساعد البحث الذكي</div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    متصل ومستعد للمساعدة
                  </div>
                </div>
                {currentStage >= 23 && (
                  <span className="mr-auto text-[10px] bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">البحث مكتمل</span>
                )}
              </div>

              {/* Messages Area (Scrollable only here!) */}
              <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 space-y-6">
                {chatHistory.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl mb-6">
                      🤖
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-3">مرحباً! 👋</h2>
                    <p className="text-slate-500 max-w-md text-base leading-relaxed">
                      أنا مساعدك البحثي الذكي. يمكنك سؤالي عن أي شيء يخص البحث:<br/>
                      الفرضيات، النتائج، التوصيات، الفجوات، والمزيد...
                    </p>
                    <div className="flex flex-wrap gap-2 mt-6 justify-center">
                      {["ما هي الفرضيات الرئيسية؟", "لخص لي النتائج", "اشرح إطار المقارنة", "ما الفجوات المكتشفة؟"].map((q) => (
                        <button key={q} onClick={() => setChatMessage(q)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition">
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex gap-4 ${msg.role === "user" ? "flex-row" : "flex-row-reverse"}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"}`}>
                      {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`max-w-[85%] lg:max-w-[75%] p-5 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-blue-600 text-white rounded-tl-sm" : "bg-white text-slate-800 rounded-tr-sm border border-slate-200 shadow-sm"}`}>
                      {msg.role === "assistant" ? (
                        <div dir="rtl" style={{ textAlign: 'right' }} dangerouslySetInnerHTML={{ __html: mdToHtml(msg.content) }} />
                      ) : (
                        <span className="text-[15px]">{msg.content}</span>
                      )}
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex gap-4 flex-row-reverse">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-sm">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white rounded-tr-sm rounded-2xl p-5 border border-slate-200 shadow-sm">
                      <div className="flex gap-2 items-center">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200" />
                        <span className="text-xs text-slate-500 mr-2">يكتب...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area (Fixed at bottom) */}
              <div className="px-4 lg:px-8 py-4 border-t border-slate-200 bg-white shrink-0">
                <div className="max-w-4xl mx-auto flex gap-3 items-center bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-400 transition-all">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                    placeholder="اسأل عن البحث..."
                    className="flex-1 bg-transparent border-none outline-none text-[15px] text-slate-700 placeholder:text-slate-400"
                    disabled={chatLoading}
                  />
                  <button
                    onClick={handleSendChat}
                    disabled={chatLoading || !chatMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white w-10 h-10 rounded-xl flex items-center justify-center transition shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-center text-[11px] text-slate-400 mt-2">مساعد البحث الذكي — يمكن أن يخطئ، راجع المعلومات المهمة</p>
              </div>
            </div>
          )}

          {/* ====== PIPELINE TAB ====== */}
          {activeTab === "pipeline" && (
            <div className="flex-1 overflow-y-auto p-4 lg:p-8">
              <div className="max-w-4xl mx-auto">
                <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-2 text-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />سجل التشغيل
                </h3>
                <div className="space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                      <Clock className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg">لم يبدأ التشغيل بعد</p>
                      <p className="text-sm mt-1">اضغط "بدء التشغيل" للبدء</p>
                    </div>
                  ) : (
                    messages.map((msg, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                        <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${msg.message.includes("بدء") ? "bg-blue-500" : msg.message.includes("اكتمل") ? "bg-green-500" : msg.message.includes("خطأ") ? "bg-red-500" : "bg-slate-400"}`} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-slate-700">{msg.message}</p>
                          <p className="text-xs text-slate-400 mt-1">المرحلة {msg.stage} · الطور {msg.phase} · {new Date(msg.timestamp).toLocaleTimeString("ar-SA")}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ====== OUTPUT TAB ====== */}
          {activeTab === "output" && (
            <div className="flex-1 overflow-y-auto p-4 lg:p-8">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-lg">
                    <FileText className="w-5 h-5 text-blue-600" />الورقة البحثية الكاملة
                  </h3>
                  {currentStage >= 23 && (
                    <button onClick={exportToWord} disabled={exporting} className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition disabled:opacity-50 font-medium">
                      <Download className="w-4 h-4" />{exporting ? "جاري التصدير..." : "تحميل Word"}
                    </button>
                  )}
                </div>
                {(() => {
                  const paper = getFullPaper();
                  if (!paper) return (
                    <div className="text-center py-20 text-slate-400">
                      <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg">لم تكتمل الورقة بعد</p>
                      <p className="text-sm mt-1">ستظهر هنا بعد اكتمال مرحلة كتابة الورقة</p>
                    </div>
                  );
                  return (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      {/* Cover */}
                      <div className="text-center p-12 border-b-4 border-blue-600 bg-gradient-to-b from-slate-50 to-blue-50/30">
                        <div className="inline-block px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full mb-4">ورقة بحثية مقارنة معيارية</div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3 leading-tight">{paper.title}</h1>
                        <p className="text-lg text-slate-600 font-medium">{paper.entity}</p>
                        <div className="mt-6 w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
                      </div>

                      {/* Abstract */}
                      <div className="p-8 bg-blue-50/30 border-b border-slate-100">
                        <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                          <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm">📋</span>
                          الملخص التنفيذي
                        </h2>
                        <p className="text-slate-700 leading-relaxed text-base">{paper.summary}</p>
                      </div>

                      {/* Sections */}
                      <div className="p-8 space-y-8">
                        {paper.sections.map((sec, idx) => {
                          if (!sec.content?.trim()) return null;
                          const colors = [
                            "border-blue-500 bg-blue-50/30",
                            "border-emerald-500 bg-emerald-50/30",
                            "border-amber-500 bg-amber-50/30",
                            "border-purple-500 bg-purple-50/30",
                            "border-rose-500 bg-rose-50/30",
                            "border-cyan-500 bg-cyan-50/30",
                            "border-orange-500 bg-orange-50/30",
                            "border-pink-500 bg-pink-50/30",
                          ];
                          const color = colors[idx % colors.length];
                          return (
                            <div key={sec.num} className={`border-r-4 ${color} pr-6 py-2 rounded-r-xl`}>
                              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <span className="w-7 h-7 bg-slate-800 text-white rounded-lg flex items-center justify-center text-xs font-bold">{sec.num}</span>
                                {sec.title}
                              </h2>
                              <div 
                                className="text-slate-700 leading-relaxed text-[15px]"
                                dangerouslySetInnerHTML={{ 
                                  __html: mdToHtml(sec.content)
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* Footer */}
                      <div className="p-6 bg-slate-50 border-t border-slate-200 text-center">
                        <p className="text-sm text-slate-500">تم إنشاء هذا البحث بواسطة نظام بيان — نظام البحث والمقارنة المعيارية</p>
                        <p className="text-xs text-slate-400 mt-1">{new Date().toLocaleDateString("ar-SA", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ====== Partner Selection Overlay (DYNAMIC) ====== */}
      {showPartnerSelection && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-5xl w-full mx-4 shadow-2xl border-2 border-blue-300 my-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-blue-800 text-lg">اختيار الممارسة المعيارية</h3>
                <p className="text-sm text-blue-600">اختر نظاماً واحداً للمقارنة المعيارية</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mb-5 border border-blue-200">
              <p className="text-blue-800 text-sm">
                النظام بحث في العالم واقترح <strong>6 ممارسات/أنظمة</strong> مناسبة للمقارنة مع <strong>{currentRun?.localEntity}</strong>.
                اختر النظام الأنسب للمقارنة المعيارية.
              </p>
            </div>

            {/* Partners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 max-h-[55vh] overflow-y-auto p-2">
              {partners.map((partner, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPartner(partner.name)}
                  className={`p-5 rounded-xl border-2 text-right transition-all hover:shadow-xl hover:-translate-y-1 ${
                    selectedPartner === partner.name 
                      ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200" 
                      : "border-slate-200 hover:border-blue-400 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 ${
                      selectedPartner === partner.name ? "bg-blue-600" : "bg-gradient-to-br from-blue-500 to-indigo-600"
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 mb-1 text-sm">{partner.name}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                        <Building2 className="w-3 h-3" />
                        <span>{partner.country}</span>
                      </div>
                      <p className="text-xs text-slate-400 mb-3 line-clamp-2">{partner.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs">
                          <TrendingUp className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-600 font-semibold">تقارب: {partner.similarity}</span>
                        </div>
                        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                          selectedPartner === partner.name 
                            ? "bg-blue-600 text-white" 
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {selectedPartner === partner.name ? (
                            <><Check className="w-3 h-3" />تم الاختيار</>
                          ) : (
                            <><BarChart3 className="w-3 h-3" />اختيار</>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Full AI Content Preview */}
            {partnerDetails && (
              <div className="mb-5 border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-medium text-slate-600">التفاصيل الكاملة من الـ AI</span>
                </div>
                <div className="p-4 max-h-48 overflow-y-auto">
                  <div 
                    className="text-slate-700 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: mdToHtml(partnerDetails) }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button 
                onClick={handleSkipPartner}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-xl flex items-center justify-center gap-2 transition font-semibold"
              >
                تخطي الاختيار
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== HITL Pause Overlay ====== */}
      {paused && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border-2 border-amber-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Pause className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-amber-800 text-lg">توقف للمراجعة</h3>
                <p className="text-sm text-amber-600">التدخل البشري مطلوب</p>
              </div>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 mb-5 border border-amber-200">
              <p className="text-amber-800 text-sm">{pauseReason}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleResume} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition font-semibold">
                <ChevronLeft className="w-5 h-5" />متابعة التشغيل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}