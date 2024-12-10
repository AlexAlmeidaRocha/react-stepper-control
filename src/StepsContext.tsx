import React, { useState } from 'react';
import {
  StepsContextState,
  StepContextProps,
  StepProviderProps,
} from './types/StepTypes';
import { useStepsActions } from './useStepsActions';
import { useStepNavigation } from './useStepNavigation';

const initialState: StepsContextState<any> = {
  generalInfo: { totalSteps: 0, progress: 0 },
  steps: [],
  generalState: {},
  errors: [],
};

export const StepsContext = React.createContext<StepContextProps<any> | null>(
  null,
);

export const StepsProvider = <T,>({
  children,
  initialConfig = {
    steps: [],
  },
}: StepProviderProps<T>) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stepsState, updateStepsState] = useState(initialState);
  const [config, setConfig] = useState(initialConfig);

  const {
    setStepsInfo,
    updateSteps,
    updateGeneralState,
    addError,
    updateConfig,
  } = useStepsActions<T>({
    updateStepsState,
    stepsState,
    currentStep,
    setConfig,
  });

  const { onNext, onPrev, goToStep } = useStepNavigation<T>({
    currentStep,
    setCurrentStep,
    stepsState,
    updateStepsState,
    setLoading,
    addError,
    config,
  });

  return (
    <StepsContext.Provider
      value={{
        activeStep: {
          ...stepsState.steps[currentStep],
          index: currentStep,
          isLastStep: currentStep === stepsState.generalInfo.totalSteps - 1,
          isFirstStep: currentStep === 0,
        },
        onNext,
        onPrev,
        goToStep,
        loading,
        stepsState,
        updateGeneralState,
        updateConfig,
        setStepsInfo,
        updateSteps,
      }}
    >
      {children}
    </StepsContext.Provider>
  );
};
