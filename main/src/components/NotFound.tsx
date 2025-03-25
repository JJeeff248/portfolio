import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Container>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    textAlign: "center",
                    gap: 3,
                }}
            >
                <Typography
                    variant="h1"
                    component="h1"
                    color="primary"
                    sx={{ fontSize: { xs: "6rem", md: "10rem" } }}
                >
                    404
                </Typography>
                <Typography variant="h4" component="h2">
                    Page Not Found
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ maxWidth: "600px", mb: 4 }}
                >
                    The page you are looking for might have been removed, had
                    its name changed, or is temporarily unavailable.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/")}
                >
                    Return to Home
                </Button>
            </Box>
        </Container>
    );
};

export default NotFound;
