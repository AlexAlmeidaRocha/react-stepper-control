# React Stepper Control

**React Stepper Control** is a React library that simplifies the creation of step flows, such as wizards or multi-step forms, with navigation control, validations, and customizable configuration.

The library provides a context to manage the state of each step, allowing you to customize navigation behavior, validations, errors, and state management.

---

## Installation

Install the library using npm:

```bash
npm i react-stepper-control
```

## Example Usage

Here’s an example of how to use React Stepper Control to create a multi-step form:

```JSX
import { StepConfiguration, useSteps, StepsWithProvider, VerticalStepper, HorizontalStepper } from "react-stepper-control";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Step component that dynamically renders each step in the process
export const Step = ({ steps, title }: { steps: StepConfiguration[]; title?: string }) => {
	const { activeStep, goToStep } = useSteps({ steps }); // Use the custom hook to manage steps, just pass the steps in main component

	return (
		<div>
			<h1>{title}</h1>
			<div>
				{steps.map((step, index) => (
					<div key={index}>
						<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
							<div onClick={() => goToStep(index)}>
								{activeStep.index > index ? '✔' : index + 1}
							</div>
							<div>{step.name}</div>
						</div>
						{activeStep.index === index && <div>{step.component}</div>}
					</div>
				))}
			</div>
		</div>
	);
};

// Step 1: Basic navigation between steps
export const Step1 = () => {
	const { onNext, onPrev } = useSteps();

	const handleNext = () => onNext({
		onCompleteStep: (data) => console.log('Step 1 completed with data:', data),
		updateSteps: [{ stepIndex: 1, data: { canEdit: true } }],
	});

	return (
		<div>
			<h1>Step 1</h1>
			<button onClick={() => onPrev()}>Previous</button>
			<button onClick={handleNext}>Next</button>
		</div>
	);
};

// Step 2: Form with validation using Zod and react-hook-form
const schema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Please enter a valid email address"),
	age: z.number().min(18, "You must be at least 18 years old"),
});

type FormData = z.infer<typeof schema>;

export const Step2 = () => {
	const { onNext, onPrev, stepState } = useSteps<FormData>(); // Use the custom hook with a generic type to manage form data
	const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	console.log(stepState.generalState?.name); // Access values from general state. This is useful for sharing data between steps. Remember to type the general state

	const handlePrev = () => onPrev();
	const handleNext = (data: FormData) => onNext({ formState: data }); // Save form data to the general state

	return (
		<div>
			<h1>Step 2: User Information</h1>
			<form onSubmit={handleSubmit(handleNext)}>
				<div>
					<label>Name:</label>
					<input {...register("name")} />
					{errors.name && <p>{errors.name.message}</p>}
				</div>
				<div>
					<label>Email:</label>
					<input {...register("email")} />
					{errors.email && <p>{errors.email.message}</p>}
				</div>
				<div>
					<label>Age:</label>
					<input type="number" {...register("age", { valueAsNumber: true })} />
					{errors.age && <p>{errors.age.message}</p>}
				</div>
				<button type="submit">Submit</button>
			</form>
			<button onClick={handlePrev}>Previous</button>
		</div>
	);
};

// Step 3: Example of updating the general state and navigating
type CustomGeneralState = {
	userId: string;
	preferences: { theme: string; notificationsEnabled: boolean };
};

export const Step3 = () => {
	const { onNext, onPrev, stepState } = useSteps<CustomGeneralState & FormData>();

	console.log(stepState.generalState?.name); // Access values the last step's form data

	const handlePrev = () => onPrev();
	const handleNext = () => {
		onNext();
		console.log('Proceeding to the next step');
	};

	return (
		<div>
			<h1>Step 3: User Preferences</h1>
			<button onClick={handlePrev}>Previous</button>
			<button onClick={handleNext}>Next</button>
		</div>
	);
};

// Main component that wraps steps in a HorizontalStepper for step navigation
const App = () => {
	return (
		<div>
			<HorizontalStepper
				title="User Registration Process"
				steps={[
					{ name: "Step 1: Introduction", component: <Step1 /> },
					{ name: "Step 2: User Information", component: <Step2 /> },
					{ name: "Step 3: Preferences", component: <Step3 /> },
				]}
			/>
		</div>
	);
};

// Wrap the page with StepsWithProvider to enable the context and manage steps. This is required for the custom hook to work
export default StepsWithProvider(App);

```