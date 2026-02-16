
import type { Request, Response } from "express";
import { supabase } from "../util.js";
import { COOKIE_SAME_SITE } from "../config.js";

export default class AuthController {
    static authenticate = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.body;
            const { error } = await supabase.auth.signInWithOtp({
                email: email,
            });
            if (error) {
                const message = {
                    error: error.message,
                    details: error.cause ?? "",
                };
                res.status(401).json(message);
                return;
            }
            const data = { message: "sign in link sent" };
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    };

    static magicCallback = async (req: Request, res: Response): Promise<void> => {
        try {
            const { otp: token, email } = req.body;

            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: "email" as const,
            });

            if (error || !data?.session) {
                const message = { error: error?.message || "Invalid token" };
                res.status(401).json(message);
                return;
            }

            const cookieOptions = {
                httpOnly: true,
                secure: true,
                sameSite: COOKIE_SAME_SITE,
                path: "/auth/refresh",
                maxAge: 4 * 7 * 24 * 60 * 60 * 1000, // ~1 month
            };

            res.cookie("sb-refresh-token", data.session.refresh_token, cookieOptions);

            res.json({ accessToken: data.session.access_token });
        } catch (error) {
            console.error("Authentication error:", error);
            res.status(500).json({ error: error });
        }
    };

    static logout = async (req: Request, res: Response): Promise<void> => {
        const authHeader: string = req.headers.authorization ?? "";
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            const message = { error: "Missing or invalid token" };
            res.status(401).json(message);
            return;
        }
        const token: string = authHeader.slice("Bearer ".length);

        try {
            await supabase.auth.admin.signOut(token);
        } catch (err) {
            console.warn("Supabase session revocation failed:", err);
            res.status(401).json({ message: "Session revocation failed" });
            return;
        }

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: COOKIE_SAME_SITE,
            path: "/",
        };
        res.clearCookie("sb-refresh-token", cookieOptions);

        res.status(200).json({ message: "Logged out successfully" });
    };

    static refresh = async (req: Request, res: Response): Promise<void> => {
        try {
            const refreshToken = req.cookies["sb-refresh-token"];
            if (!refreshToken) {
                res.status(401).json({ message: "Cookie not found" });
                return;
            }

            const cookieOptions = {
                httpOnly: true,
                secure: true,
                sameSite: COOKIE_SAME_SITE,
                path: "/auth/refresh",
            };

            const { data, error } = await supabase.auth.refreshSession({
                refresh_token: refreshToken,
            });
            if (error || !data?.session) {
                res.clearCookie("sb-refresh-token", cookieOptions);
                const message = { error: error?.message || "Invalid token" };
                res.status(401).json(message);
                return;
            }

            res.cookie("sb-refresh-token", data.session.refresh_token, cookieOptions);
            res.json({ accessToken: data.session.access_token });
        } catch (err) {
            console.error("Refresh error:", err);
            res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

