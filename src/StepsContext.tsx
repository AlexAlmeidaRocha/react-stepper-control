import React, { useReducer, useState } from 'react';
import {
  StepsContextState,
  StepContextProps,
  StepProviderProps,
  ConfigProps,
} from './types/StepTypes';
import StepReducer from './StepsReducer';
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
  initialConfig = { steps: [] },
}: StepProviderProps<T>) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useReducer(StepReducer<T>, initialState);
  const [config, setConfig] = useState<ConfigProps>(initialConfig);

  const {
    setStepsInfo,
    updateSteps,
    updateGeneralState,
    updateGeneralInfo,
    addError,
    updateConfig,
  } = useStepsActions<T>({ dispatch, state, currentStep, setConfig });

  const { onNext, onPrev, goToStep } = useStepNavigation<T>({
    currentStep,
    setCurrentStep,
    state,
    setLoading,
    updateSteps,
    updateGeneralInfo,
    updateGeneralState,
    addError,
  });

  return (
    <StepsContext.Provider
      value={{
        activeStep: {
          ...state.steps[currentStep],
          index: currentStep,
          isLastStep: currentStep === state.generalInfo.totalSteps - 1,
          isFirstStep: currentStep === 0,
        },
        onNext,
        onPrev,
        goToStep,
        loading,
        stepState: state,
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
