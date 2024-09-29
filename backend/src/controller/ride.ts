import * as yup from "yup";
import {
  acceptOfferBodyValidation,
  createRideBodyValidation,
  presentOfferBodyValidation,
  startRideBodyValidation,
} from "../validation/ride.js";
import view from "../view/ride.js";
import { Response } from "express";
import { CustomRequest } from "../library/types.js";

const recentRides = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { user } = req;
  try {
    const result = await view.recentRides({ user });
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

const availableRides = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { user } = req;
  try {
    const result = await view.availableRides({ user });
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

const createRide = async (req: CustomRequest, res: Response): Promise<void> => {
  const { body, user } = req;
  try {
    await createRideBodyValidation.validate(body);

    const result = await view.createRide({ body, user });
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

const presentOffer = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { body, user } = req;

  try {
    await presentOfferBodyValidation.validate(body);

    const result = await view.presentOffer({ body, user });
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

const acceptOffer = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { body } = req;
  try {
    await acceptOfferBodyValidation.validate(body);

    const result = await view.acceptOffer({ body });
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

const startRide = async (req: CustomRequest, res: Response): Promise<void> => {
  const { body } = req;
  try {
    await startRideBodyValidation.validate(body);
    const result = await view.startRide({ body });
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

const completed = async (req: CustomRequest, res: Response): Promise<void> => {
  const { body, user } = req;
  try {
    await startRideBodyValidation.validate(body);
    const result = await view.completed({ body });
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
  recentRides,
  availableRides,
  createRide,
  presentOffer,
  acceptOffer,
  startRide,
  completed,
};

export default controller;
