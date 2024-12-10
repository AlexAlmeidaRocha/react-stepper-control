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
  stepsState,
  updateStepsState,
  setLoading,
  addError,
  config,
}: UseStepNavigationProps<T>) => {
  const onNext = useCallback(
    async (args?: {
      onCompleteStep?: StepStateCallback<T>;
      updateStepsStatus?: UpdateStepInput[];
      updateGeneralStates?: UpdateGeneralStateInput<T>;
    }) => {
      const { onCompleteStep, updateStepsStatus, updateGeneralStates } =
        args || {};
      setLoading(true);

      try {
        let currentState = stepsState;

        const updatedStepsStatus = currentState.steps;

        updateStepsStatus?.forEach((updateStep) => {
          updatedStepsStatus[updateStep.stepIndex] = {
            ...currentState.steps[updateStep.stepIndex],
            ...updateStep.data,
          };
        });

        currentState = {
          ...currentState,
          steps: [
            ...updatedStepsStatus.map((step, index) => {
              if (
                config?.validations?.isCompleted &&
                index === currentStep
              ) {
                return {
                  ...step,
                  canAccess: true,
                  isCompleted: true,
                };
              }

              if (
                config?.validations?.canAccess &&
                index === currentStep + 1
              ) {
                return {
                  ...step,
                  canAccess: true,
                };
              }

              return step;
            }),
          ],
          generalInfo: {
            ...currentState.generalInfo,
            progress: (currentStep + 1) / currentState.generalInfo.totalSteps,
          },
          generalState: {
            ...currentState.generalState,
            ...(updateGeneralStates?.data || {}),
          },
        };

        if (onCompleteStep) {
          await onCompleteStep(currentState);
        }

        updateStepsState(currentState);

        if (currentStep < currentState.generalInfo.totalSteps - 1) {
          setCurrentStep((prev) => prev + 1);
        }
      } catch (error) {
        console.error('Error in onNext:', error);
      } finally {
        setLoading(false);
      }
    },
    [currentStep, stepsState],
  );

  const onPrev = async (callback?: StepStateCallback<T>) => {
    if (currentStep === 0) return;

    if (callback) {
      setLoading(true);
      await callback(stepsState);
      setLoading(false);
    }

    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = useCallback(
    async (
      nextStep: number,
      args?: {
        onCompleteStep?: StepStateCallback<T>;
        updateStepsStatus?: UpdateStepInput[];
        updateGeneralStates?: { stepIndex?: number; data: Partial<T> };
      },
    ) => {
      if (nextStep === currentStep) return;
      const { onCompleteStep, updateStepsStatus, updateGeneralStates } =
        args || {};

      if (nextStep > stepsState.generalInfo.totalSteps - 1) {
        throw new Error(`The step ${nextStep} does not exist.`);
      }

      if (nextStep > currentStep) {
        if (config?.next?.canAccess && !stepsState.steps[nextStep].canAccess) {
          addError(
            currentStep,
            `The step ${nextStep} is not accessible because it is not access.`,
          );
          return;
        }
      }

      setLoading(true);

      try {
        let currentState = stepsState;
        const updatedStepsStatus = currentState.steps;

        updateStepsStatus?.forEach((updateStep) => {
          updatedStepsStatus[updateStep.stepIndex] = {
            ...currentState.steps[updateStep.stepIndex],
            ...updateStep.data,
          };
        });

        currentState = {
          ...currentState,
          steps: [...updatedStepsStatus],
          generalInfo: {
            ...currentState.generalInfo,
            progress: (currentStep + 1) / currentState.generalInfo.totalSteps,
          },
          generalState: {
            ...currentState.generalState,
            ...(updateGeneralStates || {}),
          },
        };

        if (onCompleteStep) {
          await onCompleteStep(currentState);
        }

        updateStepsState(currentState);
        setCurrentStep(nextStep);
      } catch (error) {
        console.error('Error in goToStep:', error);
      } finally {
        setLoading(false);
      }
    },
    [currentStep, stepsState],
  );

  return { onNext, onPrev, goToStep };
};
