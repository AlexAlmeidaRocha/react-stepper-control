# React Stepper Control

## Introduction

This library provides a powerful hook called useSteps to facilitate managing step flows in React applications. This hook offers properties and functions to create, navigate, and manipulate step states in a flexible and scalable way.

---

## Installation

Install the library using npm:

```bash
npm i react-stepper-control
```

## Hook Returns

### `stepsState`
An object containing the complete state of the steps.

### `generalInfo`
Provides general information about the process, such as:
- `Total steps`
- `Current progress`

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
export const Step = ({ steps, title }: { steps: StepConfiguration[] }) => {
 const { stepsState } = useSteps({ steps });

 return (
  // Implement your component using stepsState
 );
};
```

### `General State`
The generalState is a user-provided state that can be used to share information between steps. It can be typed using generics. Example:

```bash
interface Step1Type {
 step1: {
  test: string;
  test1: number;
 };
}

export const Step1 = () => {
 const { onNext, onPrev, activeStep } = useSteps<Step1Type>();

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

### `errors`
- A place where step errors are stored.
- Users can also manually add errors.

*This feature is under development.*

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
  console.log("Step 2 completed with data:", data);
 },
});
```

### `onPrev`
Moves back to the previous step. Works similarly to `onNext`.

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

## Important
`VerticalStepper` and `HorizontalStepper` are not yet completely usable, it is recommended to create your own component and use the hook to manage