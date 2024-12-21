import { ValidationConfigStepper, StepConfig } from '../../types/StepTypes';

export interface HorizontalStepperProps {
  steps: StepConfig[];
  title?: string;
  config?: ValidationConfigStepper;
  configStepper?: {
    stepContainer?: {
      styles?: React.CSSProperties;
    };
    step?: {
      width?: number;
      minWidth?: number;
      maxWidth?: number;
      height?: number;
      minHeight?: number;
      maxHeight?: number;
      flexDirection?: 'row' | 'column';
      justifyContent?: 'flex-start' | 'center' | 'flex-end';
      alignItems?: 'flex-start' | 'center' | 'flex-end';
      style?: React.CSSProperties;
    };
    colors?: {
      active?: string;
      completed?: string;
      disabled?: string;
      optional?: string;
    };
    progressBar?: {
      showProgressBarActive?: boolean;
      showProgressBarCompleted?: boolean;
      width?: number;
      height?: number;
      position?: 'left' | 'center' | 'right';
      style?: React.CSSProperties;
    };
    connector?: {
      showConnector?: boolean;
      height?: number;
      width?: number;
      color?: string;
      style?: React.CSSProperties;
    };
  };
}
