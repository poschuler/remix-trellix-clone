import * as React from "react"
import {
    Input as AriaInput,
    InputProps as AriaInputProps,
    TextArea as AriaTextArea,
    TextAreaProps as AriaTextAreaProps,
    TextField as AriaTextField,
    TextFieldProps as AriaTextFieldProps,
    ValidationResult as AriaValidationResult,
    Text,
    composeRenderProps,
} from "react-aria-components"

import { cn } from "~/lib/utils"

import { FieldError, Label } from "./field"

const TextField = AriaTextField

// const Input = ({ className, ...props }: AriaInputProps) => {
//     return (
//         <AriaInput
//             className={composeRenderProps(className, (className) =>
//                 cn(
//                     "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground",
//                     /* Disabled */
//                     "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
//                     /* Focused */
//                     "data-[focused]:outline-none data-[focused]:ring-2 data-[focused]:ring-ring data-[focused]:ring-offset-2",
//                     /* Resets */
//                     "focus-visible:outline-none",
//                     className
//                 )
//             )}
//             {...props}
//         />
//     )
// }
const Input = React.forwardRef<HTMLInputElement, AriaInputProps>(({ className, ...props }, ref) => {
    return (
        <AriaInput
            className={composeRenderProps(className, (className) =>
                cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground",
                    /* Disabled */
                    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
                    /* Focused */
                    "data-[focused]:outline-none data-[focused]:ring-2 data-[focused]:ring-ring data-[focused]:ring-offset-2",
                    /* Resets */
                    "focus-visible:outline-none",
                    className
                )
            )}
            ref={ref}
            {...props}
        />
    )
});

Input.displayName = "Input"

// const TextArea = ({ className, ...props }: AriaTextAreaProps) => {
//     return (
//         <AriaTextArea
//             className={composeRenderProps(className, (className) =>
//                 cn(
//                     "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground",
//                     /* Focused */
//                     "data-[focused]:outline-none data-[focused]:ring-2 data-[focused]:ring-ring data-[focused]:ring-offset-2",
//                     /* Disabled */
//                     "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
//                     /* Resets */
//                     "focus-visible:outline-none",
//                     className
//                 )
//             )}
//             {...props}
//         />
//     )
// }

const TextArea = React.forwardRef<HTMLTextAreaElement, AriaTextAreaProps>(({ className, ...props }, ref) => {
    return (
        <AriaTextArea
            className={composeRenderProps(className, (className) =>
                cn(
                    "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground",
                    /* Focused */
                    "data-[focused]:outline-none data-[focused]:ring-2 data-[focused]:ring-ring data-[focused]:ring-offset-2",
                    /* Disabled */
                    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
                    /* Resets */
                    "focus-visible:outline-none",
                    className
                )
            )}
            ref={ref}
            {...props}
        />
    )
});

TextArea.displayName = "TextArea"

interface CustomTextFieldProps extends AriaTextFieldProps {
    label?: string
    description?: string
    errorMessage?: string | ((validation: AriaValidationResult) => string) | string[]
    textArea?: boolean
}

// function CustomTextField({
//     label,
//     description,
//     errorMessage,
//     textArea,
//     className,
//     ...props
// }: CustomTextFieldProps) {
//     return (
//         <TextField
//             className={composeRenderProps(className, (className) =>
//                 cn("group flex flex-col gap-2", className)
//             )}
//             {...props}
//         >
//             <Label>{label}</Label>
//             {textArea ? <TextArea /> : <Input />}
//             {description && (
//                 <Text className="text-sm text-muted-foreground" slot="description">
//                     {description}
//                 </Text>
//             )}
//             {Array.isArray(errorMessage) ? (
//                 errorMessage.map((message, index) => (
//                     <FieldError key={index}>{message}</FieldError>
//                 ))
//             ) : (
//                 <FieldError>{errorMessage}</FieldError>)
//             }
//         </TextField>
//     )
// }

const CustomTextField = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, CustomTextFieldProps>(
    ({ label, description, errorMessage, textArea, className, ...props }, ref) => {
        return (
            <TextField
                className={composeRenderProps(className, (className) =>
                    cn("group flex flex-col gap-2", className)
                )}
                {...props}
            >
                <Label>{label}</Label>
                {textArea ? <TextArea ref={ref as React.Ref<HTMLTextAreaElement>} /> : <Input ref={ref as React.Ref<HTMLInputElement>} />}
                {description && (
                    <Text className="text-sm text-muted-foreground" slot="description" ref={ref}>
                        {description}
                    </Text>
                )}
                {Array.isArray(errorMessage) ? (
                    errorMessage.map((message, index) => (
                        <FieldError key={index}>{message}</FieldError>
                    ))
                ) : (
                    <FieldError>{errorMessage}</FieldError>
                )}
            </TextField>
        );
    }
);

CustomTextField.displayName = "CustomTextField"

export { Input, TextField, CustomTextField, TextArea }
export type { CustomTextFieldProps }
