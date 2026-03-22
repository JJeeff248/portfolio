import { ReactNode, useState } from "react";
import { Box, ThemeProvider, Typography } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Link } from "react-router-dom";
import { lightTheme, darkTheme } from "../theme";
import { ThemeToggleButton } from "./layout/LayoutStyles";
import DesktopAppBar from "./layout/DesktopAppBar";
import SiteFooter from "./layout/SiteFooter";
import MobileBottomNav from "./layout/MobileBottomNav";

interface LayoutProps {
    children: ReactNode;
}

function Layout({ children }: LayoutProps) {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme-preference");
        return savedTheme ? savedTheme === "dark" : true;
    });

    const [contactOpen, setContactOpen] = useState(false);

    const toggleTheme = () => {
        const newThemeMode = !isDarkMode;
        setIsDarkMode(newThemeMode);
        localStorage.setItem(
            "theme-preference",
            newThemeMode ? "dark" : "light"
        );
    };

    const toggleContact = () => {
        setContactOpen(!contactOpen);
    };

    return (
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <Box
                sx={{
                    minHeight: "100vh",
                    bgcolor: "background.default",
                    pb: { xs: 7, sm: 0 },
                    overflowX: "hidden",
                    position: "relative",
                }}
            >
                <ThemeToggleButton
                    onClick={toggleTheme}
                    color="inherit"
                    aria-label="toggle theme"
                >
                    {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </ThemeToggleButton>

                <DesktopAppBar
                    contactOpen={contactOpen}
                    toggleContact={toggleContact}
                />

                <Box
                    sx={{
                        display: { xs: "flex", sm: "none" },
                        justifyContent: "center",
                        py: 2,
                        mb: 2,
                    }}
                >
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{
                            fontWeight: 700,
                            textDecoration: "none",
                            color: (theme) =>
                                theme.palette.mode === "light"
                                    ? theme.palette.primary.dark
                                    : "inherit",
                        }}
                    >
                        Chris S&aacute;
                    </Typography>
                </Box>

                {children}

                <SiteFooter />

                <MobileBottomNav
                    contactOpen={contactOpen}
                    toggleContact={toggleContact}
                />
            </Box>
        </ThemeProvider>
    );
}

export default Layout;
