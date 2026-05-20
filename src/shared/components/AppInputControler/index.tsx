import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { AppInput, AppInputProps } from "../AppInput";

interface AppInputControllerProps<T extends FieldValues> extends Omit<
  AppInputProps,
  "value" | "onChangeText" | "error"
> {
  control: Control<T>;
  name: Path<T>;
  errors?: FieldErrors<T>;
  transform?: (value: string) => string;
  formCrud?: boolean;
}

export function AppInputController<T extends FieldValues>({
  name,
  control,
  errors,
  formCrud,
  transform,
  ...rest
}: AppInputControllerProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onBlur, onChange, value },
        fieldState: { error },
        formState: { isSubmitting },
      }) => (
        <AppInput
          formCrud={formCrud}
          value={value != null ? String(value) : ""}
          onBlur={onBlur}
          error={error?.message}
          isDisabled={isSubmitting || rest.isDisabled}
          onChangeText={(text) => {
            const finalValue = transform ? transform(text) : text;
            onChange(finalValue); // ✅ RHF recebe STRING
          }}
          {...rest}
        />
      )}
    ></Controller>
  );
}
