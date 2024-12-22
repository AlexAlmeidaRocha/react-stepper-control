# React Stepper Control

## Introduction

This library provides a powerful hook called useStepper to facilitate managing step flows in React applications. This hook offers properties and functions to create, navigate, and manipulate step states in a flexible and scalable way.

---

## Installation

Install the library using npm:

```bash
npm i react-stepper-control
```

## Hook Returns

### `stepperState`

An object containing the complete state of the steps.

### `generalInfo`

Provides general information about the process, such as:

- `totalSteps`
- `currentProgress`
- `completedProgress`
- `canAccessProgress`

### `steps`

A list of configurations for all steps, including:

- `name`: Name of the step
- `canAccess`: Defines if the step can be accessed
- `canEdit`: Defines if the step can be edited
- `isOptional`: Indicates if the step is optional
- `isCompleted`: Indicates if the step is completed

By default, the boolean values (`canAccess`, `canEdit`, `isOptional`, `isCompleted`) are set to `false` if not specified.

#### Usage Example

```bash
<HorizontalStepper
 title="User Registration Process"
  steps={[
   { name: "Step1", component: <Step1 />, canAccess: true },
   { name: "Step2", component: <Step2 />, canAccess: false, canEdit: true },
   { name: "Step3", component: <Step3 />, isCompleted: true },
   { name: "Step4", component: <Step4 />, isOptional: true },
 ]}
/>
```

In this example, we use the HorizontalStepper component provided by the library. You can also create your own custom component, as shown below:

```bash
export const Step = ({ steps }: { steps: StepConfig[] }) => {
 const { stepperState } = useStepper({ steps });

 return (
  // Implement your component using stepperState
 );
};
```

### `generalState`

The generalState is a user-provided state that can be used to share information between steps. It can be typed using generics. Example:

```bash
interface Step1Type {
 step1: {
  test: string;
  test1: number;
 };
}

export const Step1 = () => {
 const { onNext, onPrev, activeStep, stepperState } = useStepper<Step1Type>();

 console.log(stepperState.generalState.step1)

 const handleNext = () =>
  onNext({
   updateStepsStatus: [{ stepIndex: 1, data: { canEdit: true } }],
    onCompleteStep: (data) => console.log("Step 1 completed with data:", data),
  });

 return (
  <div>
   <h1>Step 1</h1>
   <button onClick={() => onPrev()}>Previous</button>
   <button onClick={handleNext}>Next</button>
  </div>
 );
};
```

#### Recommended Typing

Use extends to reuse the state of previous steps:

```bash
interface Step1Type {
 step1: { /* Step 1 values */ };
}

interface Step2Type extends Step1Type {
 step2: { /* Step 2 values */ };
}

interface Step3Type extends Step2Type {
 step3: { /* Step 3 values */ };
}
```

Alternatively, you can create separate typings for each step if preferred.

### `activeStep`

Provides the settings of the currently active step:

- `name`
- `canAccess`
- `canEdit`
- `isOptional`
- `isCompleted`
- `index`
- `isLastStep`
- `isFirstStep`

### `loading`

Indicates if any asynchronous function (goToStep, onNext, onPrev) is being executed.

### Functions

### `updateGeneralState`

Updates the `generalState`

#### Example:

```bash
const updatedState = updateGeneralState({ data: { step1: { /* new values */ } } });
console.log(updatedState);
```

### `updateSteps`

Updates configurations for one or more `steps`.

#### Example:

```bash
const updatedSteps = updateSteps([{ stepIndex: 2, data: { canEdit: true } }]);
console.log(updatedSteps);
```

### `onNext`

Moves to the next step.

Defaults: Marks the current step as `canAccess` and `isCompleted`.

Allows updates to `generalState` and `steps` via `updateGeneralStates` and `updateStepsStatus`.

#### Example:

```bash
onNext({
 updateGeneralStates: { data: { step1: { /* new values */ } } },
 updateStepsStatus: [{ stepIndex: 2, data: { canEdit: true } }],
 onCompleteStep: async (data) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log("Steps data:", data);
 },
});
```

### `onPrev`

Moves back to the previous step. Works similarly to `onNext`.

