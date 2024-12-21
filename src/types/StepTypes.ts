export interface GeneralInfoProps {
  totalSteps: number;
  currentProgress: number;
  completedProgress: number;
  canAccessProgress: number;
}

export interface StepStateProps {
  name: string;
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
    updateStepsStatus?: UpdateStepInput[];
    updateGeneralStates?: UpdateGeneralStateInput<T>;
  }) => void;
  onPrev: (args?: {
    onCompleteStep?: StepStateCallback<T>;
    updateStepsStatus?: UpdateStepInput[];
    updateGeneralStates?: UpdateGeneralStateInput<T>;
  }) => void;
  goToStep: (
    nextStep: number,
    args?: {
      onCompleteStep?: StepStateCallback<T>;
      updateStepsStatus?: UpdateStepInput[];
      updateGeneralStates?: UpdateGeneralStateInput<T>;
    },
  ) => void;
  loading: boolean;
  stepsState: StepsContextState<T>;
  updateGeneralState: (
    args: UpdateGeneralStateInput<T>,
  ) => StepsContextState<T>;
  updateConfig: (config: StateConfigProps) => void;
  updateSteps: (updateSteps: UpdateStepInput[]) => StepsContextState<T>;
  setStepsInfo: (steps: StepConfiguration[]) => void;
  updateStateWithLocalStorage: (state: StepsContextState<T>) => void;
  cleanLocalStorage: () => void;
}

export interface UseStepNavigationProps<T> {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  stepsState: StepsContextState<T>;
  updateStepsState: React.Dispatch<React.SetStateAction<StepsContextState<T>>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  addError: (stepIndex: number, message: string) => void;
  config: ConfigProps;
}

export interface UseStepsActionsProps<T> {
  updateStepsState: React.Dispatch<React.SetStateAction<StepsContextState<T>>>;
  stepsState: StepsContextState<T>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setConfig: React.Dispatch<React.SetStateAction<ConfigProps>>;
  config: ConfigProps;
}

export type StepStateCallback<T> = (
  state: StepsContextState<T>,
) => Promise<void> | void;
export type StepStateCallback2<T> = (formData: T) => Promise<void> | void;
export type UpdateStepInput = {
  stepIndex: number;
  data: Partial<
    Pick<StepStateProps, 'canAccess' | 'canEdit' | 'isOptional' | 'isCompleted'>
  >;
};
export type UpdateGeneralStateInput<T> = {
  stepIndex?: number;
  data: Partial<T>;
};

export interface ConfigProps extends StateConfigProps {
  steps: StepConfiguration[];
}

export interface StateConfigProps {
  validations?: {
    goToStep?: {
      canAccess?: boolean;
    };
  };
  next?: {
    currentStep?: Partial<Omit<StepStateProps, 'name'>>;
    nextStep?: Partial<Omit<StepStateProps, 'name'>>;
  };
  prev?: {
    currentStep?: Partial<Omit<StepStateProps, 'name'>>;
    prevStep?: Partial<Omit<StepStateProps, 'name'>>;
  };
  goToStep?: {
    currentStep?: Partial<Omit<StepStateProps, 'name'>>;
    nextStep?: Partial<Omit<StepStateProps, 'name'>>;
  };
  saveLocalStorage?: boolean;
}

export interface StepProviderProps<T> {
  children: React.ReactNode;
  initialConfig?: ConfigProps;
}
