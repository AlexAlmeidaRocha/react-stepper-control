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
  updateStep,
  updateGeneralInfo,
  updateGeneralState,
  addError,
}: UseStepNavigationProps<T>) => {
  const onNext = useCallback(
    async (args?: {
      onCompleteStep?: StepStateCallback<T>;
      updateSteps?: UpdateStepInput[];
      updateGeneralStates?: UpdateGeneralStateInput<T>;
    }) => {
      const { onCompleteStep, updateSteps, updateGeneralStates } = args || {};
      setLoading(true);

      try {
        let currentState = state;
        if (updateGeneralStates) {
          currentState = updateGeneralState(updateGeneralStates);
        }

        const updatedSteps = currentState.steps;
        updateSteps?.forEach((step) => {
          const update = updateStep(step);
          updatedSteps[step.stepIndex] = update.steps[step.stepIndex];
        });

        const updateStepResponse = updateStep({
          stepIndex: currentStep,
          data: { touch: true, canAccess: true, isCompleted: true },
        });

        const updateGeneralInfoResponse = updateGeneralInfo({
          progress: (currentStep + 1) / currentState.generalInfo.totalSteps,
        });

        currentState = {
          ...currentState,
          steps: updateStepResponse.steps,
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

    // dispatch({
    //   type: ActionTypes.UPDATE_STEP,
    //   payload: {
    //     stepIndex: currentStep,
    //     data: { touch: true, canAccess: true },
    //   },
    // });

    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = useCallback(
    async (
      nextStep: number,
      args?: {
        onCompleteStep?: StepStateCallback<T>;
        updateSteps?: UpdateStepInput[];
        updateGeneralStates?: { stepIndex?: number; data: Partial<T> };
      },
    ) => {
      if (nextStep === currentStep) return;
      const { onCompleteStep, updateSteps, updateGeneralStates } = args || {};

      if (nextStep > state.generalInfo.totalSteps - 1) {
        addError(
          currentStep,
          `The step ${nextStep} does not exist. There are only ${state.generalInfo.totalSteps} steps.`,
        );
        return;
      }

      if (nextStep > currentStep) {
        if (!state.steps[nextStep].canAccess) {
          addError(
            currentStep,
            `The step ${nextStep} is not accessible because it has not been completed or is locked.`,
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

        const updatedSteps = currentState.steps;
        updateSteps?.forEach((step) => {
          const update = updateStep(step);
          updatedSteps[step.stepIndex] = update.steps[step.stepIndex];
        });

        const updateStepResponse = updateStep({
          stepIndex: currentStep,
          data: { touch: true, canAccess: true, isCompleted: true },
        });

        const updateGeneralInfoResponse = updateGeneralInfo({
          progress: (nextStep + 1) / currentState.generalInfo.totalSteps,
        });

        currentState = {
          ...currentState,
          steps: updateStepResponse.steps,
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
