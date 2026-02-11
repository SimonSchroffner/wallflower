/**
 * Customization state management hook
 */

import { useState } from 'react';
import type { FlowerType, LeafStyle, FlowerColor } from '@wallflower/shared';
import { PETAL_COUNT_RANGE } from '@wallflower/shared';

export type Step = 'type' | 'color' | 'leaves' | 'petals' | 'confirm';

interface CustomizerState {
  flowerType: FlowerType;
  color: FlowerColor;
  leaves: LeafStyle;
  petalCount: number;
  currentStep: Step;
}

const STEPS: Step[] = ['type', 'color', 'leaves', 'petals', 'confirm'];

export function useCustomizer() {
  const [state, setState] = useState<CustomizerState>({
    flowerType: 'rose',
    color: { r: 220, g: 20, b: 60 },
    leaves: 'simple',
    petalCount: PETAL_COUNT_RANGE.default,
    currentStep: 'type',
  });

  const currentStepIndex = STEPS.indexOf(state.currentStep);
  const canGoBack = currentStepIndex > 0;
  const canGoNext = currentStepIndex < STEPS.length - 1;

  const goNext = () => {
    if (canGoNext) {
      setState((prev) => ({
        ...prev,
        currentStep: STEPS[currentStepIndex + 1],
      }));
    }
  };

  const goBack = () => {
    if (canGoBack) {
      setState((prev) => ({
        ...prev,
        currentStep: STEPS[currentStepIndex - 1],
      }));
    }
  };

  const setFlowerType = (type: FlowerType) => {
    setState((prev) => ({ ...prev, flowerType: type }));
  };

  const setColor = (color: FlowerColor) => {
    setState((prev) => ({ ...prev, color }));
  };

  const setLeaves = (leaves: LeafStyle) => {
    setState((prev) => ({ ...prev, leaves }));
  };

  const setPetalCount = (count: number) => {
    setState((prev) => ({ ...prev, petalCount: count }));
  };

  const reset = () => {
    setState({
      flowerType: 'rose',
      color: { r: 220, g: 20, b: 60 },
      leaves: 'simple',
      petalCount: PETAL_COUNT_RANGE.default,
      currentStep: 'type',
    });
  };

  return {
    ...state,
    currentStepIndex,
    totalSteps: STEPS.length,
    canGoBack,
    canGoNext,
    goNext,
    goBack,
    setFlowerType,
    setColor,
    setLeaves,
    setPetalCount,
    reset,
    getCustomization: () => ({
      flowerType: state.flowerType,
      color: state.color,
      leaves: state.leaves,
      petalCount: state.petalCount,
    }),
  };
}
