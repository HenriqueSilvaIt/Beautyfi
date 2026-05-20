import {tv, type VariantProps } from "tailwind-variants";

export const appInputVariant = tv({

    slots: {
        container: "w-full my-4",
        wrapper: "flex-row items-center border-b border-gray-200 pb-2",
        input: "bg-transparent text-font-primary text-base flex-1",
        label: "text-xs text-font-primary mb-3 font-semibold",
        error: "text-sm text-danger mt-2"
    },
    variants: {
        isFocused: {
            true: {
                wrapper: "border-app-theme-primary",
                label: "text-app-theme-primary"
            }
        },
        isError: {
            true: {
                wrapper: "opacity-50",
                input: "text-font-primary"
            }
        },
        isDisabled: {
            true: {
                wrapper: "opaciy:50",
                input: "text-font-primary"
            }
        }
    },

    defaultVariants: {
        isDisabled: false,
        isError: false,
        isFocused: false
    }
})

export type AppInputVariantProps = VariantProps<typeof appInputVariant>