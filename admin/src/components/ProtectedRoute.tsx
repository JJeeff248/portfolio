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
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
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
                }}
            >
                <LockOutlinedIcon sx={{ fontSize: 48, color: "text.secondary" }} />
                <Typography variant="h6" color="text.secondary">
                    Sign in to manage the gallery
                </Typography>
                <Button
                    variant="contained"
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
