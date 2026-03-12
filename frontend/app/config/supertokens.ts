import PasswordlessReact from "supertokens-auth-react/recipe/passwordless";
import SessionReact from "supertokens-auth-react/recipe/session";
import { SuperTokensConfig } from "supertokens-auth-react/lib/build/types";

export const frontendConfig = (): SuperTokensConfig => ({
  appInfo: {
    appName: "MyApp",
    apiDomain: process.env.NEXT_PUBLIC_SUPERTOKENS_API_DOMAIN!,
    websiteDomain: process.env.NEXT_PUBLIC_WEBSITE_DOMAIN!,
    apiBasePath: "/auth",
    websiteBasePath: "/auth",
  },
  recipeList: [
    PasswordlessReact.init({
      contactMethod: "EMAIL",
    }),
    SessionReact.init(),
  ],
});
