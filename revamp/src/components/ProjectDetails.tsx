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
import Layout from "./Layout";

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

interface Project {
    title: string;
    description: string;
    image: string;
    link: string;
    skills: string[];
    longDescription?: string;
    features?: string[];
    htmlPath?: string;
    externalUrl?: string;
}

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

const projects: Project[] = [
    {
        title: "Teach Python",
        description: "An interactive platform for learning Python programming",
        image: "/projects/teach-python/images/HeaderImg.jpg",
        link: "/projects/teach-python",
        htmlPath: "/projects/teach-python/index.html",
        skills: ["Python", "React", "TypeScript", "MongoDB", "Express"],
        longDescription:
            "Teach Python is an interactive learning platform designed to help users master Python programming through hands-on exercises, real-world projects, and comprehensive tutorials. The platform features a modern, user-friendly interface and provides immediate feedback on code execution.",
        features: [
            "Interactive code editor with real-time execution",
            "Comprehensive Python tutorials and exercises",
            "Progress tracking and achievement system",
            "Community features for sharing and collaboration",
            "Mobile-responsive design for learning on the go",
        ],
    },
    {
        title: "Cotiss",
        description: "A modern web application for business management",
        image: "/projects/cotiss/preview.png",
        link: "/projects/cotiss",
        htmlPath: "/projects/cotiss/index.html",
        skills: ["React", "Node.js", "PostgreSQL", "Docker", "AWS"],
        longDescription:
            "Cotiss is a comprehensive business management solution that helps organizations streamline their operations, manage resources efficiently, and make data-driven decisions. The application provides a suite of tools for project management, resource allocation, and business analytics.",
        features: [
            "Project management and task tracking",
            "Resource allocation and team management",
            "Real-time analytics and reporting",
            "Secure user authentication and authorization",
            "Cloud-based deployment with AWS",
        ],
    },
    {
        title: "Help a Mate",
        description:
            "A fundraising platform to help individuals raise funds for causes",
        image: "/projects/helpamate/preview.jpg",
        link: "/projects/helpamate",
        externalUrl: "http://helpamate.chris-sa.com/",
        skills: ["HTML", "CSS", "JavaScript", "Responsive Design"],
        longDescription:
            "Help a Mate is a platform that enables individuals to create fundraising campaigns for various causes. Users can create campaigns, share their stories, set funding goals, and track progress. Visitors can browse campaigns and contribute to causes they care about.",
        features: [
            "Campaign creation and management",
            "Progress tracking with visual indicators",
            "User profiles and campaign listings",
            "Responsive design for all devices",
            "Mock donation system for demonstration purposes",
        ],
    },
];

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
                            {project.longDescription}
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
                                    sx={{ mt: 3 }}
                                >
                                    View Live Project
                                </Button>
                            )}
                        </Paper>
                    </Grid>
                </Grid>

                {(project.htmlPath || project.externalUrl) && (
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
                )}
            </Container>
        </Layout>
    );
}
