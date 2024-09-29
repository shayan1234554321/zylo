import * as yup from "yup";

export const checkUnknownValues =
  <T extends object>(
    allowedKeys: (keyof T)[],
    optionalKeys: (keyof T)[] = []
  ) =>
  (value: T): true => {
    const unknownKeys = value
      ? Object.keys(value).filter(
          (key) =>
            !allowedKeys.includes(key as keyof T) &&
            !optionalKeys.includes(key as keyof T)
        )
      : [];

    if (unknownKeys.length > 0) {
      throw new yup.ValidationError(
        `Unknown properties: ${unknownKeys.join(", ")}`,
        value,
        "custom-validation"
      );
    }

    return true;
  };
