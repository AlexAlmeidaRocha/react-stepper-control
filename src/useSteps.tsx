import { useContext, useEffect } from 'react';
import { ConfigProps, StepContextProps } from './types/StepTypes';
import { StepsContext } from './StepsContext';

/**
 * Custom hook to access the steps context (StepsContext).
 *
 * @param config - Optional initial configuration object. Should only be passed in the component responsible for configuring the steps.
 * @returns The steps context, containing functions and states needed to manage the steps.
 * @throws An error if the hook is used outside of the StepsProvider.
 *
 * ### Examples:
 *
 * #### Without initial configuration:
 * Used in components that only consume the context, without managing the steps.
 * You can pass a generic type to type the step state.
 * ```tsx
 * const { onNext, activeStep, stepState } = useSteps<TGeneric>();
 *
 * const handleNext = () => {
 *   onNext();
 * };
 *
 * return (
 *   <div>
 *     <h1>Current Step: {activeStep?.name || 'None'}</h1>
 *     <button onClick={handleNext}>Next</button>
 *   </div>
 * );
 * ```
 *
 * #### With initial configuration:
 * Used in the component responsible for configuring and managing the steps.
 * ```tsx
 * const steps = [
 *   { name: 'Step 1', component: <div>Step 1</div> },
 *   { name: 'Step 2', component: <div>Step 2</div> },
 * ];
 * const { activeStep, goToStep } = useSteps({ steps });
 *
 * return (
 *   <div>
 *     {steps.map((step, index) => (
 *       <button key={index} onClick={() => goToStep(index)}>
 *         {step.name}
 *       </button>
 *     ))}
 *   </div>
 * );
 * ```
 */

export const useSteps = <T,>(config?: ConfigProps) => {
  const context: StepContextProps<T> | null = useContext(StepsContext);
  if (!context) {
    throw new Error('useStep must be used within a StepProvider');
  }

  const { updateConfig, setStepsInfo, ...stepContext } = context;

  useEffect(() => {
    let initialized = false;

    if (!initialized && config) {
      Object.entries(config).forEach(([key, value]) =>
        updateConfig(key, value),
      );
      if (config.steps) setStepsInfo(config.steps);
      initialized = true;
    }
  }, []);

  return stepContext;
};
