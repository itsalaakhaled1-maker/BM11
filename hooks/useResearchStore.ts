'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResearchRun, Stage, HitlMode, PipelineMessage } from '@/types';

interface ResearchState {
  runs: ResearchRun[];
  currentRun: ResearchRun | null;
  isRunning: boolean;
  currentStage: number;
  messages: PipelineMessage[];
  stageOutputs: Record<number, any>;

  setCurrentRun: (run: ResearchRun | null) => void;
  addRun: (run: ResearchRun) => void;
  updateRun: (id: string, updates: Partial<ResearchRun>) => void;
  setIsRunning: (running: boolean) => void;
  setCurrentStage: (stage: number) => void;
  addMessage: (msg: PipelineMessage) => void;
  setStageOutput: (stage: number, output: any) => void;
  clearMessages: () => void;
}

export const useResearchStore = create<ResearchState>()(
  persist(
    (set) => ({
      runs: [],
      currentRun: null,
      isRunning: false,
      currentStage: 0,
      messages: [],
      stageOutputs: {},

      setCurrentRun: (run) => set({ currentRun: run }),
      addRun: (run) => set((state) => ({ runs: [...state.runs, run] })),
      updateRun: (id, updates) => set((state) => ({
        runs: state.runs.map(r => r.id === id ? { ...r, ...updates } : r),
        currentRun: state.currentRun?.id === id ? { ...state.currentRun, ...updates } : state.currentRun,
      })),
      setIsRunning: (running) => set({ isRunning: running }),
      setCurrentStage: (stage) => set({ currentStage: stage }),
      addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
      setStageOutput: (stage, output) => set((state) => ({
        stageOutputs: { ...state.stageOutputs, [stage]: output },
      })),
      clearMessages: () => set({ messages: [] }),
    }),
    { name: 'bm11-research-store' }
  )
);