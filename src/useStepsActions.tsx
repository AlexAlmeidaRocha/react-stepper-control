import { useCallback } from 'react';
import {
  StepsContextState,
  UpdateGeneralStateInput,
  UpdateStepInput,
  StepConfiguration,
  StepStateProps,
  UseStepsActionsProps,
  StateConfigProps,
} from './types/StepTypes';

export const useStepsActions = <T,>({
  updateStepsState,
  stepsState,
  currentStep,
  setCurrentStep,
  setConfig,
  config,
}: UseStepsActionsProps<T>) => {
  const setStepsInfo = useCallback((steps: StepConfiguration[]) => {
    const newState = {
      ...stepsState,
      generalInfo: {
        totalSteps: steps.length,
        currentProgress: 0,
        completedProgress: 0,
        canAccessProgress: 0,
      },
      steps: steps.map((step: StepConfiguration) => ({
        name: step.name,
        canAccess: step.canAccess || false,
        canEdit: step.canEdit || false,
        isOptional: step.isOptional || false,
        isCompleted: step.isCompleted || false,
      })),
    };
    updateStepsState(newState);
  }, []);

  const updateStateWithLocalStorage = useCallback(
    (stepsContextState: StepsContextState<T>) => {
      const newState = {
        ...stepsState,
        generalInfo: {
          totalSteps: stepsContextState.steps.length,
          currentProgress: stepsContextState.generalInfo.currentProgress || 0,
          completedProgress:
            stepsContextState.generalInfo.completedProgress || 0,
          canAccessProgress:
            stepsContextState.generalInfo.canAccessProgress || 0,
        },
        steps: stepsContextState.steps.map((step) => ({
          name: step.name,
          canAccess: step.canAccess || false,
          canEdit: step.canEdit || false,
          isOptional: step.isOptional || false,
          isCompleted: step.isCompleted || false,
        })),
        generalState: stepsContextState.generalState,
      };
      setCurrentStep(
        stepsContextState.steps.filter((step) => step.isCompleted === true)
          .length || 0,
      );
      updateStepsState(newState);
    },
    [],
  );

  const cleanLocalStorage = useCallback(() => {
    localStorage.removeItem('stepsState');
  }, []);

  const updateGeneralState = useCallback(
    ({
      stepIndex = currentStep,
      data,
    }: UpdateGeneralStateInput<T>): StepsContextState<T> => {
      const newState: StepsContextState<T> = {
        ...stepsState,
        generalState: {
          ...stepsState.generalState,
          ...data,
        },
      };
      updateStepsState(newState);

      if (config.saveLocalStorage) {
        localStorage.setItem('stepsState', JSON.stringify(newState));
      }

      return newState;
    },
    [currentStep, stepsState],
  );

  const updateSteps = useCallback(
    (updates: UpdateStepInput[]): StepsContextState<T> => {
      const validKeys: (keyof StepStateProps)[] = [
        'canAccess',
        'canEdit',
        'isOptional',
        'isCompleted',
      ];

      updates.forEach(({ data }) => {
        const isValidData = Object.keys(data).every((key) =>
          validKeys.includes(key as keyof StepStateProps),
        );

        if (!isValidData) {
          throw new Error(
            `Invalid data provided: ${JSON.stringify(data)}. Valid keys are: ${validKeys.join(', ')}`,
          );
        }
      });

      const updatedSteps = [...stepsState.steps];
      updates.forEach(({ stepIndex, data }) => {
        if (stepIndex < 0 || stepIndex >= updatedSteps.length) {
          throw new Error(`Invalid stepIndex: ${stepIndex}.`);
        }
        updatedSteps[stepIndex] = {
          ...updatedSteps[stepIndex],
          ...data,
        };
      });

      const newState = {
        ...stepsState,
        steps: updatedSteps,
      };
      updateStepsState(newState);

      if (config.saveLocalStorage) {
        localStorage.setItem('stepsState', JSON.stringify(newState));
      }

      return newState;
    },
    [currentStep, stepsState],
  );

  const addError = useCallback((stepIndex: number, message: string) => {
    if (
      stepsState.errors?.find(
        (error) => error.step === stepIndex && error.message === message,
      )
    ) {
      return;
    }
    const newState = {
      ...stepsState,
      errors: [
        ...(stepsState.errors || []),
        {
          step: stepIndex,
          message,
        },
      ],
    };

    if (config.saveLocalStorage) {
      localStorage.setItem('stepsState', JSON.stringify(newState));
    }

    updateStepsState(newState);
  }, []);

  const updateConfig = useCallback((config: StateConfigProps) => {
    setConfig((prev) => ({
      ...prev,
      ...config,
    }));
  }, []);

  return {
    setStepsInfo,
    updateStateWithLocalStorage,
    updateGeneralState,
    updateSteps,
    addError,
    updateConfig,
    cleanLocalStorage,
  };
};
