"use server";

import { executeStage, getStages } from "@/lib/orchestrator";
import { verifyCitation, getOverallVerification } from "@/lib/verification";
import { aiChat } from "@/lib/ai-service";
import { learnFromRun } from "@/lib/metaclaw";

export async function runStage(stageNumber: number, context: any) {
  return executeStage(stageNumber, context);
}

export async function verifyCitationAction(citation: { title: string; doi?: string; url?: string }) {
  const results = await verifyCitation(citation);
  const overall = getOverallVerification(results);
  return { results, overall };
}

export async function chatWithAI(messages: { role: string; content: string }[]) {
  return aiChat(messages);
}

export async function getAllStages() {
  return getStages();
}

export async function archiveRun(runData: any) {
  return learnFromRun(runData);
}
