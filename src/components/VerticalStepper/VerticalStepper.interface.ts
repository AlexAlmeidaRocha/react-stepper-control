import { ValidationConfigStepper, StepConfig } from '../../types/StepTypes';

export interface VerticalStepperProps {
  steps: StepConfig[];
  title?: string;
  config?: ValidationConfigStepper;
  configStepper?: {
    stepContainer?: {
      styles?: React.CSSProperties;
    };
    step?: {
      width?: number;
      height?: number;
      style?: React.CSSProperties;
    };
    colors?: {
      active?: string;
      completed?: string;
      disabled?: string;
      optional?: string;
    };
  };
}
