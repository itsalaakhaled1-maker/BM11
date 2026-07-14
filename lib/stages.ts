export interface StageInfo {
  number: number;
  phase: string;
  name: string;
}

export const STAGES: StageInfo[] = [
  { number: 1, phase: 'A', name: 'تهيئة الموضوع' },
  { number: 1.5, phase: 'A', name: 'اختيار الجهة الممارسة' }, // ← جديدة
  { number: 2, phase: 'A', name: 'تفكيك المشكلة' },
  { number: 3, phase: 'B', name: 'استراتيجية البحث' },
  { number: 4, phase: 'B', name: 'جمع الأدبيات' },
  { number: 5, phase: 'B', name: 'فرز الأدبيات' },
  { number: 6, phase: 'C', name: 'توليف المعرفة' },
  { number: 7, phase: 'C', name: 'توليد الفرضيات' },
  { number: 8, phase: 'D', name: 'إطار المقارنة المعيارية' },
  { number: 9, phase: 'D', name: 'مؤشرات الأداء' },
  { number: 10, phase: 'E', name: 'جمع البيانات' },
  { number: 11, phase: 'E', name: 'التحقق من البيانات' },
  { number: 12, phase: 'E', name: 'تحليل البيانات' },
  { number: 13, phase: 'F', name: 'تحليل النتائج' },
  { number: 14, phase: 'F', name: 'تحديد الفجوات' },
  { number: 15, phase: 'F', name: 'قرار البحث' },
  { number: 16, phase: 'G', name: 'هيكل الورقة' },
  { number: 17, phase: 'G', name: 'مسودة الورقة' },
  { number: 18, phase: 'G', name: 'مراجعة الأقران' },
  { number: 19, phase: 'G', name: 'مراجعة الورقة' },
  { number: 20, phase: 'H', name: 'بوابة الجودة' },
  { number: 21, phase: 'H', name: 'التحقق النهائي من الاقتباسات' },
  { number: 22, phase: 'H', name: 'التصدير والنشر' },
  { number: 23, phase: 'H', name: 'الأرشفة والتعلم' },
];

export function getStages(): StageInfo[] {
  return STAGES;
}