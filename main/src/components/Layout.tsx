import { ReactNode, useState } from "react";
import {
    Box,
    Container,
    IconButton,
    ThemeProvider,
    AppBar,
    Toolbar,
    Typography,
    Stack,
    Tooltip,
    Collapse,
    Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import { Link, NavLink } from "react-router-dom";
import { lightTheme, darkTheme } from "../theme";

interface LayoutProps {
    children: ReactNode;
}

const ThemeToggleButton = styled(IconButton)(({ theme }) => ({
    position: "fixed",
    top: theme.spacing(2),
    right: theme.spacing(2),
    backgroundColor:
        theme.palette.mode === "light"
            ? theme.palette.primary.main
            : theme.palette.background.paper,
    color:
        theme.palette.mode === "light"
            ? theme.palette.common.white
            : theme.palette.text.primary,
    boxShadow:
        theme.palette.mode === "light"
            ? "0 2px 8px rgba(0, 0, 0, 0.2)"
            : "none",
    "&:hover": {
        backgroundColor:
            theme.palette.mode === "dark"
                ? theme.palette.grey[800]
                : theme.palette.primary.dark,
    },
}));

const StyledNavLink = styled(NavLink)(({ theme }) => ({
    color:
        theme.palette.mode === "light"
            ? theme.palette.primary.dark
            : theme.palette.text.primary,
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
        color:
            theme.palette.mode === "light"
                ? theme.palette.primary.dark
                : theme.palette.primary.main,
        fontWeight: 600,
        backgroundColor:
            theme.palette.mode === "dark"
                ? "rgba(167, 200, 195, 0.15)"
                : "rgba(55, 88, 83, 0.1)",
    },
}));

