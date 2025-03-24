import { ReactNode, useState } from "react";
import {
    Box,
    Container,
    IconButton,
    ThemeProvider,
    AppBar,
    Toolbar,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Link, NavLink } from "react-router-dom";
import { lightTheme, darkTheme } from "../theme";

interface LayoutProps {
    children: ReactNode;
}

const ThemeToggleButton = styled(IconButton)(({ theme }) => ({
    position: "fixed",
    top: theme.spacing(2),
    right: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    "&:hover": {
        backgroundColor:
            theme.palette.mode === "dark"
                ? theme.palette.grey[800]
                : theme.palette.grey[100],
    },
}));

const StyledNavLink = styled(NavLink)(({ theme }) => ({
    color: theme.palette.text.primary,
    textDecoration: "none",
    padding: theme.spacing(1.5),
    fontWeight: 500,
    borderRadius: theme.spacing(1),
    transition: "background-color 0.2s",
    "&:hover": {
        backgroundColor:
            theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.04)",
    },
    "&.active": {
        color: theme.palette.primary.main,
        backgroundColor:
            theme.palette.mode === "dark"
                ? "rgba(59, 130, 246, 0.15)"
                : "rgba(37, 99, 235, 0.1)",
    },
}));

function Layout({ children }: LayoutProps) {
    const [isDarkMode, setIsDarkMode] = useState(true);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
                <ThemeToggleButton
                    onClick={toggleTheme}
                    color="inherit"
                    aria-label="toggle theme"
                >
                    {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </ThemeToggleButton>

                <AppBar
                    position="static"
                    color="transparent"
                    elevation={0}
                    sx={{ mb: 4 }}
                >
                    <Container maxWidth="lg">
                        <Toolbar disableGutters>
                            <Typography
                                variant="h6"
                                component={Link}
                                to="/"
                                sx={{
                                    flexGrow: 0,
                                    fontWeight: 700,
                                    mr: 4,
                                    textDecoration: "none",
                                    color: "inherit",
                                }}
                            >
                                Chris Sa
                            </Typography>
                            <Box sx={{ flexGrow: 1, display: "flex" }}>
                                <StyledNavLink to="/" end>
                                    Projects
                                </StyledNavLink>
                                <StyledNavLink to="/gallery">
                                    Photography
                                </StyledNavLink>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>

                {children}

                <Container maxWidth="lg">
                    <Box
                        component="footer"
                        sx={{
                            mt: 8,
                            py: 3,
                            textAlign: "center",
                            borderTop: 1,
                            borderColor: "divider",
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            © 2024 Chris Sa. All rights reserved.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default Layout;
