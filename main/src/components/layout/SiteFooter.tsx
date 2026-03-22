import {
    Box,
    Container,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";

function SiteFooter() {
    return (
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
                    &copy; {new Date().getFullYear()} Chris S&aacute;. All
                    rights reserved.
                </Typography>
            </Box>
        </Container>
    );
}

export default SiteFooter;
