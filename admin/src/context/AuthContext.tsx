import { AuthProvider, useAuth } from "react-oidc-context";
import type { User } from "oidc-client-ts";

const authority = import.meta.env.VITE_COGNITO_AUTHORITY;
const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
const redirectUri =
    import.meta.env.VITE_COGNITO_REDIRECT_URI || window.location.origin;

if (!authority) throw new Error("VITE_COGNITO_AUTHORITY is not defined");
if (!clientId) throw new Error("VITE_COGNITO_CLIENT_ID is not defined");

const oidcConfig = {
    authority,
    client_id: clientId,
    redirect_uri: redirectUri,
    post_logout_redirect_uri: redirectUri,
    response_type: "code",
    scope: "email openid phone",
    onSigninCallback: (user: User | undefined) => {
        const returnTo = (user?.state as { returnTo?: string } | undefined)
            ?.returnTo;
        const destination = returnTo && returnTo !== "/" ? returnTo : "/";
        window.location.replace(destination);
    },
};

export const AuthContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return <AuthProvider {...oidcConfig}>{children}</AuthProvider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => useAuth();
