import { useState } from "react";
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Button,
    Paper,
    IconButton,
    ThemeProvider,
    Chip,
    Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { lightTheme, darkTheme } from "./theme";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProjectDetails from "./components/ProjectDetails";

interface Project {
    title: string;
    description: string;
    image: string;
    link: string;
    skills: string[];
}

const ProjectCard = styled(Card)(() => ({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    "&:hover .MuiCardMedia-root": {
        transform: "scale(1.05)",
    },
}));

const ProjectOverlay = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor:
        theme.palette.mode === "dark"
            ? "rgba(96, 165, 250, 0.9)"
            : "rgba(37, 99, 235, 0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.3s ease",
    "&:hover": {
        opacity: 1,
    },
}));

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

const HeroPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    marginBottom: theme.spacing(6),
    textAlign: "center",
    background:
        theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1f2937 0%, #111827 100%)"
            : "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
    borderRadius: theme.spacing(2),
}));

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

function Portfolio() {
    const [isDarkMode, setIsDarkMode] = useState(true);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const [projects] = useState<Project[]>([
        {
            title: "Teach Python",
            description:
                "An interactive platform for learning Python programming",
            image: "/projects/teach-python/images/HeaderImg.jpg",
            link: "/projects/teach-python",
            skills: ["Python", "React", "TypeScript", "MongoDB", "Express"],
        },
        {
            title: "Cotiss",
            description: "A modern web application for business management",
            image: "/projects/cotiss/preview.png",
            link: "/projects/cotiss",
            skills: ["React", "Node.js", "PostgreSQL", "Docker", "AWS"],
        },
    ]);

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

                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <HeroPaper elevation={0}>
                        <Typography variant="h1" component="h1" gutterBottom>
                            Chris Sa
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            Software Developer & Creative Problem Solver
                        </Typography>
                    </HeroPaper>

                    <Typography
                        variant="h2"
                        component="h2"
                        align="center"
                        gutterBottom
                        sx={{ mb: 4 }}
                    >
                        Featured Projects
                    </Typography>

                    <Grid container spacing={4}>
                        {projects.map((project, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <ProjectCard>
                                    <Box
                                        sx={{
                                            position: "relative",
                                            height: 200,
                                            overflow: "hidden",
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={project.image}
                                            alt={project.title}
                                            sx={{
                                                transition:
                                                    "transform 0.3s ease",
                                                objectFit: "cover",
                                            }}
                                        />
                                        <ProjectOverlay>
                                            <Button
                                                component={Link}
                                                to={`${project.link}`}
                                                variant="outlined"
                                                color="inherit"
                                                sx={{
                                                    borderColor: "white",
                                                    color: "white",
                                                    "&:hover": {
                                                        borderColor: "white",
                                                        backgroundColor:
                                                            "white",
                                                        color: "primary.main",
                                                    },
                                                }}
                                            >
                                                View Project
                                            </Button>
                                        </ProjectOverlay>
                                    </Box>
                                    <CardContent>
                                        <Typography variant="h3" gutterBottom>
                                            {project.title}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                            sx={{ mb: 2 }}
                                        >
                                            {project.description}
                                        </Typography>
                                        <Stack
                                            direction="row"
                                            spacing={0}
                                            flexWrap="wrap"
                                            gap={0.5}
                                            sx={{ mt: 1 }}
                                        >
                                            {project.skills.map(
                                                (skill, skillIndex) => (
                                                    <SkillChip
                                                        key={skillIndex}
                                                        label={skill}
                                                        size="small"
                                                    />
                                                )
                                            )}
                                        </Stack>
                                    </CardContent>
                                </ProjectCard>
                            </Grid>
                        ))}
                    </Grid>

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

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Portfolio />} />
                <Route
                    path="/projects/:projectId"
                    element={<ProjectDetails />}
                />
            </Routes>
        </Router>
    );
}

export default App;
