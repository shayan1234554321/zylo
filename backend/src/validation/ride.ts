import yup from "yup";
import { checkUnknownValues } from "./helper.js";

export const createRideBodyValidation = yup
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
    destination: yup
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
      .required("Destination is required"),
    locationName: yup.string().required("Location Name is required"),
    destinationName: yup.string().required("Location Name is required"),
  })
  .test(
    "custom-validation",
    "Custom validation failed",
    checkUnknownValues([
      "location",
      "destination",
      "locationName",
      "destinationName",
    ])
  );

export const presentOfferBodyValidation = yup
  .object()
  .shape({
    offer: yup
      .object()
      .shape({
        driver: yup
          .string()
          .trim()
          .matches(/^[0-9a-fA-F]{24}$/, "Invalid Id")
          .required("Id is required"),
        price: yup.number().positive().required("Price is required"),
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
        checkUnknownValues(["driver", "price", "location"])
      ),
    rideId: yup
      .string()
      .trim()
      .matches(/^[0-9a-fA-F]{24}$/, "Invalid Id")
      .required("Id is required"),
  })
  .test(
    "custom-validation",
    "Custom validation failed",
    checkUnknownValues(["offer", "rideId"])
  );

export const acceptOfferBodyValidation = yup
  .object()
  .shape({
    driver: yup
      .string()
      .trim()
      .matches(/^[0-9a-fA-F]{24}$/, "Invalid Id")
      .required("Id is required"),
    price: yup.number().positive().required("Price is required"),
    rideId: yup
      .string()
      .trim()
      .matches(/^[0-9a-fA-F]{24}$/, "Invalid Id")
      .required("Id is required"),
  })
  .test(
    "custom-validation",
    "Custom validation failed",
    checkUnknownValues(["driver", "price", "rideId"])
  );

export const startRideBodyValidation = yup
  .object()
  .shape({
    rideId: yup
      .string()
      .trim()
      .matches(/^[0-9a-fA-F]{24}$/, "Invalid Id")
      .required("Id is required"),
  })
  .test(
    "custom-validation",
    "Custom validation failed",
    checkUnknownValues(["rideId"])
  );
