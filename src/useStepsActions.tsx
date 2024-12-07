import { useCallback } from 'react';
import {
  StepsContextState,
  GeneralInfoProps,
  UpdateGeneralStateInput,
  UpdateStepInput,
  StepActionProps,
  StepConfiguration,
  StepStateProps,
  ConfigProps,
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
      // Pensar em um forma de validar para não salvar/atualizar dados inválidos
      if (!state.generalState) {
        return state;
        // throw new Error('O estado geral não foi inicializado.');
      }
      // const validKeys = Object.keys(state.generalState) as (keyof T)[];
      // const isValidData = Object.keys(data).every((key) => validKeys.includes(key as keyof T));

      // if (!isValidData) {
      // 	throw new Error(
      // 		`Dados inválidos fornecidos: ${JSON.stringify(data)}. As chaves válidas são: ${validKeys.join(', ')}`
      // 	);
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

  const updateStep = useCallback(
    (updateSteps: UpdateStepInput): StepsContextState<T> => {
      const { stepIndex, data } = updateSteps;
      const validKeys: (keyof StepStateProps)[] = [
        'touch',
        'canAccess',
        'canEdit',
        'isOptional',
        'isCompleted',
      ];
      const isValidData = Object.keys(data).every((key) =>
        validKeys.includes(key as keyof StepStateProps),
      );

      if (!isValidData) {
        throw new Error(
          `Invalid data provided: ${JSON.stringify(data)}. Valid keys are: ${validKeys.join(', ')}`,
        );
      }

      const updatedSteps = [...state.steps];
      updatedSteps[stepIndex] = {
        ...updatedSteps[stepIndex],
        ...data,
      };
      const newState = {
        ...state,
        steps: updatedSteps,
      };
      dispatch({ type: ActionTypes.UPDATE_STEP, payload: { stepIndex, data } });
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
    updateStep,
    addError,
    updateConfig,
  };
};
