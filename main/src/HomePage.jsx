import {
    Avatar,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    CardActionArea,
    SvgIcon,
} from "@mui/material";

// Icons
import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

const HomePage = () => {
    const flexCenter = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    };

    const cardSx = {
        p: 5,
    };

    return (
        <>
            <Container maxWidth="md" sx={{ mt: 8, mb: 4 }} style={flexCenter}>
                <Typography variant="h2" sx={{ mb: 2 }}>
                    About Me
                </Typography>
                <Avatar
                    alt="Chris sitting with a meerkat on his lap"
                    src={require("./images/headshot.jpg")}
                    sx={{ width: 150, height: 150, mb: 3 }}
                />
                <Typography variant="body1" fontSize={20} sx={{ mb: 2 }}>
                    Hi, I'm Chris! I graduated from Victoria University of Wellington
                    with a degree in Computer Science and a minor in Data Science. I started
                    programming in 2017 through school and have been learning
                    and loving it ever since. I enjoy learning new
                    things, and I'm always looking to improve my skills. When
                    I'm not coding, I'm usually playing video games, taking
                    photos or just hanging out with my friends.
                </Typography>
            </Container>

            <Container maxWidth="lg" sx={{ mt: 8, mb: 6 }} style={flexCenter}>
                <Typography variant="h2" sx={{ mb: 2 }}>
                    Contact
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Card>
                            <CardActionArea
                                style={flexCenter}
                                sx={cardSx}
                                href="mailto:chrisoesa@gmail.com"
                                target="_blank"
                            >
                                <SvgIcon
                                    component={EmailIcon}
                                    sx={{ width: 50, height: 50 }}
                                />
                                <CardContent>
                                    <Typography variant="h5">Email</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                        <Card>
                            <CardActionArea
                                style={flexCenter}
                                sx={cardSx}
                                href="https://www.linkedin.com/in/christopher-sa"
                                target="_blank"
                            >
                                <SvgIcon
                                    component={LinkedInIcon}
                                    sx={{ width: 50, height: 50 }}
                                />
                                <CardContent>
                                    <Typography variant="h5">
                                        LinkedIn
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                        <Card>
                            <CardActionArea
                                style={flexCenter}
                                sx={cardSx}
                                href="https://github.com/JJeeff248"
                                target="_blank"
                            >
                                <SvgIcon
                                    component={GitHubIcon}
                                    sx={{ width: 50, height: 50 }}
                                />
                                <CardContent>
                                    <Typography variant="h5">GitHub</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default HomePage;
