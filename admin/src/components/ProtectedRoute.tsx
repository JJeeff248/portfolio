import { useLocation } from "react-router-dom";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuthContext } from "../context/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const auth = useAuthContext();
    const location = useLocation();

    if (auth.isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    bgcolor: "background.default",
                }}
            >
                <CircularProgress color="primary" />
            </Box>
        );
    }

    if (!auth.isAuthenticated) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    gap: 2,
                    bgcolor: "background.default",
                    px: 2,
                }}
            >
                <LockOutlinedIcon
                    sx={{ fontSize: 48, color: "primary.main" }}
                />
                <Typography variant="h6" color="text.primary">
                    Sign in to manage the gallery
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                >
                    Gallery admin for chris-sa.com
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                        auth.signinRedirect({
                            state: { returnTo: location.pathname },
                        })
                    }
                >
                    Sign in with Cognito
                </Button>
            </Box>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
