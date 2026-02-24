
import type { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      userinfo?: {
        id: string;
        role: string;
      };
      accessToken: string;
    }
  }
}

export interface JWTPayload {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  email: string;
  phone: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    email_verified: boolean;
  };
  role: string;
  aal: string;
  amr: Array<{ method: string; timestamp: number }>;
  session_id: string;
  is_anonymous: boolean;
}

