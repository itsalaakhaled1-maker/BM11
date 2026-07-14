'use server';

export interface MetaClawLearning {
  pattern: string;
  successRate: number;
  usageCount: number;
}

const memory: MetaClawLearning[] = [];

export async function learnFromRun(runData: any): Promise<MetaClawLearning[]> {
  const pattern = extractPattern(runData);
  const existing = memory.find(m => m.pattern === pattern);

  if (existing) {
    existing.usageCount++;
    existing.successRate = (existing.successRate * (existing.usageCount - 1) + (runData.success ? 1 : 0)) / existing.usageCount;
  } else {
    memory.push({
      pattern,
      successRate: runData.success ? 1 : 0,
      usageCount: 1,
    });
  }

  return memory;
}

function extractPattern(runData: any): string {
  return `${runData.topic?.slice(0, 30)}_${runData.mode}_${runData.stagesCompleted}`;
}

export function getLearnings(): MetaClawLearning[] {
  return memory.sort((a, b) => b.successRate - a.successRate);
}