#### Example:

```bash
onPrev({
 updateGeneralStates: { data: { step1: { /* new values */ } } },
 updateStepsStatus: [{ stepIndex: 2, data: { canEdit: true } }],
 onCompleteStep: async (data) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log("Steps data:", data);
 },
});
```

### `goToStep`

Navigates to a specific step by index. Works similarly to `onNext`, with the addition of the target step index.

#### Example:

```bash
goToStep(2, {
 updateGeneralStates: { data: { step1: { /* new values */ } } },
 updateStepsStatus: [{ stepIndex: 2, data: { canEdit: true } }],
 onCompleteStep: async (data) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log("Step 2 completed with data:", data);
 },
});
```

You can configure which properties to set as true or false for each function using the initial configuration when creating your component.

#### Example:

```bash
export const Step = ({ steps }: { steps: StepConfig[] }) => {
 const { stepperState } = useStepper({ steps, config: {
  validations: {
   goToStep: {
    canAccess: // true or false
   },
   next: {
    currentStep: {
     canAccess: // true or false
     canEdit: // true or false
     isOptional: // true or false
     isCompleted: // true or false
    },
    nextStep: {
     canAccess: // true or false
     canEdit: // true or false
     isOptional: // true or false
     isCompleted: // true or false
    }
   },
   prev: {
    currentStep: {
     canAccess: // true or false
     canEdit: // true or false
     isOptional: // true or false
     isCompleted: // true or false
    },
    prevStep: {
     canAccess: // true or false
     canEdit: // true or false
     isOptional: // true or false
     isCompleted: // true or false
    }
   },
   goToStep: {
    currentStep: {
     canAccess: // true or false
     canEdit: // true or false
     isOptional: // true or false
     isCompleted: // true or false
    },
    nextStep: {
     canAccess: // true or false
     canEdit: // true or false
     isOptional: // true or false
     isCompleted: // true or false
    }
   },
  }
 }
});

 return (
  // Implement your component using stepperState
 );
};
```

`validations.goToStep.canAccess`: Determines whether navigation to a specific step (`goToStep(index)`) is allowed based on the current step's state.

If `true`, it validates that the target step's `canAccess` property is `true` before allowing navigation.
By default, this validation is always performed.

`next.currentStep`: Sets the properties of the current step when moving to the next step.
`next.nextStep`: Sets the properties of the next step when advancing to it.

`prev.currentStep`: Sets the properties of the current step when going back to the previous step.
`prev.prevStep`: Sets the properties of the previous step when navigating back to it.

`goToStep.currentStep`: Sets the properties of the current step when using `goToStep(index)` to navigate to a specific step.

`goToStep.nextStep`: Sets the properties of the target step when navigating to it with `goToStep(index)`.

The following properties can be configured for each step:

- `canAccess`
  Controls whether the step can be accessed.

- `canEdit`
  Controls whether the step can be edited.

- `isOptional`
  Indicates if the step is optional.

- `isCompleted`
  Marks whether the step is completed.

#### Example:

By default, the entire process is saved in localStorage. However, if you prefer this not to happen, you can configure it using the `saveLocalStorage` property.

#### Example:

```bash
export const Step = ({ steps }: { steps: StepConfig[] }) => {
 const { stepperState } = useStepper({ steps, config: {
  config: {
   saveLocalStorage: false
  }
 }
});

 return (
  // Implement your component using stepperState
 );
};
```

Example using the `HorizontalStepper` or `VerticalStepper`:

```bash
<HorizontalStepper
 title="User Registration Process"
  config={{
  saveLocalStorage: false,
  }}
  steps={[
   { name: "Step1", component: <Step1 />, canAccess: true },
   { name: "Step2", component: <Step2 />, canAccess: false, canEdit: true },
   { name: "Step3", component: <Step3 />, isCompleted: true },
   { name: "Step4", component: <Step4 />, isOptional: true },
 ]}
/>
```

The localStorage is automatically cleared when onNext is called during the final step. However, if you want to clear it manually, you can use the `cleanLocalStorage` method provided by useStepper.

`cleanLocalStorage` only removes the step-related information.

