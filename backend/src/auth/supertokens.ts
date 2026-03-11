
import SuperTokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import Passwordless from "supertokens-node/recipe/passwordless";
import { supabase } from "../util.js";

export function initSuperTokens() {
  SuperTokens.init({
    framework: "express",
    supertokens: {
      connectionURI: process.env.SUPERTOKENS_CONNECTION_URI!,
    },
    appInfo: {
      appName: "MyApp",
      apiDomain: `http://localhost:${process.env.PORT || 3001}`,
      websiteDomain: process.env.FRONTEND_URL!,
      apiBasePath: "/auth",
      websiteBasePath: "/auth",
    },
    recipeList: [
      Passwordless.init({
        flowType: "USER_INPUT_CODE",
        contactMethod: "EMAIL",

        override: {
          apis: (originalImplementation) => ({
            ...originalImplementation,

            consumeCodePOST: async (input) => {
              const response =
                await originalImplementation.consumeCodePOST!(input);

              if (
                response.status === "OK" &&
                response.createdNewRecipeUser
              ) {
                const { user } = response;
                const email = user.emails[0] ?? null;
                const phone = user.phoneNumbers[0] ?? null;

                const { error } = await supabase.from("users").upsert(
                  {
                    supertokens_id: user.id,
                    email,
                    phone,
                    created_at: new Date().toISOString(),
                  },
                  { onConflict: "supertokens_id" }
                );

                if (error) {
                  console.error("Supabase upsert failed:", error.message);
                }
              }

              return response;
            },
          }),
        },
      }),

      Session.init(),
    ],
  });
}
