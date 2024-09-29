import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../model/user.js";
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

interface DecodedToken {
  userId: string;
  tokenCode: string;
}

interface CustomRequest extends Request {
  user?: any;
}

export const verifyTokenMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const headers: string | undefined = req.headers["authorization"];

  if (!headers || !(headers.includes("bearer") || headers.includes("Bearer"))) {
    return res.status(403).send("Invalid Token");
  }

  const bearer: string = headers.split(" ")[1];

  const verifiedToken = await verifyToken(bearer);
  if (!verifiedToken.success) {
    return res.status(401).send("Invalid Token");
  }

  req.user = verifiedToken.data;
  return next();
};

export const verifyToken = async (token: string): Promise<any> => {
  try {
    const decoded: string | JwtPayload = jwt.verify(
      token,
      process.env.TOKEN_KEY!
    );

    if (typeof decoded === "string") {
      return {
        success: false,
        message: "Invalid Token",
      };
    }

    const { userId, tokenCode } = decoded as DecodedToken;

    if (!userId || !tokenCode) {
      return {
        success: false,
        message: "Invalid Token",
      };
    }

    let user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      return {
        success: false,
        message: "Invalid Token",
      };
    }

    if (user.tokenCode !== tokenCode) {
      return {
        success: false,
        message: "Invalid Token",
      };
    }

    return {
      success: true,
      data: { ...user.toObject(), token: token },
    };
  } catch (err) {
    return {
      success: false,
      message: "Invalid Token",
    };
  }
};

export const generateToken = (
  userId: Types.ObjectId,
  tokenCode: string
): string => {
  return jwt.sign({ userId, tokenCode }, process.env.TOKEN_KEY!);
};
