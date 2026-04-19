import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any; // Pwede mong palitan ng actual User model type later
    }
  }
}

export {}; // Importante ito para ma-recognize as a module
