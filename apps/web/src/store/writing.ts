import { create } from 'zustand';
import type { WritingStyle } from '@repo/types';
import { streamSuggestions } from '../lib/ai';

interface WritingState {
  activeStyle: WritingStyle;
  aiFeedback: string;
  isThinking: boolean;
  triggerAnalysis: (textContext: string, precedingContext?: string) => Promise<void>;
  setActiveStyle: (style: WritingStyle) => void;
}

export const useWritingStore = create<WritingState>((set, get) => ({
  activeStyle: 'punchy',
  aiFeedback: '',
  isThinking: false,

  setActiveStyle: (style) => set({ activeStyle: style }),

  triggerAnalysis: async (textContext, precedingContext) => {
    set({ isThinking: true, aiFeedback: '' });
    try {
      await streamSuggestions(
        { context: textContext, precedingContext, style: get().activeStyle },
        (delta) => set((s) => ({ aiFeedback: s.aiFeedback + delta })),
      );
    } catch (err) {
      console.error('AI analysis failed:', err);
      set({
        aiFeedback:
          'Could not reach the AI service. Make sure `pnpm --filter api dev` is running.',
      });
    } finally {
      set({ isThinking: false });
    }
  },
}));
