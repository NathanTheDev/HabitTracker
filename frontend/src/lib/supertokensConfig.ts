import Passwordless from "supertokens-auth-react/recipe/passwordless";
import Session from "supertokens-auth-react/recipe/session";

export const supertokensConfig = {
  appInfo: {
    appName: "HabitTracker",
    apiDomain: process.env.NEXT_PUBLIC_SUPERTOKENS_API_DOMAIN!,
    websiteDomain: process.env.NEXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN!,
    apiBasePath: "/api/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [
    Passwordless.init({
      contactMethod: "EMAIL",
    }),
    Session.init(),
  ],
};
