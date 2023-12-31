export interface validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}
export function validate(validateInput: validatable): boolean {
  let isValid = true;
  if (validateInput.required) {
    isValid = isValid && validateInput.value.toString().trim().length !== 0;
  }
  if (!!validateInput.minLength && typeof validateInput.value === "string") {
    isValid =
      isValid && validateInput.value.trim().length >= validateInput.minLength;
  }
  if (!!validateInput.maxLength && typeof validateInput.value === "string") {
    isValid =
      isValid && validateInput.value.trim().length <= validateInput.maxLength;
  }
  if (!!validateInput.min && typeof validateInput.value === "number") {
    isValid = isValid && validateInput.value >= validateInput.min;
  }
  if (!!validateInput.max && typeof validateInput.value === "number") {
    isValid = isValid && validateInput.value <= validateInput.max;
  }
  return isValid;
}
