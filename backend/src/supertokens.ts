import SuperTokens from "supertokens-node";
import EmailPassword from "supertokens-node/recipe/emailpassword";
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
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [EmailPassword.init(), Session.init()],
});
