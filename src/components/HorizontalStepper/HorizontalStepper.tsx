import { StepConfiguration } from '../../types/StepTypes';
import { useSteps } from '../../useSteps';
import styles from './HorizontalStepper.module.css';

/**
 * Horizontal step-by-step component.
 *
 * @param steps - List of steps containing the name and associated component.
 * @param title - Optional title for the step-by-step process.
 *
 * @example
 * ```tsx
 * const steps = [
 *   { name: 'Step 1', component: <div>Step 1 Content</div> },
 *   { name: 'Step 2', component: <div>Step 2 Content</div> },
 *   { name: 'Step 3', component: <div>Step 3 Content</div> },
 * ];
 *
 * <HorizontalStepper steps={steps} title="My Horizontal Step-by-Step" />;
 * ```
 */

export const HorizontalStepper = ({
  steps,
  title,
  config,
}: {
  steps: StepConfiguration[];
  title?: string;
  config?: {
    validations?: {
      canAcess?: boolean;
      isCompleted?: boolean;
    };
  };
}) => {
  const { activeStep, goToStep, stepsState } = useSteps({ steps, ...config });

  return (
    <div className={styles.wrapper} role="navigation" aria-label={title}>
      {title && (
        <header className={styles.header}>
          <h1>{title}</h1>
        </header>
      )}
      <div className={styles.content}>
        <div className={styles.stepsContainer}>
          {stepsState.steps?.map((step, index) => {
            const isActive = activeStep.index === index;

            const stepClass = `
              ${styles.stepIndicator} 
              ${step.isCompleted ? styles.completed : ''}
              ${isActive && step.isOptional ? styles.optional : ''}
              ${step.canAccess ? styles.canAccess : ''}
              ${isActive ? styles.active : ''}
              ${
                step.canAccess && !isActive && !step.isCompleted
                  ? styles.touch
                  : ''
              }
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
              </div>
            );
          })}
        </div>
        <div className={styles.stepContent}>
          {steps[activeStep.index]?.component}
        </div>
      </div>
    </div>
  );
};
