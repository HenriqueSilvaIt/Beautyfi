import {tv, VariantProps} from "tailwind-variants";


export enum AppButtonVariantsEnum {
    FILLED = "field",
    OUTLINE = "outline",
    ADMIN = "admin"
}

export const buttonVariants = tv({

    slots: {
        base: "w-full h-[48] rounded-[10px] border px-4 flex-row items-center",
        text: "font-semibold text-base",
        description: "",
        icon: ""
    },
    variants: {
        hasIcon: {
            true: {
                base: "justify-between"
            },
            false: {
                base: "justify-center"
            }
        },
        isLoading: {
            true: {
                base: "opacity-60"
            }

        },
        isDisabled: {
            true: {
                base: "opacity-50"
            }
        },
        size: {
            true: {
                base: "h-[80px] justify-between ",
                description: "text-sm text-gray-600"
            }
        },
        variant: {
            field: {
                base: "bg-app-theme-primary border-app-theme-primary",
                text: "text-font-secundary"
            },
            outlined: {
                base: "bg-transparent border-app-theme-primary",
                text: "text-app-theme-primary"
            },
            admin: {
                base: "bg-background-quartenary px-5",
                text: "text-font-primary"
            }
        }
    },
    defaultVariants: {
        hasIcon: false,
        isLoading: false,
        isDisabled: false,
        size:false,
        variant: AppButtonVariantsEnum.FILLED
    }



})

export type ButtonVariants = VariantProps<typeof buttonVariants>