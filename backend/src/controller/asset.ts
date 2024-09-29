import { Request, Response } from "express";
import * as yup from "yup";

interface CustomRequest extends Request {
  file?: any;
}

const uploadAsset = async (req: CustomRequest, res: Response): Promise<void> => {
  const { file } = req;

  if (!file) {
    res.status(400).send("File not found");
    return
  }

  try {
    res.status(200).send({ url: "/assets/" + file.filename });
  } catch (validationError) {
    if (validationError instanceof yup.ValidationError) {
      res.status(400).json({ error: validationError.message });
    } else {
      res.status(500).send("Error getting user");
    }
  }
};

const controller = {
  uploadAsset,
};

export default controller;
