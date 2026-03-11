
// supertokens.ts
import SuperTokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import Passwordless, {
  RecipeInterface as PasswordlessRecipeInterface,
  User as PasswordlessUser,
  TypeInput as PasswordlessTypeInput,
} from "supertokens-node/recipe/passwordless";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// --------------------
// Supabase setup
// --------------------
const supabase: SupabaseClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// Define Supabase table row type
interface SupabaseUserRow {
  id: string;
  email: string;
}

// --------------------
// SuperTokens initialization
// --------------------
SuperTokens.init({
  framework: "express",
  supertokens: {
    connectionURI: "https://try.supertokens.io", // replace with your self-hosted core if needed
    apiKey: process.env.SUPERTOKENS_API_KEY,
  },
  appInfo: {
    appName: "MyApp",
    apiDomain: "http://localhost:3001", // Express backend
    websiteDomain: "http://localhost:3000", // Next.js frontend
  },
  recipeList: [
    Passwordless.init({
      contactMethod: "EMAIL",
      flowType: "USER_INPUT_CODE", // OTP login
      emailDelivery: {
        service: {
          sendEmail: async (
            input: PasswordlessTypeInput["emailDelivery"]["service"]["sendEmail"]
          ) => {
            const email = input.email!;
            const code = input.userInputCode!;
            const link = input.urlWithLinkCode;
            console.log("Send OTP to:", email, "code:", code, "link:", link);

            // TODO: integrate your real email service here
          },
        },
      },
      override: {
        functions: (originalImplementation): Partial<PasswordlessRecipeInterface> => {
          return {
            ...originalImplementation,
            // --------------------
            // Create user in Supabase if not exists
            // --------------------
            createUser: async ({
              email,
              userContext,
            }: {
              email: string;
              userContext: any;
            }): Promise<PasswordlessUser> => {
              const { data, error } = await supabase
                .from<SupabaseUserRow, SupabaseUserRow>("users")
                .insert([{ email }])
                .select("*")
                .single();
              if (error) throw error;
              return { id: data.id, email: data.email };
            },

            // --------------------
            // Get user by email
            // --------------------
            getUserByEmail: async ({
              email,
              userContext,
            }: {
              email: string;
              userContext: any;
            }): Promise<PasswordlessUser | null> => {
              const { data, error } = await supabase
                .from<SupabaseUserRow, SupabaseUserRow>("users")
                .select("*")
                .eq("email", email)
                .single();
              if (error || !data) return null;
              return { id: data.id, email: data.email };
            },

            // --------------------
            // Get user by ID
            // --------------------
            getUserById: async ({
              userId,
              userContext,
            }: {
              userId: string;
              userContext: any;
            }): Promise<PasswordlessUser | null> => {
              const { data, error } = await supabase
                .from<SupabaseUserRow, SupabaseUserRow>("users")
                .select("*")
                .eq("id", userId)
                .single();
              if (error || !data) return null;
              return { id: data.id, email: data.email };
            },
          };
        },
      },
    }),
    Session.init(), // default session recipe
  ],
});