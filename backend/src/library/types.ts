import { Request } from "express";

export interface CustomRequest extends Request {
  user?: any;
}

export interface CustomReturn {
  status: number;
  data: any;
  contentType?: string;
}
