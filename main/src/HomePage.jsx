import { Avatar, Container, Grid, Typography, Card, CardContent, CardActionArea, CardActions, Button, SvgIcon } from "@mui/material";

// Icons
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';



const HomePage = () => {

    const flexCenter = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    }

    const cardSx = {
        p: 5
    }

    return (
        <>
            <Container maxWidth="md" sx={{ mt: 8, mb: 4 }} style={flexCenter}>
                <Typography variant="h2">
                    About Me
                </Typography>
                <Avatar
                    alt="Chris sitting with a meerkat on his lap"
                    src={require("./images/headshot.jpg")}
                    sx={{ width: 200, height: 200 }}
                />
                <Typography variant="body1">
                    I'm a student at Victoria University of Wellington currently studying Computer Science and Data Science.

                    I started programming in 2017 through school and have been using and learning it ever since. I really enjoy learning new things, and I'm always looking to improve my skills.

                    When I'm not coding, I'm usually playing video games, taking photos or just hanging out with my friends.
                </Typography>
            </Container>
            
            <Container maxWidth="md" sx={{ mt: 8, mb: 4 }} style={flexCenter}>
                <Typography variant="h2">
                    Contact
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Card>
                            <CardActionArea style={flexCenter} sx={cardSx} href="mailto:chrisoesa@gmail.com" target="_blank">
                                <SvgIcon component={EmailIcon} sx={{ width: 50, height: 50 }} />
                                <CardContent>
                                    <Typography variant="h5">Email</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <Card>
                            <CardActionArea style={flexCenter} sx={cardSx} href="https://www.linkedin.com/in/christopher-sa" target="_blank">
                                <SvgIcon component={LinkedInIcon} sx={{ width: 50, height: 50 }} />
                                <CardContent>
                                    <Typography variant="h5">LinkedIn</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <Card>
                            <CardActionArea style={flexCenter} sx={cardSx} href="https://github.com/JJeeff248" target="_blank">
                                <SvgIcon component={GitHubIcon} sx={{ width: 50, height: 50 }} />
                                <CardContent>
                                    <Typography variant="h5">GitHub</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <Card>
                            <CardActionArea style={flexCenter} sx={cardSx} href="https://twitter.com/cybr_chris" target="_blank">
                                <SvgIcon component={TwitterIcon} sx={{ width: 50, height: 50 }} />
                                <CardContent>
                                    <Typography variant="h5">Twitter</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                </Grid>
                
            </Container>
        </>
    )
}

export default HomePage;