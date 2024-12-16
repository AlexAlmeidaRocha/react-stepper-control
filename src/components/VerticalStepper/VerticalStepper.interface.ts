import { StateConfigProps, StepConfiguration } from '../../types/StepTypes';

export interface VerticalStepperProps {
  steps: StepConfiguration[];
  title?: string;
  config?: StateConfigProps;
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
