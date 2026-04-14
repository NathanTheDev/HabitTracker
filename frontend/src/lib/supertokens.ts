import SuperTokensReact from "supertokens-auth-react";
import { supertokensConfig } from "./supertokensConfig";

export function initSuperTokens() {
  if (typeof window === "undefined") return;
  SuperTokensReact.init(supertokensConfig);
}
