import SuperTokens from "supertokens-node";
import Passwordless from "supertokens-node/recipe/passwordless";
import Session from "supertokens-node/recipe/session";
import { config } from "./config";

SuperTokens.init({
  framework: "express",
  supertokens: {
    connectionURI: config.SUPERTOKENS_CONNECTION_URI,
    apiKey: config.SUPERTOKENS_API_KEY,
  },
  appInfo: {
    appName: "HabitTracker",
    apiDomain: `http://localhost:${config.PORT}`,
    websiteDomain: config.FRONTEND_ORIGIN,
    apiBasePath: "/api/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [
    Passwordless.init({
      flowType: "USER_INPUT_CODE",
      contactMethod: "EMAIL",
      emailDelivery: {
        override: (original) => ({
          ...original,
          sendEmail: async (input) => {
            console.log(`[OTP] ${input.email} → ${input.userInputCode}`);
          },
        }),
      },
    }),
    Session.init({ getTokenTransferMethod: () => "any" }),
  ],
});
