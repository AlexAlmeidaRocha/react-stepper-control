import { ActionTypes } from '../StepsReducer';

export interface GeneralInfoProps {
  totalSteps: number;
  progress: number;
}

export interface StepStateProps {
  name: string;
  touch: boolean;
  canAccess: boolean;
  canEdit: boolean;
  isOptional: boolean;
  isCompleted: boolean;
}

export interface ActiveStepProps extends StepStateProps {
  isLastStep: boolean;
  isFirstStep: boolean;
  index: number;
}

export interface StepConfiguration extends Partial<StepStateProps> {
  name: string;
  component: React.ReactNode;
}

export interface StepsContextState<T> {
  generalInfo: GeneralInfoProps;
  steps: StepStateProps[];
  generalState: T;
  errors?: {
    step: number;
    message: string;
  }[];
}

export interface StepContextProps<T> {
  activeStep: ActiveStepProps;
  onNext: (args?: {
    onCompleteStep?: StepStateCallback<T>;
    updateSteps?: UpdateStepInput[];
    updateGeneralStates?: UpdateGeneralStateInput<T>;
  }) => void;
  onPrev: (callback?: StepStateCallback<T>) => void;
  goToStep: (
    nextStep: number,
    args?: {
      onCompleteStep?: StepStateCallback<T>;
      updateSteps?: UpdateStepInput[];
      updateGeneralStates?: UpdateGeneralStateInput<T>;
    },
  ) => void;
  loading: boolean;
  stepState: StepsContextState<T>;
  updateGeneralState: (
    args: UpdateGeneralStateInput<T>,
  ) => StepsContextState<T>;
  updateConfig: (key: string, data: T) => void;
  updateStep: (updateSteps: UpdateStepInput) => StepsContextState<T>;
  setStepsInfo: (steps: StepConfiguration[]) => void;
}

export interface UseStepNavigationProps<T> {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  state: StepsContextState<T>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  updateStep: (updateSteps: UpdateStepInput) => StepsContextState<T>;
  updateGeneralInfo: (data: Partial<GeneralInfoProps>) => GeneralInfoProps;
  updateGeneralState: (
    input: UpdateGeneralStateInput<T>,
  ) => StepsContextState<T>;
  addError: (stepIndex: number, message: string) => void;
}

export interface UseStepsActionsProps<T> {
  dispatch: React.Dispatch<StepActionProps>;
  state: StepsContextState<T>;
  currentStep: number;
  setConfig: React.Dispatch<React.SetStateAction<ConfigProps>>;
}

export type StepStateCallback<T> = (
  state: StepsContextState<T>,
) => Promise<void> | void;
export type StepStateCallback2<T> = (formData: T) => Promise<void> | void;
export type UpdateStepInput = {
  stepIndex: number;
  data: Partial<
    Pick<
      StepStateProps,
      'canAccess' | 'canEdit' | 'isOptional' | 'touch' | 'isCompleted'
    >
  >;
};
export type UpdateGeneralStateInput<T> = {
  stepIndex?: number;
  data: Partial<T>;
};

export interface ConfigProps {
  steps: StepConfiguration[];
}

export interface StepProviderProps<T> {
  children: React.ReactNode;
  initialConfig?: ConfigProps;
}

type UpdateStepPayload = { stepIndex: number; data: Partial<StepStateProps> };
type UpdateGeneralStatePayload = {
  stepIndex: number;
  data: Partial<StepsContextState<any>['generalState']>;
};
type AddErrorPayload = { stepIndex: number; message: string };

export type StepActionProps =
  | { type: ActionTypes.SET_STEPS; payload: StepConfiguration[] }
  | { type: ActionTypes.UPDATE_STEP; payload: UpdateStepPayload }
  | {
      type: ActionTypes.UPDATE_GENERAL_STATE;
      payload: UpdateGeneralStatePayload;
    }
  | { type: ActionTypes.ADD_ERROR; payload: AddErrorPayload }
  | {
      type: ActionTypes.UPDATE_GENERAL_INFO;
      payload: Partial<GeneralInfoProps>;
    };
