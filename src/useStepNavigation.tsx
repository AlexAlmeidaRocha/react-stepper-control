import { useCallback } from 'react';
import {
  StepStateCallback,
  UpdateStepInput,
  UpdateGeneralStateInput,
  UseStepNavigationProps,
} from './types/StepTypes';

export const useStepNavigation = <T,>({
  currentStep,
  setCurrentStep,
  state,
  setLoading,
  updateSteps,
  updateGeneralInfo,
  updateGeneralState,
  addError,
}: UseStepNavigationProps<T>) => {
  const onNext = useCallback(
    async (args?: {
      onCompleteStep?: StepStateCallback<T>;
      updateStepsRequest?: UpdateStepInput[];
      updateGeneralStates?: UpdateGeneralStateInput<T>;
    }) => {
      const { onCompleteStep, updateStepsRequest, updateGeneralStates } =
        args || {};
      setLoading(true);

      try {
        let currentState = state;
        if (updateGeneralStates) {
          currentState = updateGeneralState(updateGeneralStates);
        }

        const updateStepsResponse = updateSteps([
          {
            stepIndex: currentStep,
            data: { touch: true, canAccess: true, isCompleted: true },
          },
          {
            stepIndex: currentStep + 1,
            data: { touch: true, canAccess: true },
          },
          ...(updateStepsRequest || []),
        ]);

        const updateGeneralInfoResponse = updateGeneralInfo({
          progress: (currentStep + 1) / currentState.generalInfo.totalSteps,
        });

        currentState = {
          ...currentState,
          steps: updateStepsResponse.steps,
          generalInfo: updateGeneralInfoResponse,
        };

        if (onCompleteStep) {
          await onCompleteStep(currentState);
        }

        if (currentStep < currentState.generalInfo.totalSteps - 1) {
          setCurrentStep((prev) => prev + 1);
        }
      } catch (error) {
        console.error('Error in onNext:', error);
      } finally {
        setLoading(false);
      }
    },
    [currentStep, state],
  );

  const onPrev = async (callback?: StepStateCallback<T>) => {
    if (currentStep === 0) return;

    if (callback) {
      setLoading(true);
      await callback(state);
      setLoading(false);
    }

    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = useCallback(
    async (
      nextStep: number,
      args?: {
        onCompleteStep?: StepStateCallback<T>;
        updateStepsRequest?: UpdateStepInput[];
        updateGeneralStates?: { stepIndex?: number; data: Partial<T> };
      },
    ) => {
      if (nextStep === currentStep) return;
      const { onCompleteStep, updateStepsRequest, updateGeneralStates } =
        args || {};

      if (nextStep > state.generalInfo.totalSteps - 1) {
        throw new Error(`The step ${nextStep} does not exist.`);
      }

      if (nextStep > currentStep) {
        if (!state.steps[nextStep].canAccess) {
          addError(
            currentStep,
            `The step ${nextStep} is not accessible because it is not access.`,
          );
          return;
        }
      }

      setLoading(true);

      try {
        let currentState = state;
        if (updateGeneralStates) {
          currentState = updateGeneralState(updateGeneralStates);
        }

        const updateStepsResponse = updateSteps(updateStepsRequest || []);

        const updateGeneralInfoResponse = updateGeneralInfo({
          progress: (nextStep + 1) / currentState.generalInfo.totalSteps,
        });

        currentState = {
          ...currentState,
          steps: updateStepsResponse.steps,
          generalInfo: updateGeneralInfoResponse,
        };

        if (onCompleteStep) {
          await onCompleteStep(currentState);
        }

        setCurrentStep(nextStep);
      } catch (error) {
        console.error('Error in goToStep:', error);
      } finally {
        setLoading(false);
      }
    },
    [currentStep, state],
  );

  return { onNext, onPrev, goToStep };
};
