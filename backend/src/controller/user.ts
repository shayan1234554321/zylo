import * as yup from "yup";
import { Request, Response } from "express";
import view from "../view/user.js";
import {
  getDriversBodyValidation,
  getUserByIdParamsValidation,
  rateDriverBodyValidation,
  signInBodyValidation,
  signUpBodyValidation,
  updateDriverLocationBodyValidation,
  updateDriverStatusBodyValidation,
  updateProfilePicBodyValidation,
} from "../validation/user.js";
import { CustomRequest } from "../library/types.js";

const signIn = async (req: CustomRequest, res: Response): Promise<void> => {
  const { body } = req;
  try {
    await signInBodyValidation.validate(body);

    const result = await view.signIn({ body });
    res
      .status(result.status || 200)
      .set("Content-Type", result.contentType || "application/json")
      .send(result.data || null);
  } catch (validationError) {
    if (validationError instanceof yup.ValidationError) {
      res.status(400).json({ error: validationError.message });
    } else {
      res.status(500).send("Error getting user");
    }
  }
};

const signUp = async (req: Request, res: Response): Promise<void> => {
  const { body } = req;
  try {
    await signUpBodyValidation.validate(body);

    const result = await view.signUp({ body });
    res
      .status(result.status || 200)
      .set("Content-Type", result.contentType || "application/json")
      .send(result.data || null);
  } catch (validationError) {
    if (validationError instanceof yup.ValidationError) {
      console.log(validationError);
      res.status(400).json({ error: validationError.message });
    } else {
      res.status(500).send("Error getting user");
    }
  }
};

const updateProfilePic = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { body, user } = req;
  try {
    await updateProfilePicBodyValidation.validate(body);

    const result = await view.updateProfilePic({ body, user });
    res
      .status(result.status || 200)
      .set("Content-Type", result.contentType || "application/json")
      .send(result.data || null);
  } catch (validationError) {
    if (validationError instanceof yup.ValidationError) {
      res.status(400).json({ error: validationError.message });
    } else {
      res.status(500).send("Error getting user");
    }
  }
};

const logout = async (req: CustomRequest, res: Response): Promise<void> => {
  const { user } = req;
  try {
    const result = await view.logout({ user });
    res
      .status(result.status || 200)
      .set("Content-Type", result.contentType || "application/json")
      .send(result.data || null);
  } catch (validationError) {
    if (validationError instanceof yup.ValidationError) {
      res.status(400).json({ error: validationError.message });
    } else {
      res.status(500).send("Error getting user");
    }
  }
};

const getUserByToken = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { user } = req;
  let finalUser = user;

  delete finalUser.password;
  delete finalUser.tokenCode;

  try {
    res.status(200).send(finalUser);
  } catch (validationError) {
    res.status(500).send("Error getting user");
  }
};

const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { params } = req;
  try {
    await getUserByIdParamsValidation.validate(params);

    const result = await view.getUserById({ params });
    res
      .status(result.status || 200)
      .set("Content-Type", result.contentType || "application/json")
      .send(result.data || null);
  } catch (validationError) {
    if (validationError instanceof yup.ValidationError) {
      res.status(400).json({ error: validationError.message });
    } else {
      res.status(500).send("Error getting user");
    }
  }
};

const updateDriverLocation = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { body, user } = req;
  try {
    await updateDriverLocationBodyValidation.validate(body);

    const result = await view.updateDriverLocation({ body, user });
    res
      .status(result.status || 200)
      .set("Content-Type", result.contentType || "application/json")
      .send(result.data || null);
  } catch (validationError) {
    if (validationError instanceof yup.ValidationError) {
      res.status(400).json({ error: validationError.message });
    } else {
      res.status(500).send("Error getting user");
    }
  }
};

const rateDriver = async (req: CustomRequest, res: Response): Promise<void> => {
  const { body } = req;
  try {
    await rateDriverBodyValidation.validate(body);

    const result = await view.rateDriver({ body });
    res
      .status(result.status || 200)
      .set("Content-Type", result.contentType || "application/json")
      .send(result.data || null);
  } catch (validationError) {
    if (validationError instanceof yup.ValidationError) {
      res.status(400).json({ error: validationError.message });
    } else {
      res.status(500).send("Error getting user");
    }
  }
};

const updateDriverStatus = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { body, user } = req;
  try {
    await updateDriverStatusBodyValidation.validate(body);
    const result = await view.updateDriverStatus({ body, user });
    res
      .status(result.status || 200)
      .set("Content-Type", result.contentType || "application/json")
      .send(result.data || null);
  } catch (validationError) {
    if (validationError instanceof yup.ValidationError) {
      res.status(400).json({ error: validationError.message });
    } else {
      res.status(500).send("Error getting user");
    }
  }
};

const getDrivers = async (req: CustomRequest, res: Response): Promise<void> => {
  const { body, user } = req;
  try {
    await getDriversBodyValidation.validate(body);

    const result = await view.getDrivers({ body, user });
    res
      .status(result.status || 200)
      .set("Content-Type", result.contentType || "application/json")
      .send(result.data || null);
  } catch (validationError) {
    if (validationError instanceof yup.ValidationError) {
      res.status(400).json({ error: validationError.message });
    } else {
      res.status(500).send("Error getting user");
    }
  }
};

const controller = {
  signIn,
  signUp,
  updateProfilePic,
  logout,
  getUserByToken,
  getUserById,
  updateDriverLocation,
  rateDriver,
  updateDriverStatus,
  getDrivers,
};

export default controller;
