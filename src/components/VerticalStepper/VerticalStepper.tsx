import { useSteps } from '../../useSteps';
import { VerticalStepperProps } from './VerticalStepper.interface';
import styles from './VerticalStepper.module.css';

/**
 * Vertical step-by-step component.
 *
 * A flexible component for displaying a vertical step-by-step process with customizable styles, colors, and behavior.
 *
 * @param steps - List of steps, each containing a name, associated component, and metadata like `isCompleted` and `isOptional`.
 * @param title - Optional title for the step-by-step process.
 * @param config - Configuration object for setting initial step states and behavior.
 * @param configStepper - Configuration object for customizing stepper visuals, including styles and colors.
 *
 * @example
 * ```tsx
 * const steps = [
 *   { name: 'Step 1', component: <div>Step 1 Content</div>, isCompleted: true },
 *   { name: 'Step 2', component: <div>Step 2 Content</div>, isOptional: true },
 *   { name: 'Step 3', component: <div>Step 3 Content</div> },
 * ];
 *
 * <VerticalStepper
 *   steps={steps}
 *   title="My Step-by-Step"
 *   config={{
 *    validations: {
 *     goToStep: {
 *      canAccess: false,
 *     },
 *    },
 *   }}
 *   configStepper={{
 *     step: {
 *       width: 500,
 *       height: 500,
 *     },
 *     colors: {
 *       active: '#0056b3',
 *       completed: '#28a745',
 *       disabled: '#ccc',
 *     }
 *   }}
 * />;
 * ```
 */

export const VerticalStepper = ({
  steps,
  title,
  config,
  configStepper,
}: VerticalStepperProps) => {
  const { activeStep, goToStep, stepsState } = useSteps({
    steps,
    ...config,
  });

  const { colors } = configStepper || {};

  const customStyles = {
    '--color-active': colors?.active || '#007bff',
    '--color-completed': colors?.completed || '#28a745',
    '--color-disabled': colors?.disabled || '#ccc',
    '--color-optional': colors?.optional || '#ffc107',
    ...configStepper?.stepContainer?.styles,
  } as React.CSSProperties;

  return (
    <div
      className={styles.wrapper}
      role="navigation"
      aria-label={title}
      style={customStyles}
    >
      {title && <h2 className={styles.title}>{title}</h2>}

      <div className={styles.stepsContainer}>
        {stepsState.steps?.map((step, index) => {
          const isActive = activeStep.index === index;

          const stepClass = `
            ${styles.stepIndicator}
            ${step.isCompleted ? styles.completed : ''}
            ${isActive && step.isOptional ? styles.optional : ''}
            ${step.canAccess ? styles.canAccess : ''}
            ${isActive ? styles.active : ''}
          `;

          return (
            <div key={index} className={styles.stepItem}>
              <button
                className={styles.stepButton}
                onClick={() => goToStep(index)}
                disabled={!step.isCompleted && !step.canAccess}
                aria-current={isActive ? 'step' : undefined}
                aria-disabled={!step.isCompleted}
              >
                <span className={stepClass}>
                  {isActive ? index + 1 : step.isCompleted ? '✔' : index + 1}
                </span>
                <span
                  className={`${styles.stepLabel} ${
                    isActive ? styles.active : ''
                  }`}
                >
                  {step.name}
                </span>
              </button>
              {activeStep.index === index && (
                <div
                  className={styles.stepContent}
                  style={{ ...configStepper?.step?.style }}
                >
                  {steps[activeStep.index]?.component}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
