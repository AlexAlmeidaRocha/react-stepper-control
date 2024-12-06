import { StepsContextState, StepActionProps, StepConfiguration } from "./types/StepTypes";

export enum ActionTypes {
  SET_STEPS = 'SET_STEPS',
  UPDATE_STEP = 'UPDATE_STEP',
  UPDATE_GENERAL_STATE = 'UPDATE_GENERAL_STATE',
  ADD_ERROR = 'ADD_ERROR',
}

const StepsReducer = <T,>(state: StepsContextState<T>, action: StepActionProps): StepsContextState<T> => {
  switch (action.type) {
    case ActionTypes.SET_STEPS:
      return {
        ...state,
        generalInfo: { totalSteps: action.payload.length },
        steps: action.payload.map((step: StepConfiguration) => ({
          name: step.name,
          canAccess: step.canAccess || false,
          canEdit: step.canEdit || false,
          touch: step.touch || false,
          isOptional: step.isOptional || false
        })),
      };

    case ActionTypes.UPDATE_STEP: {
      const updatedSteps = [...state.steps];
      updatedSteps[action.payload.stepIndex] = {
        ...updatedSteps[action.payload.stepIndex],
        ...action.payload.data,
      };
      return { ...state, steps: updatedSteps };
    }

    case ActionTypes.UPDATE_GENERAL_STATE:
      return {
        ...state,
        generalState: {
          ...(state.generalState as T),
          ...action.payload.data,
        },
      };

    case ActionTypes.ADD_ERROR:
      return {
        ...state,
        errors: [
          ...(state.errors || []),
          {
            step: action.payload.stepIndex,
            message: action.payload.message,
          },
        ],
      };

    default:
      return state;
  }
};

export default StepsReducer;
