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

        const updateSteps = currentState.steps.map((step, index) => {
          const isCurrentStep = index === currentStep;
          const isNextStep = index === currentStep + 1;

          if (isCurrentStep) {
            return {
              ...step,
              canAccess: config.next?.currentStep?.canAccess ?? true,
              isCompleted: config.next?.currentStep?.isCompleted ?? true,
              isOptional:
                config.next?.currentStep?.isOptional ?? step.isOptional,
              canEdit: config.next?.currentStep?.canEdit ?? step.canEdit,
            };
          }

          if (isNextStep) {
            return {
              ...step,
              canAccess: config.next?.nextStep?.canAccess ?? true,
              isCompleted:
                config.next?.nextStep?.isCompleted ?? step.isCompleted,
              isOptional: config.next?.nextStep?.isOptional ?? step.isOptional,
              canEdit: config.next?.nextStep?.canEdit ?? step.canEdit,
            };
          }

          return step;
        });

        currentState = {
          ...currentState,
          steps: updateSteps,
          generalInfo: {
            ...currentState.generalInfo,
            currentProgress:
              (currentStep + 1) / (currentState.generalInfo.totalSteps || 1),
            completedProgress:
              updateSteps.filter((item) => item.isCompleted === true).length /
              (currentState.generalInfo.totalSteps || 1),
            canAccessProgress:
              updateSteps.filter((item) => item.canAccess === true).length /
              (currentState.generalInfo.totalSteps || 1),
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

  const onPrev = async (args?: {
    onCompleteStep?: StepStateCallback<T>;
    updateStepsStatus?: UpdateStepInput[];
    updateGeneralStates?: UpdateGeneralStateInput<T>;
  }) => {
    if (currentStep === 0) {
      addError(currentStep, 'You are in the first step.');
      return;
    }
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

      const updateSteps = currentState.steps.map((step, index) => {
        const isCurrentStep = index === currentStep;
        const isNextStep = index === currentStep + 1;

        if (isCurrentStep) {
          return {
            ...step,
            canAccess: config.next?.currentStep?.canAccess ?? step.canAccess,
            isCompleted:
              config.next?.currentStep?.isCompleted ?? step.isCompleted,
            isOptional: config.next?.currentStep?.isOptional ?? step.isOptional,
            canEdit: config.next?.currentStep?.canEdit ?? step.canEdit,
          };
        }

        if (isNextStep) {
          return {
            ...step,
            canAccess: config.next?.nextStep?.canAccess ?? step.canAccess,
            isCompleted: config.next?.nextStep?.isCompleted ?? step.isCompleted,
            isOptional: config.next?.nextStep?.isOptional ?? step.isOptional,
            canEdit: config.next?.nextStep?.canEdit ?? step.canEdit,
          };
        }

        return step;
      });

      currentState = {
        ...currentState,
        steps: updateSteps,
        generalInfo: {
          ...currentState.generalInfo,
          currentProgress:
            (currentStep - 1) / (currentState.generalInfo.totalSteps || 1),
          completedProgress:
            updateSteps.filter((item) => item.isCompleted === true).length /
            (currentState.generalInfo.totalSteps || 1),
          canAccessProgress:
            updateSteps.filter((item) => item.canAccess === true).length /
            (currentState.generalInfo.totalSteps || 1),
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
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error('Error in goToStep:', error);
    } finally {
      setLoading(false);
    }
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

      const validationCanAccess = config?.validations?.goToStep?.canAccess
        ? config.validations.goToStep.canAccess
        : true;

      if (validationCanAccess) {
        if (nextStep > currentStep) {
          if (!stepsState.steps[nextStep].canAccess) {
            addError(
              currentStep,
              `The step ${nextStep} is not accessible because it is not access.`,
            );
            return;
          }
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

        const updateSteps = currentState.steps.map((step, index) => {
          const isCurrentStep = index === currentStep;
          const isNextStep = index === nextStep;

          if (isCurrentStep) {
            return {
              ...step,
              canAccess: config.next?.currentStep?.canAccess ?? step.canAccess,
              isCompleted:
                config.next?.currentStep?.isCompleted ?? step.isCompleted,
              isOptional:
                config.next?.currentStep?.isOptional ?? step.isOptional,
              canEdit: config.next?.currentStep?.canEdit ?? step.canEdit,
            };
          }

          if (isNextStep) {
            return {
              ...step,
              canAccess: config.next?.nextStep?.canAccess ?? step.canAccess,
              isCompleted:
                config.next?.nextStep?.isCompleted ?? step.isCompleted,
              isOptional: config.next?.nextStep?.isOptional ?? step.isOptional,
              canEdit: config.next?.nextStep?.canEdit ?? step.canEdit,
            };
          }

          return step;
        });

        currentState = {
          ...currentState,
          steps: updateSteps,
          generalInfo: {
            ...currentState.generalInfo,
            currentProgress:
              nextStep / (currentState.generalInfo.totalSteps || 1),
            completedProgress:
              updateSteps.filter((item) => item.isCompleted === true).length /
              (currentState.generalInfo.totalSteps || 1),
            canAccessProgress:
              updateSteps.filter((item) => item.canAccess === true).length /
              (currentState.generalInfo.totalSteps || 1),
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
