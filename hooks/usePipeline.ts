'use client';

import { useState, useCallback } from 'react';
import { executeStage } from '@/lib/orchestrator';
import { getStages } from '@/lib/stages';
import { shouldPause } from '@/lib/hitl';
import { useResearchStore } from './useResearchStore';
import { HitlMode, PipelineMessage } from '@/types';

export function usePipeline() {
  const [paused, setPaused] = useState(false);
  const [pauseReason, setPauseReason] = useState('');
  const { currentRun, setCurrentStage, addMessage, setStageOutput, setIsRunning } = useResearchStore();

  const runPipeline = useCallback(async (mode: HitlMode, context: any) => {
    setIsRunning(true);
    const stages = getStages();

    for (const stage of stages) {
      setCurrentStage(stage.number);

      // Check HITL pause
      const hitlCheck = shouldPause(stage.number, mode);
      if (hitlCheck.pause) {
        setPaused(true);
        setPauseReason(hitlCheck.reason || '');
        // Wait for user to resume
        await waitForResume();
        setPaused(false);
      }

      try {
        const { output, messages } = await executeStage(stage.number, context);

        messages.forEach((msg: PipelineMessage) => addMessage(msg));
        setStageOutput(stage.number, output);

        // Update context for next stages
        context[`stage${stage.number}`] = output;
      } catch (err) {
        addMessage({
          stage: stage.number,
          phase: stage.phase,
          message: `خطأ في المرحلة ${stage.number}: ${err instanceof Error ? err.message : 'خطأ غير معروف'}`,
          timestamp: new Date(),
        });
        setIsRunning(false);
        return;
      }
    }

    setCurrentStage(24);
    setIsRunning(false);
  }, [setCurrentStage, addMessage, setStageOutput, setIsRunning]);

  const resume = useCallback(() => {
    if (window.resumePipeline) window.resumePipeline();
  }, []);

  return { runPipeline, paused, pauseReason, resume };
}

function waitForResume(): Promise<void> {
  return new Promise((resolve) => {
    (window as any).resumePipeline = resolve;
  });
}