function Layout({ children }: LayoutProps) {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Get saved theme preference from localStorage or default to true (dark mode)
        const savedTheme = localStorage.getItem("theme-preference");
        return savedTheme ? savedTheme === "dark" : true;
    });

    const [contactOpen, setContactOpen] = useState(false);

    const toggleTheme = () => {
        const newThemeMode = !isDarkMode;
        setIsDarkMode(newThemeMode);
        // Save theme preference to localStorage
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

                {/* Desktop Navigation */}
                <AppBar
                    position="static"
                    color="transparent"
                    elevation={0}
                    sx={{
                        mb: 4,
                        color: (theme) =>
                            theme.palette.mode === "light"
                                ? theme.palette.primary.dark
                                : "inherit",
                        display: { xs: "none", sm: "block" },
                    }}
                >
                    <Container maxWidth="lg">
                        <Toolbar disableGutters>
                            <Typography
                                variant="h6"
                                component={Link}
                                to="/"
                                sx={{
                                    fontWeight: 700,
                                    textDecoration: "none",
                                    marginRight: 3,
                                    color: (theme) =>
                                        theme.palette.mode === "light"
                                            ? theme.palette.primary.dark
                                            : "inherit",
                                }}
                            >
                                Chris S&aacute;
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                    flexGrow: 1,
                                }}
                            >
                                <StyledNavLink to="/" end>
                                    Projects
                                </StyledNavLink>
                                <StyledNavLink to="/gallery">
                                    Photography
                                </StyledNavLink>
                                <Box sx={{ position: "relative" }}>
                                    <Box
                                        component="div"
                                        onClick={toggleContact}
                                        sx={{
                                            color: (theme) =>
                                                theme.palette.mode === "light"
                                                    ? theme.palette.primary.dark
                                                    : theme.palette.text
                                                          .primary,
                                            textDecoration: "none",
                                            padding: (theme) =>
                                                theme.spacing(1.5),
                                            fontWeight: 500,
                                            borderRadius: (theme) =>
                                                theme.spacing(1),
                                            transition: "background-color 0.2s",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            backgroundColor: contactOpen
                                                ? (theme) =>
                                                      theme.palette.mode ===
                                                      "dark"
                                                          ? "rgba(167, 200, 195, 0.15)"
                                                          : "rgba(55, 88, 83, 0.1)"
                                                : "transparent",
                                            "&:hover": {
                                                backgroundColor: (theme) =>
                                                    theme.palette.mode ===
                                                    "dark"
                                                        ? "rgba(255, 255, 255, 0.08)"
                                                        : "rgba(0, 0, 0, 0.04)",
                                            },
                                        }}
                                    >
                                        Contact
                                    </Box>

                                    {/* Desktop social icons - slide out horizontally */}
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "100%",
                                            transform: "translateY(-50%)",
                                            display: "flex",
                                            zIndex: 10,
                                        }}
                                    >
                                        <IconButton
                                            component="a"
                                            href="https://linkedin.com/in/christopher-sa"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            color="primary"
                                            size="small"
                                            sx={{
                                                transform: contactOpen
                                                    ? "translateX(0)"
                                                    : "translateX(-20px)",
                                                opacity: contactOpen ? 1 : 0,
                                                pointerEvents: contactOpen
                                                    ? "auto"
                                                    : "none",
                                                transition:
                                                    "transform 0.3s, opacity 0.3s",
                                                transitionDelay: "0.05s",
                                            }}
                                        >
                                            <LinkedInIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            component="a"
                                            href="https://github.com/JJeeff248"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            color="primary"
                                            size="small"
                                            sx={{
                                                transform: contactOpen
                                                    ? "translateX(0)"
                                                    : "translateX(-20px)",
                                                opacity: contactOpen ? 1 : 0,
                                                pointerEvents: contactOpen
                                                    ? "auto"
                                                    : "none",
                                                transition:
                                                    "transform 0.3s, opacity 0.3s",
                                                transitionDelay: "0.1s",
                                            }}
                                        >
                                            <GitHubIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            component="a"
                                            href="mailto:contact@chris-sa.com"
                                            color="primary"
                                            size="small"
                                            sx={{
                                                transform: contactOpen
                                                    ? "translateX(0)"
                                                    : "translateX(-20px)",
                                                opacity: contactOpen ? 1 : 0,
                                                pointerEvents: contactOpen
                                                    ? "auto"
                                                    : "none",
                                                transition:
                                                    "transform 0.3s, opacity 0.3s",
                                                transitionDelay: "0.15s",
                                            }}
                                        >
                                            <EmailIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>

                {/* Mobile Header (just logo) */}
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
                        <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                            sx={{ mb: 2 }}
                        >
                            <Tooltip title="LinkedIn">
                                <IconButton
                                    component="a"
                                    href="https://linkedin.com/in/christopher-sa"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    color="primary"
                                >
                                    <LinkedInIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="GitHub">
                                <IconButton
                                    component="a"
                                    href="https://github.com/JJeeff248"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    color="primary"
                                >
                                    <GitHubIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Email">
                                <IconButton
                                    component="a"
                                    href="mailto:contact@chris-sa.com"
                                    color="primary"
                                >
                                    <EmailIcon />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                            &copy; {new Date().getFullYear()} Chris S&aacute;.
                            All rights reserved.
                        </Typography>
                    </Box>
                </Container>

                {/* Mobile Bottom Navigation */}
                <Paper
                    sx={{
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        display: { xs: "block", sm: "none" },
                        zIndex: 1100,
                        boxShadow: 3,
                        width: "100%",
                    }}
                    elevation={3}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-around",
                            py: 1,
                        }}
                    >
                        <Box
                            component={NavLink}
                            to="/"
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                color: (theme) => theme.palette.text.secondary,
                                textDecoration: "none",
                                py: 1,
                                px: 2,
                                "&.active": {
                                    color: (theme) =>
                                        theme.palette.primary.main,
                                    fontWeight: 600,
                                },
                            }}
                        >
                            <Typography variant="body2">Projects</Typography>
                        </Box>
                        <Box
                            component={NavLink}
                            to="/gallery"
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                color: (theme) => theme.palette.text.secondary,
                                textDecoration: "none",
                                py: 1,
                                px: 2,
                                "&.active": {
                                    color: (theme) =>
                                        theme.palette.primary.main,
                                    fontWeight: 600,
                                },
                            }}
                        >
                            <Typography variant="body2">Photography</Typography>
                        </Box>
                        <Box
                            component="div"
                            onClick={toggleContact}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                color: contactOpen
                                    ? (theme) => theme.palette.primary.main
                                    : (theme) => theme.palette.text.secondary,
                                py: 1,
                                px: 2,
                                cursor: "pointer",
                                fontWeight: contactOpen ? 600 : 400,
                            }}
                        >
                            <Typography variant="body2">Contact</Typography>
                        </Box>
                    </Box>

                    {/* Mobile contact options dropdown from bottom */}
                    <Collapse in={contactOpen}>
                        <Box
                            sx={{
                                p: 2,
                                backgroundColor: (theme) =>
                                    theme.palette.background.paper,
                                borderTop: 1,
                                borderColor: "divider",
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={4}
                                justifyContent="center"
                            >
                                <Tooltip title="LinkedIn">
                                    <IconButton
                                        component="a"
                                        href="https://linkedin.com/in/christopher-sa"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        color="primary"
                                    >
                                        <LinkedInIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="GitHub">
                                    <IconButton
                                        component="a"
                                        href="https://github.com/JJeeff248"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        color="primary"
                                    >
                                        <GitHubIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Email">
                                    <IconButton
                                        component="a"
                                        href="mailto:contact@chris-sa.com"
                                        color="primary"
                                    >
                                        <EmailIcon />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        </Box>
                    </Collapse>
                </Paper>
            </Box>
        </ThemeProvider>
    );
}

export default Layout;
