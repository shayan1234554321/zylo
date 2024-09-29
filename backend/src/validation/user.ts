import yup from "yup";
import { checkUnknownValues } from "./helper.js";

export const signInBodyValidation = yup
  .object()
  .shape({
    email: yup.string().required().min(3).email().max(100),
    password: yup.string().required().min(1).max(100),
  })
  .test(
    "custom-validation",
    "Custom validation failed",
    checkUnknownValues(["email", "password"])
  );

export const signUpBodyValidation = yup
  .object()
  .shape({
    name: yup.string().required().min(2).max(100),
    email: yup.string().required().min(3).email().max(100),
    password: yup.string().required().min(1).max(100),
    type: yup.string().required().oneOf(["driver", "rider"]),
    carType: yup.object().when("type", {
      is: (type: string) => type === "driver",
      then: () =>
        yup
          .string()
          .required()
          .oneOf(["sedan", "van", "suv", "truck"]),
      otherwise: () => yup.object().nullable(),
    }),
  })
  .test(
    "custom-validation",
    "Custom validation failed",
    checkUnknownValues(["name", "email", "password", "type"], ["carType"])
  );

export const updateProfilePicBodyValidation = yup
  .object()
  .shape({
    profilePic: yup.string().required().min(3).max(100),
  })
  .test(
    "custom-validation",
    "Custom validation failed",
    checkUnknownValues(["profilePic"])
  );

export const getUserByIdParamsValidation = yup
  .object()
  .shape({
    id: yup
      .string()
      .trim()
      .matches(/^[0-9a-fA-F]{24}$/, "Invalid Id")
      .required("Id is required"),
  })
  .test(
    "custom-validation",
    "Custom validation failed",
    checkUnknownValues(["id"])
  );

export const updateDriverLocationBodyValidation = yup
  .object()
  .shape({
    location: yup
      .object()
      .shape({
        type: yup.string().required().oneOf(["Point"]),
        coordinates: yup.array().of(yup.number()).min(2).max(2).required(),
      })
      .test(
        "custom-validation",
        "Custom validation failed",
        checkUnknownValues(["type", "coordinates"])
      )
      .required("Location is required"),
  })
  .test(
    "custom-validation",
    "Custom validation failed",
    checkUnknownValues(["location"])
  );

export const rateDriverBodyValidation = yup
  .object()
  .shape({
    rating: yup.number().required().min(0).max(5),
    driverId: yup
      .string()
      .trim()
      .matches(/^[0-9a-fA-F]{24}$/, "Invalid Id")
      .required("Id is required"),
  })
  .test(
    "custom-validation",
    "Custom validation failed",
    checkUnknownValues(["rating", "driverId"])
  );

export const updateDriverStatusBodyValidation = yup
  .object()
  .shape({
    status: yup.string().required().oneOf(["available", "unavailable"]),
  })
  .test(
    "custom-validation",
    "Custom validation failed",
    checkUnknownValues(["status"])
  );

  export const getDriversBodyValidation = yup
  .object()
  .shape({
    latitude: yup.number().required(),
    longitude: yup.number().required(),
  })
  .test(
    "custom-validation",
    "Custom validation failed",
    checkUnknownValues(["latitude","longitude"])
  );
