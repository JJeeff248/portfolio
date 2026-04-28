import {
    Box,
    Collapse,
    IconButton,
    Paper,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import { NavLink } from "react-router-dom";

interface MobileBottomNavProps {
    contactOpen: boolean;
    toggleContact: () => void;
}

function MobileBottomNav({
    contactOpen,
    toggleContact,
}: MobileBottomNavProps) {
    return (
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
                            color: (theme) => theme.palette.primary.main,
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
                            color: (theme) => theme.palette.primary.main,
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
                        sx={{ justifyContent: "center" }}
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
    );
}

export default MobileBottomNav;