```bash
export const Step1 = () => {
 const { onNext, onPrev, activeStep, cleanLocalStorage } = useStepper();

 const handleCleanLocalStorage = () => {
  cleanLocalStorage();
 }

 const handleNext = () =>
  onNext({
   updateStepsStatus: [{ stepIndex: 1, data: { canEdit: true } }],
    onCompleteStep: (data) => console.log("Step 1 completed with data:", data),
  });

 return (
  <div>
   <h1>Step 1</h1>
   <button onClick={() => onPrev()}>Previous</button>
   <button onClick={handleNext}>Next</button>
   <button onClick={handleCleanLocalStorage}>Clean localStorage</button>
  </div>
 );
};
```

## Important

`VerticalStepper` and `HorizontalStepper` are not yet completely usable, it is recommended to create your own component and use the hook to manage

## Components

### `HorizontalStepper`

```bash
<HorizontalStepper
 title="User Registration Process"
  config={{
   validations: {
    goToStep: {
     canAccess: false,
    },
   },
  }}
  configStepper={{
   stepContainer: {
    styles: {
     backgroundColor: "#f9f9f9",
    },
   },
   step: {
    width: 300,
    style: {
     backgroundColor: "#fff",
     padding: "20px",
     borderRadius: "5px",
     boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    },
   },
   colors: {
    active: "#007bff",
    completed: "#28a745",
    disabled: "#ccc",
   },
  }}
  steps={[
   { name: "Step1", component: <Step1 />, canAccess: true },
   { name: "Step2", component: <Step2 />, canAccess: false, canEdit: true },
   { name: "Step3", component: <Step3 />, isCompleted: true },
   { name: "Step4", component: <Step4 />, isOptional: true },
 ]}
/>
```

### Propriedades

#### `steps`

A list of objects representing each step in the stepper.

`name`: string - Name or label of the step.

`component`: React.ReactNode - Component or content associated with this step.

`isOptional`: boolean - Indicates if the step is optional.

`isCompleted`: boolean - Marks the step as completed.

`canAccess`: boolean - Defines if the user can access the step (even if it is not the active step).

#### `title`

`string` - Title displayed in the component's header (optional).

#### `config`

`object` - Allows configuration of which properties to set as `true` or `false` for each function using the initial configuration when creating the component, as previously explained.

#### `configStepper`

A set of visual and behavioral configurations for the stepper. This field is optional and subdivided into several categories:

#### `stepContainer`

`styles` - React.CSSProperties - Defines custom styles for the container.

#### `step`

Configurations related to individual steps.

`width`: number - Fixed width of the steps (in pixels).

`minWidth`: number - Minimum width (in pixels).

`maxWidth`: number - Maximum width (in pixels).

`height`: number - Fixed height (in pixels).

`minHeight`: number - Minimum height (in pixels).

`maxHeight`: number - Maximum height (in pixels).

`flexDirection`: 'row' | 'column' - Direction of the step content (horizontal or vertical).

`justifyContent`: 'flex-start' | 'center' | 'flex-end' - Horizontal alignment of the content.

`alignItems`: 'flex-start' | 'center' | 'flex-end' - Vertical alignment of the content.

`style`: React.CSSProperties - Custom style object for the steps.

#### `colors`

Defines the colors of the stepper.

`active`: string - Color for active steps.

`completed`: string - Color for completed steps.

`disabled`: string - Color for disabled steps.

`optional`: string - Color for optional steps.

#### `progressBar`

Configurations for the progress bar.

`showProgressBarActive`: boolean - Displays the bar for active steps.

`showProgressBarCompleted`: boolean - Displays the bar for completed steps.

`width`: number - Width of the progress bar (in percentage).

`height`: number - Height of the progress bar (in pixels).

`position`: 'left' | 'center' | 'right' - Position of the bar in the container.

`style`: React.CSSProperties - Object to style the progress bar.

#### `connector`

Configurations for the connectors between steps.

`showConnector`: boolean - Displays connectors between steps.

`height`: number - Height of the connector (in pixels).

`width`: number - Width of the connector (in pixels).

`color`: string - Color of the connector.

`style`: React.CSSProperties - Custom styles for the connectors.
