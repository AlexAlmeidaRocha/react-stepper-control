import {
  StepsContextState,
  StepActionProps,
  StepConfiguration,
} from './types/StepTypes';

export enum ActionTypes {
  SET_STEPS = 'SET_STEPS',
  UPDATE_STEP = 'UPDATE_STEP',
  UPDATE_GENERAL_STATE = 'UPDATE_GENERAL_STATE',
  ADD_ERROR = 'ADD_ERROR',
  UPDATE_GENERAL_INFO = 'UPDATE_GENERAL_INFO',
}

const StepsReducer = <T,>(
  state: StepsContextState<T>,
  action: StepActionProps,
): StepsContextState<T> => {
  switch (action.type) {
    case ActionTypes.SET_STEPS:
      return {
        ...state,
        generalInfo: { totalSteps: action.payload.length, progress: 0 },
        steps: action.payload.map((step: StepConfiguration) => ({
          name: step.name,
          canAccess: step.canAccess || false,
          canEdit: step.canEdit || false,
          touch: step.touch || false,
          isOptional: step.isOptional || false,
          isCompleted: step.isCompleted || false,
        })),
      };

    case ActionTypes.UPDATE_STEP: {
      const updatedSteps = [...state.steps];
      action.payload.forEach(({ stepIndex, data }) => {
        updatedSteps[stepIndex] = {
          ...updatedSteps[stepIndex],
          ...data,
        };
      });

      return { ...state, steps: updatedSteps };
    }

    case ActionTypes.UPDATE_GENERAL_STATE:
      return {
        ...state,
        generalState: {
          ...state.generalState,
          ...action.payload.data,
        },
      };

    // case ActionTypes.UPDATE_GENERAL_STATE:
    //   return {
    //     ...state,
    //     generalState: {
    //       ...state.generalState,
    //       [`step${action.payload.stepIndex + 1}`]: {
    //         ...(state.generalState[`step${action.payload.stepIndex + 1}`] || {}),
    //         ...action.payload.data,
    //       } as T,
    //     },
    //   };
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

    case ActionTypes.UPDATE_GENERAL_INFO:
      return {
        ...state,
        generalInfo: {
          ...state.generalInfo,
          ...action.payload,
        },
      };

    default:
      return state;
  }
};

export default StepsReducer;
