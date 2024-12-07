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
}: {
  steps: StepConfiguration[];
  title?: string;
}) => {
  const { activeStep, goToStep } = useSteps({ steps });

  const handleStepClick = (index: number) => {
    if (index <= activeStep.index) {
      goToStep(index);
    }
  };

  return (
    <div className={styles.wrapper} role="navigation" aria-label={title}>
      {title && (
        <header className={styles.header}>
          <h1>{title}</h1>
        </header>
      )}
      <div className={styles.content}>
        <div className={styles.stepsContainer}>
          {steps.map((step, index) => {
            const isActive = activeStep.index === index;
            const isCompleted = activeStep.index > index;

            return (
              <div
                key={index}
                className={`${styles.stepItem} ${isActive ? styles.active : isCompleted ? styles.completed : styles.disabled}`}
              >
                <button
                  className={styles.stepButton}
                  onClick={() => handleStepClick(index)}
                  disabled={index > activeStep.index}
                  aria-current={isActive ? 'step' : undefined}
                  aria-disabled={index > activeStep.index}
                >
                  <span className={styles.stepIndicator}>
                    {isCompleted ? '✔' : index + 1}
                  </span>
                  <span className={styles.stepLabel}>{step.name}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className={styles.connector}></div>
                )}
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
