import React, { useCallback, useReducer, useState } from 'react';
import { StepsContextState, StepContextProps, StepStateCallback, StepStateProps, StepConfiguration, StepProviderProps, StepStateCallback2, UpdateStepInput } from "./types/StepTypes";
import StepReducer, { ActionTypes } from './StepsReducer';

const initialState: StepsContextState<any> = {
  generalInfo: { totalSteps: 0 },
  steps: [],
  generalState: {},
  errors: []
};

export const StepsContext = React.createContext<StepContextProps<any> | null>(null);

export const StepsProvider = <T,>({ children, initialConfig = { steps: [] } }: StepProviderProps<T>) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useReducer(StepReducer<T>, initialState);
  const [config, setConfig] = useState(initialConfig);

  const setStepsInfo = useCallback((steps: StepConfiguration[]) => {
    dispatch({ type: ActionTypes.SET_STEPS, payload: steps });
  }, []);

  const updateGeneralState = useCallback((data: Partial<T>): StepsContextState<T> => {
    console.log('data', data);

    // Pensar em um forma de validar para não salvar/atualizar dados inválidos
    if (!state.generalState) {
      console.log('O estado geral não foi inicializado.');
      return state;
      // throw new Error('O estado geral não foi inicializado.');
    }
    const validKeys = Object.keys(state.generalState) as (keyof T)[];
    console.log('validKeys', validKeys);
    const isValidData = Object.keys(data).every((key) => validKeys.includes(key as keyof T));
    console.log('isValidData', isValidData);

    // if (!isValidData) {
    // 	throw new Error(
    // 		`Dados inválidos fornecidos: ${JSON.stringify(data)}. As chaves válidas são: ${validKeys.join(', ')}`
    // 	);
    // }

    const newState: StepsContextState<T> = {
      ...state,
      generalState: {
        ...state.generalState,
        ...data,
      } as T,
    };
    dispatch({ type: ActionTypes.UPDATE_GENERAL_STATE, payload: { data } });
    return newState;
  }, [currentStep, state]);

  const updateConfig = useCallback((key: string, data: any) => {
    setConfig((prev) => ({ ...prev, [key]: data }));
  }, []);

  const updateStep = useCallback((updateSteps: UpdateStepInput): StepsContextState<T> => {
    const { stepIndex, data } = updateSteps;
    const validKeys: (keyof StepStateProps)[] = ['touch', 'canAccess', 'canEdit'];
    const isValidData = Object.keys(data).every((key) => validKeys.includes(key as keyof StepStateProps));

    if (!isValidData) {
      throw new Error(`Dados inválidos fornecidos: ${JSON.stringify(data)}. As chaves válidas são: ${validKeys.join(', ')}`);
    }

    const updatedSteps = [...state.steps];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      ...data
    };
    const newState = {
      ...state,
      steps: updatedSteps
    };
    dispatch({ type: ActionTypes.UPDATE_STEP, payload: { stepIndex, data } });
    return newState;
  }, []);

  // const addError = useCallback((stepIndex: number, message: string) => {
  // 	if (state.errors?.find((error) => error.step === step && error.message === message)) {
  // 		return;
  // 	}

  // 	dispatch({ type: 'ADD_ERROR', payload: { stepIndex, message } });
  // }, []);

  const onNext = useCallback(async (args?: {
    onCompleteStep?: StepStateCallback<T>;
    formState?: T;
    updateSteps?: UpdateStepInput[];
    updateGeneralStates?: Partial<T>;
  }) => {
    const { onCompleteStep, formState, updateSteps, updateGeneralStates } = args || {};
    setLoading(true);

    try {
      if (onCompleteStep) {
        await onCompleteStep(state);
      }

      updateSteps?.forEach((step) => updateStep(step));

      if (updateGeneralStates) {
        updateGeneralState(updateGeneralStates);
      }

      if (formState) {
        updateGeneralState(formState);
      }

      dispatch({
        type: ActionTypes.UPDATE_STEP,
        payload: {
          stepIndex: currentStep,
          data: { touch: true, canAccess: true },
        },
      });

      if (currentStep < state.generalInfo.totalSteps - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Erro em onNext:", error);
    } finally {
      setLoading(false);
    }
  }, [currentStep, state]);

  const onPrev = async (callback?: StepStateCallback<T>) => {
    if (currentStep === 0) return;

    if (callback) {
      setLoading(true);
      await callback(state);
      setLoading(false);
    }

    dispatch({
      type: ActionTypes.UPDATE_STEP,
      payload: {
        stepIndex: currentStep,
        data: { touch: true, canAccess: true }
      }
    });

    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = useCallback(async (nextStep: number, args?: {
    onCompleteStep?: StepStateCallback<T>;
    formState?: T;
    updateSteps?: UpdateStepInput[];
    updateGeneralStates?: Partial<T>;
  }) => {
    const { onCompleteStep, formState, updateSteps, updateGeneralStates } = args || {};
    if (nextStep === currentStep) return;

    if (nextStep > state.generalInfo.totalSteps - 1) {
      console.warn(`O passo ${nextStep} não existe.`);
      return
    }

    if (nextStep > currentStep) {
      if (!state.steps[nextStep].canAccess) return;
    }

    setLoading(true);

    try {
      if (onCompleteStep) {
        await onCompleteStep(state);
      }

      updateSteps?.forEach((step) => updateStep(step));

      if (updateGeneralStates) {
        updateGeneralState(updateGeneralStates);
      }

      if (formState) {
        updateGeneralState(formState);
      }

      dispatch({
        type: ActionTypes.UPDATE_STEP,
        payload: {
          stepIndex: currentStep,
          data: { touch: true, canAccess: true },
        },
      });

      setCurrentStep(nextStep);
    } catch (error) {
      console.error("Erro em goToStep:", error);
    }
    finally {
      setLoading(false);
    }

    setCurrentStep(nextStep);
  }, [currentStep, state]);

  return (
    <StepsContext.Provider value={{
      activeStep: { ...state.steps[currentStep], index: currentStep },
      onNext,
      onPrev,
      goToStep,
      loading,
      stepState: state,
      setStepsInfo,
      updateGeneralState,
      updateConfig,
      updateStep
    }}>
      {children}
    </StepsContext.Provider>
  );
};