import { useParams, Link } from "react-router-dom";
import {
    Container,
    Typography,
    Box,
    Button,
    Paper,
    Grid,
    Chip,
    Stack,
    IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import GitHubIcon from "@mui/icons-material/GitHub";
import Layout from "./Layout";
import { projects } from "../data/projects";

const SkillChip = styled(Chip)(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === "dark"
            ? "rgba(59, 130, 246, 0.15)"
            : "rgba(37, 99, 235, 0.1)",
    color:
        theme.palette.mode === "dark"
            ? theme.palette.primary.main
            : theme.palette.primary.main,
    fontWeight: 500,
    borderRadius: "0.5rem",
    margin: "0.25rem",
    transition: "all 0.2s ease-in-out",
    border: `1px solid ${
        theme.palette.mode === "dark"
            ? "rgba(59, 130, 246, 0.3)"
            : "rgba(37, 99, 235, 0.2)"
    }`,
    "&:hover": {
        backgroundColor:
            theme.palette.mode === "dark"
                ? "rgba(59, 130, 246, 0.25)"
                : "rgba(37, 99, 235, 0.15)",
        transform: "translateY(-2px)",
    },
}));

const IframeContainer = styled(Box)(({ theme }) => ({
    width: "100%",
    marginTop: theme.spacing(4),
    position: "relative",
    borderRadius: "8px",
    overflow: "hidden",
    border: `1px solid ${theme.palette.divider}`,
}));

const IframeHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1, 2),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor:
        theme.palette.mode === "dark"
            ? theme.palette.grey[900]
            : theme.palette.grey[100],
    borderBottom: `1px solid ${theme.palette.divider}`,
}));

const ProjectIframe = styled("iframe")({
    width: "100%",
    height: "800px",
    border: "none",
});

export default function ProjectDetails() {
    const { projectId } = useParams<{ projectId: string }>();
    const project = projects.find((p) => p.link === `/projects/${projectId}`);

    if (!project) {
        return (
            <Layout>
                <Container>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Project not found
                    </Typography>
                    <Button
                        component={Link}
                        to="/"
                        startIcon={<ArrowBackIcon />}
                        sx={{ mt: 2 }}
                    >
                        Back to Portfolio
                    </Button>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Button
                    component={Link}
                    to="/"
                    startIcon={<ArrowBackIcon />}
                    sx={{ mb: 4 }}
                >
                    Back to Portfolio
                </Button>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h2" component="h1" gutterBottom>
                            {project.title}
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            paragraph
                        >
                            {project.longDescription || project.description}
                        </Typography>
                        <Typography
                            variant="h4"
                            component="h2"
                            gutterBottom
                            sx={{ mt: 4 }}
                        >
                            Features
                        </Typography>
                        <Box component="ul" sx={{ pl: 2 }}>
                            {project.features?.map((feature, index) => (
                                <Typography
                                    component="li"
                                    key={index}
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                >
                                    {feature}
                                </Typography>
                            ))}
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, position: "sticky", top: 24 }}>
                            <Typography
                                variant="h5"
                                component="h3"
                                gutterBottom
                            >
                                Technologies Used
                            </Typography>
                            <Stack
                                direction="row"
                                spacing={0}
                                flexWrap="wrap"
                                gap={0.5}
                                sx={{ mt: 1 }}
                            >
                                {project.skills.map((skill, index) => (
                                    <SkillChip
                                        key={index}
                                        label={skill}
                                        size="small"
                                    />
                                ))}
                            </Stack>
                            <Stack spacing={2} sx={{ mt: 3 }}>
                                {project.githubUrl && (
                                    <Button
                                        variant="outlined"
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        fullWidth
                                        startIcon={<GitHubIcon />}
                                    >
                                        View on GitHub
                                    </Button>
                                )}
                                {(project.htmlPath || project.externalUrl) && (
                                    <Button
                                        variant="contained"
                                        href={
                                            project.externalUrl ||
                                            project.htmlPath ||
                                            ""
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        fullWidth
                                        endIcon={<OpenInNewIcon />}
                                    >
                                        View Live Project
                                    </Button>
                                )}
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>

                {project.htmlPath || project.externalUrl ? (
                    <IframeContainer sx={{ mt: 6 }}>
                        <IframeHeader>
                            <Typography variant="subtitle1">
                                Project Preview
                            </Typography>
                            <IconButton
                                href={
                                    project.externalUrl ||
                                    project.htmlPath ||
                                    ""
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Open in new tab"
                                title="Open in new tab"
                            >
                                <OpenInNewIcon />
                            </IconButton>
                        </IframeHeader>
                        <ProjectIframe
                            src={project.externalUrl || project.htmlPath || ""}
                            title={project.title}
                        />
                    </IframeContainer>
                ) : (
                    <Box sx={{ mt: 6, textAlign: "center" }}>
                        <Typography variant="h5" gutterBottom>
                            Project Preview
                        </Typography>
                        <Box
                            component="img"
                            src={project.image}
                            alt={project.title}
                            sx={{
                                maxWidth: "100%",
                                maxHeight: "800px",
                                borderRadius: "8px",
                                border: (theme) =>
                                    `1px solid ${theme.palette.divider}`,
                            }}
                        />
                    </Box>
                )}
            </Container>
        </Layout>
    );
}
