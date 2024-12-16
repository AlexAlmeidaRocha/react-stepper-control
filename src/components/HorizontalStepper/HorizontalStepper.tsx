import { useSteps } from '../../useSteps';
import { HorizontalStepperProps } from './HorizontalStepper.interface';
import styles from './HorizontalStepper.module.css';

/**
 * Vertical step-by-step component.
 *
 * A flexible component for displaying a vertical step-by-step process with customizable styles, colors, and behavior.
 *
 * @param steps - List of steps, each containing a name, associated component, and metadata like `isCompleted` and `isOptional`.
 * @param title - Optional title for the step-by-step process.
 * @param config - Configuration object for setting initial step states and behavior.
 * @param configStepper - Configuration object for customizing stepper visuals, including styles, colors, and connectors.
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
 *   config={{ activeStepIndex: 0 }}
 *   configStepper={{
 *     step: {
 *       width: 50,
 *       height: 50,
 *     },
 *     colors: {
 *       active: '#0056b3',
 *       completed: '#28a745',
 *       disabled: '#ccc',
 *     },
 *     connector: {
 *       showConnector: false,
 *     },
 *   }}
 * />;
 * ```
 */

export const HorizontalStepper = ({
  steps,
  title,
  config,
  configStepper,
}: HorizontalStepperProps) => {
  const { activeStep, goToStep, stepsState } = useSteps({
    steps,
    ...config,
  });

  const defaultConfigStepper = {
    progressBar: {
      showProgressBarCompleted: true,
    },
    connector: {
      showConnector: true,
    },
  };

  const { colors, progressBar, connector } = {
    ...defaultConfigStepper,
    ...configStepper,
    progressBar: {
      ...defaultConfigStepper.progressBar,
      ...(configStepper?.progressBar || {}),
    },
    connector: {
      ...defaultConfigStepper.connector,
      ...(configStepper?.connector || {}),
    },
  };

  const customContainerStyles = {
    '--color-active': colors?.active || '#007bff',
    '--color-completed': colors?.completed || '#28a745',
    '--color-disabled': colors?.disabled || '#ccc',
    '--color-optional': colors?.optional || '#ffc107',
    ...configStepper?.stepContainer?.styles,
  } as React.CSSProperties;

  const customStylesConnector = {
    '--connector-height': connector?.height ? `${connector.height}px` : '2px',
    '--connector-width': connector?.width ? `${connector.width}px` : '50px',
    '--connector-color': connector?.color ? `${connector.color}px` : '#ccc',
    ...configStepper?.connector?.style,
  } as React.CSSProperties;

  const customStylesProgressBar = {
    '--progressBar-width': progressBar?.width
      ? `${progressBar.width}%`
      : '100%',
    '--progressBar-height': progressBar?.height
      ? `${progressBar.height}px`
      : '6px',
    '--progressBar-position': progressBar?.position || 'center',
    ...progressBar?.style,
  } as React.CSSProperties;

  const customStylesStep = {
    '--step-width': configStepper?.step?.width
      ? `${configStepper.step.width}px`
      : '',
    '--step-min-width': configStepper?.step?.minWidth
      ? `${configStepper.step.minWidth}px`
      : '',
    '--step-max-width': configStepper?.step?.maxWidth
      ? `${configStepper.step.maxWidth}px`
      : '',
    '--step-height': configStepper?.step?.height
      ? `${configStepper.step.height}px`
      : '',
    '--step-min-height': configStepper?.step?.minHeight
      ? `${configStepper.step.minHeight}px`
      : '',
    '--step-max-height': configStepper?.step?.maxHeight
      ? `${configStepper.step.maxHeight}px`
      : '',
    '--step-flex-direction': configStepper?.step?.flexDirection || 'column',
    '--step-justify-content': configStepper?.step?.justifyContent || 'center',
    '--step-align-items': configStepper?.step?.alignItems || 'center',
    ...configStepper?.step?.style,
  } as React.CSSProperties;

  return (
    <div
      className={styles.wrapper}
      role="navigation"
      aria-label={title}
      style={customContainerStyles}
    >
      {title && (
        <header className={styles.header}>
          <h1>{title}</h1>
        </header>
      )}
      {(progressBar?.showProgressBarActive ||
        progressBar?.showProgressBarCompleted) && (
        <div
          className={styles.progressBarContainer}
          style={customStylesProgressBar}
        >
          {progressBar?.showProgressBarCompleted && (
            <div className={styles.progressBar}>
              <div
                className={styles.progressCompleted}
                style={{
                  width: `${stepsState.generalInfo.completedProgress * 100}%`,
                }}
              />
            </div>
          )}
          {progressBar?.showProgressBarActive && (
            <div className={styles.progressBar}>
              <div
                className={styles.progress}
                style={{
                  width: `${stepsState.generalInfo.currentProgress * 100}%`,
                }}
              />
            </div>
          )}
        </div>
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
                {connector?.showConnector && index > 0 && (
                  <div
                    className={`${styles.connector} `}
                    style={customStylesConnector}
                  />
                )}
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
        <div className={styles.stepContent} style={customStylesStep}>
          {steps[activeStep.index]?.component}
        </div>
      </div>
    </div>
  );
};
