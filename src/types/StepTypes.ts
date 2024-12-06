export interface StepConfiguration {
  name: string;
  touch?: boolean;
  canAccess?: boolean;
  canEdit?: boolean;
  isOptional?: boolean;
  component: React.ReactNode;
}

export interface StepsInfo {
  totalSteps: number;
}

export interface StepStateProps {
  name: string;
  touch: boolean;
  canAccess: boolean;
  canEdit: boolean;
  isOptional: boolean;
}

export interface ActiveStepProps {
  index: number;
  name: string;
  touch: boolean;
  canAccess: boolean;
  canEdit: boolean;
  isOptional: boolean;
}

export interface StepsContextState<T> {
  generalInfo: StepsInfo;
  steps: StepStateProps[];
  generalState?: T;
  errors?: {
    step: number;
    message: string;
  }[]
}

export interface StepContextProps<T> {
  activeStep: ActiveStepProps;
  onNext: (args?: {
    onCompleteStep?: StepStateCallback<T>;
    formState?: T;
    updateSteps?: UpdateStepInput[];
    updateGeneralStates?: Partial<T>;
  }) => void;
  onPrev: (calback?: StepStateCallback<T>) => void;
  goToStep: (nextStep: number, args?: {
    onCompleteStep?: StepStateCallback<T>;
    formState?: T;
    updateSteps?: UpdateStepInput[];
    updateGeneralStates?: Partial<T>;
  }) => void;
  loading: boolean;
  stepState: StepsContextState<T>;
  setStepsInfo: (steps: StepConfiguration[]) => void;
  updateGeneralState: (data: Partial<T>) => StepsContextState<T>;
  updateConfig: (key: string, data: T) => void;
  updateStep: (updateSteps: UpdateStepInput) => StepsContextState<T>;
}

export type StepStateCallback<T> = (state: StepsContextState<T>) => Promise<void> | void;

export type StepStateCallback2<T> = (formData: T) => Promise<void> | void;

export type UpdateStepInput = { stepIndex: number; data: Partial<Pick<StepStateProps, 'canAccess' | 'canEdit' | "isOptional" | "touch">>; };

export interface ConfigProps {
  steps: StepConfiguration[];
}

export interface StepProviderProps<T> {
  children: React.ReactNode;
  initialConfig?: ConfigProps;
}

type UpdateStepPayload = { stepIndex: number; data: Partial<StepStateProps> };
type UpdateGeneralStatePayload = { data: Partial<StepsContextState<any>['generalState']> };
type AddErrorPayload = { stepIndex: number; message: string };

export type StepActionProps =
  | { type: 'SET_STEPS'; payload: StepConfiguration[] }
  | { type: 'UPDATE_STEP'; payload: UpdateStepPayload }
  | { type: 'UPDATE_GENERAL_STATE'; payload: UpdateGeneralStatePayload }
  | { type: 'ADD_ERROR'; payload: AddErrorPayload }
  | { type: 'UPDATE_CURRENT_STEP'; payload: number };