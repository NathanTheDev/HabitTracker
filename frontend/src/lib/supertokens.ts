import SuperTokens from "supertokens-auth-react";
import { supertokensConfig } from "./supertokensConfig";

export function initSuperTokens() {
  if (typeof window !== "undefined") {
    SuperTokens.init(supertokensConfig);
  }
}
