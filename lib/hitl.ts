const CRITICAL_STAGES = [1, 7, 8, 15, 17, 18, 20, 21];

import { HitlMode } from '@/types';

export function shouldPause(stageNumber: number, mode: HitlMode): { pause: boolean; reason?: string } {
  switch (mode) {
    case 'FULL_AUTO':
      return { pause: false };
    case 'REVIEW_EACH':
      return { pause: true, reason: `مراجعة المرحلة ${stageNumber}` };
    case 'REVIEW_CRITICAL':
      if (CRITICAL_STAGES.includes(stageNumber)) {
        return { pause: true, reason: `مرحلة حرجة: ${stageNumber} - تحتاج مراجعة` };
      }
      return { pause: false };
    case 'STEP_BY_STEP':
      return { pause: true, reason: `المرحلة ${stageNumber} - اضغط متابعة للاستمرار` };
    case 'MANUAL':
      return { pause: true, reason: 'الوضع اليدوي - يرجى التحكم يدوياً' };
    default:
      return { pause: false };
  }
}

export function getModeLabel(mode: HitlMode): string {
  const labels: Record<HitlMode, string> = {
    FULL_AUTO: 'تشغيل تلقائي كامل',
    REVIEW_EACH: 'مراجعة كل مرحلة',
    REVIEW_CRITICAL: 'مراجعة المراحل الحرجة',
    CHAT_GUIDED: 'توجيه عبر المحادثة',
    STEP_BY_STEP: 'خطوة بخطوة',
    MANUAL: 'يدوي كامل',
  };
  return labels[mode] || mode;
}

export function getModeDescription(mode: HitlMode): string {
  const desc: Record<HitlMode, string> = {
    FULL_AUTO: 'يتم تشغيل جميع المراحل تلقائياً بدون توقف',
    REVIEW_EACH: 'يتوقف النظام بعد كل مرحلة للمراجعة',
    REVIEW_CRITICAL: 'يتوقف فقط عند المراحل الحرجة (الفرضيات، المقارنة، القرار، المراجعة)',
    CHAT_GUIDED: 'يمكنك التوجيه عبر المحادثة في أي وقت',
    STEP_BY_STEP: 'يتوقف بعد كل مرحلة - اضغط متابعة للاستمرار',
    MANUAL: 'أنت تتحكم في كل خطوة يدوياً',
  };
  return desc[mode] || '';
}
