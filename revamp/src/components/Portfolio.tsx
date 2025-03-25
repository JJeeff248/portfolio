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
    Chip,
    Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import { projects } from "../data/projects";

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
            ? "rgba(167, 200, 195, 0.8)"
            : "rgba(55, 88, 83, 0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.3s ease",
    "&:hover": {
        opacity: 1,
    },
}));

const SkillChip = styled(Chip)(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === "dark"
            ? "rgba(167, 200, 195, 0.15)"
            : "rgba(55, 88, 83, 0.1)",
    color:
        theme.palette.mode === "dark"
            ? theme.palette.primary.light
            : theme.palette.primary.dark,
    fontWeight: 500,
    borderRadius: "0.5rem",
    margin: "0.25rem",
    transition: "all 0.2s ease-in-out",
    border: `1px solid ${
        theme.palette.mode === "dark"
            ? "rgba(167, 200, 195, 0.3)"
            : "rgba(55, 88, 83, 0.2)"
    }`,
    "&:hover": {
        backgroundColor:
            theme.palette.mode === "dark"
                ? "rgba(167, 200, 195, 0.25)"
                : "rgba(55, 88, 83, 0.15)",
        transform: "translateY(-2px)",
    },
}));

function Portfolio() {
    return (
        <Layout>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper
                    elevation={0}
                    sx={{
                        padding: 4,
                        marginBottom: 6,
                        textAlign: "center",
                        borderRadius: 2,
                        background: (theme) =>
                            theme.palette.mode === "dark"
                                ? "linear-gradient(135deg, hsl(180, 20.00%, 3.00%) 0%, hsl(170, 20.00%, 6.90%) 100%)"
                                : "linear-gradient(135deg,hsl(180, 20.00%, 96.00%) 0%,hsl(180, 37.50%, 93.20%) 100%)",
                    }}
                >
                    <Typography variant="h1" component="h1" gutterBottom>
                        Chris Sa
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: (theme) => theme.palette.text.primary,
                        }}
                    >
                        Software Developer & Creative Problem Solver
                    </Typography>
                </Paper>

                <Typography
                    variant="h2"
                    component="h2"
                    align="center"
                    gutterBottom
                    sx={{
                        mb: 4,
                        color: (theme) => theme.palette.text.primary,
                        fontWeight: 700,
                    }}
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
                                            transition: "transform 0.3s ease",
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
                                                    backgroundColor: "white",
                                                    color: (theme) =>
                                                        theme.palette.mode ===
                                                        "dark"
                                                            ? "#4d456e"
                                                            : "#375853",
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
            </Container>
        </Layout>
    );
}

export default Portfolio;
