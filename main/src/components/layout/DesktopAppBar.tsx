import {
    Box,
    Container,
    IconButton,
    AppBar,
    Toolbar,
    Typography,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import { Link } from "react-router-dom";
import { StyledNavLink } from "./LayoutStyles";

interface DesktopAppBarProps {
    contactOpen: boolean;
    toggleContact: () => void;
}

function DesktopAppBar({ contactOpen, toggleContact }: DesktopAppBarProps) {
    return (
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
                                            : theme.palette.text.primary,
                                    textDecoration: "none",
                                    padding: (theme) => theme.spacing(1.5),
                                    fontWeight: 500,
                                    borderRadius: (theme) => theme.spacing(1),
                                    transition: "background-color 0.2s",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    backgroundColor: contactOpen
                                        ? (theme) =>
                                              theme.palette.mode === "dark"
                                                  ? "rgba(167, 200, 195, 0.15)"
                                                  : "rgba(55, 88, 83, 0.1)"
                                        : "transparent",
                                    "&:hover": {
                                        backgroundColor: (theme) =>
                                            theme.palette.mode === "dark"
                                                ? "rgba(255, 255, 255, 0.08)"
                                                : "rgba(0, 0, 0, 0.04)",
                                    },
                                }}
                            >
                                Contact
                            </Box>

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
    );
}

export default DesktopAppBar;
