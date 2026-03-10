
import SuperTokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import Passwordless from "supertokens-node/recipe/passwordless";
import { supabase } from "./util.js";

SuperTokens.init({
    framework: "express",
    supertokens: {
        connectionURI: "https://try.supertokens.com"
    },
    appInfo: {
        appName: "My App",
        apiDomain: "http://localhost:3001",
        websiteDomain: "http://localhost:3000",
        apiBasePath: "/auth"
    },
    recipeList: [
        Passwordless.init({
            contactMethod: "EMAIL",
            override: {
                functions: (original) => ({
                    ...original,
                    consumeCode: async (input) => {
                        const response = await original.consumeCode(input);
                        if (response.status === "OK" && response.createdNewUser) {
                            const userId = response.user.id;
                            await supabase
                            .from("users")
                            .insert({ id: userId });
                        }
                        return response;
                    }
                })
            }
        }),
        Session.init()
    ]
});
