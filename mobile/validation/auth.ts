import * as yup from "yup";

export const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email("Must be type email")
    .max(50)
    .required("Email is required"),
  password: yup.string().min(5).max(50).required("Password is required"),
});

export const SignupSchema = yup.object().shape({
  name: yup.string().required().min(2).max(100),
  email: yup.string().required().min(3).email().max(100),
  password: yup.string().required().min(1).max(100),
  type: yup.string().required().oneOf(["driver", "rider"]),
  carType: yup.object().when("type", {
    is: (type: string) => type === "driver",
    then: () => yup.string().required().oneOf(["sedan", "van", "suv", "truck"]),
    otherwise: () => yup.object().nullable(),
  }),
});
