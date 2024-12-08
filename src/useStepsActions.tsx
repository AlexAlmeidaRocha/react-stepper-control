import { useCallback } from 'react';
import {
  StepsContextState,
  GeneralInfoProps,
  UpdateGeneralStateInput,
  UpdateStepInput,
  StepConfiguration,
  StepStateProps,
  UseStepsActionsProps,
} from './types/StepTypes';
import { ActionTypes } from './StepsReducer';

export const useStepsActions = <T,>({
  dispatch,
  state,
  currentStep,
  setConfig,
}: UseStepsActionsProps<T>) => {
  const setStepsInfo = useCallback((steps: StepConfiguration[]) => {
    dispatch({ type: ActionTypes.SET_STEPS, payload: steps });
  }, []);

  const updateGeneralState = useCallback(
    ({
      stepIndex = currentStep,
      data,
    }: UpdateGeneralStateInput<T>): StepsContextState<T> => {
      // if (stepIndex < 0 || stepIndex >= state.steps.length) {
      //   throw new Error(`Invalid stepIndex: ${stepIndex}.`);
      // }

      // const newState: StepsContextState<T> = {
      //   ...state,
      //   generalState: {
      //     ...state.generalState,
      //     [`step${currentStep + 1}` as keyof typeof state.generalState]: {
      //       ...(state.generalState[`step${currentStep + 1}` as keyof typeof state.generalState] || {}),
      //       ...data,
      //     } as T,
      //   },
      // };
      const newState: StepsContextState<T> = {
        ...state,
        generalState: {
          ...state.generalState,
          ...data,
        },
      };
      dispatch({
        type: ActionTypes.UPDATE_GENERAL_STATE,
        payload: { stepIndex, data },
      });
      return newState;
    },
    [currentStep, state],
  );

  const updateGeneralInfo = useCallback(
    (data: Partial<GeneralInfoProps>): GeneralInfoProps => {
      dispatch({ type: ActionTypes.UPDATE_GENERAL_INFO, payload: data });
      return { ...state.generalInfo, ...data };
    },
    [state.generalInfo],
  );

  const updateSteps = useCallback(
    (updates: UpdateStepInput[]): StepsContextState<T> => {
      const validKeys: (keyof StepStateProps)[] = [
        'touch',
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

      const updatedSteps = [...state.steps];
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
        ...state,
        steps: updatedSteps,
      };

      dispatch({
        type: ActionTypes.UPDATE_STEP,
        payload: updates,
      });

      return newState;
    },
    [currentStep, state],
  );

  const addError = useCallback((stepIndex: number, message: string) => {
    if (
      state.errors?.find(
        (error) => error.step === stepIndex && error.message === message,
      )
    ) {
      return;
    }

    dispatch({ type: ActionTypes.ADD_ERROR, payload: { stepIndex, message } });
  }, []);

  const updateConfig = useCallback((key: string, data: any) => {
    setConfig((prev) => ({ ...prev, [key]: data }));
  }, []);

  return {
    setStepsInfo,
    updateGeneralState,
    updateGeneralInfo,
    updateSteps,
    addError,
    updateConfig,
  };
};
