
import type { Request, Response, NextFunction } from "express";
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL, JWT_SECRET_KEY } from './config.js';

export const supabase: SupabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
);