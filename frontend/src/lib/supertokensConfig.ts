import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";

export const supertokensConfig = {
  appInfo: {
    appName: "HabitTracker",
    apiDomain: process.env.NEXT_PUBLIC_SUPERTOKENS_API_DOMAIN!,
    websiteDomain: process.env.NEXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN!,
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [EmailPassword.init(), Session.init()],
};
