import React from "react";
import { Box, Container, Divider, Link, Typography } from "@mui/material";
import languages from "./Languages.js";
import ProgrammingCard from "./ProgrammingCard";
import AwardCard from "./AwardCard.jsx";
import ProjectCard from "./ProjectCard.jsx";

const DevPage = () => {
    return (
        <Container
            maxWidth="md"
            sx={{
                display: "flex",
                alignItems: "center",
                height: "90vh",
                flexDirection: "column",
                mt: 5,
            }}
        >
            <Box id="about" width="100%">
                <Typography variant="h4" textAlign="left" mb={1}>
                    How did I get here?
                </Typography>
                <Divider sx={{ mb: 2, borderBottomWidth: 3 }} />
                <Typography variant="body1" mb={2}>
                    My tech journey started in high school, where two incredible
                    teachers taught me many new skills and helped develop my
                    passion for the industry. I have then continued learning
                    through university and personal projects.
                </Typography>
                <Typography variant="body1" mb={2}>
                    I started learning the structure of code using Scratch and
                    quickly moved on to Python, where I built small programs and
                    continued improving my skills through 4 years in high
                    school. Alongside learning Python, I also began learning web
                    development, starting with basic HTML, CSS, and JavaScript.
                    In my later years at high school, I learned about databases
                    and started building websites using PHP that interacted with
                    SQL databases. In my final year, I got my first taste of
                    Java after my teacher got permission to use a university's
                    course content. You can see many of the projects I built at
                    high school below.
                </Typography>
                <Typography variant="body1" mb={2}>
                    At the end of my second year, I had the opportunity to do a
                    summer course through{" "}
                    <Link
                        href="https://nextwork.org/"
                        target="_blank"
                        color="primary.dark"
                    >
                        NextWork
                    </Link>{" "}
                    and learn AWS. I had used AWS for one trimester at uni and
                    saw this as a great way to understand the cloud better. The
                    team at NextWork provided the best content over several
                    weeks, with a real-world project in the mix too. This led me
                    to sit and{" "}
                    <Box fontWeight="fontWeightMedium" display="inline">
                        pass
                    </Box>{" "}
                    the AWS Cloud Practitioner exam.
                </Typography>
                <Typography variant="body1">
                    I am now pursuing a job working with AWS, being a full-stack
                    web developer, or just developing using Python and Java. I
                    would love a position where I can enjoy my work and help a
                    community, big or small.
                </Typography>
            </Box>
            <Box id="languages-tools" mt={5} width="100%">
                <Typography variant="h4" textAlign="left" mb={1}>
                    Languages and Tools
                </Typography>
                <Divider sx={{ mb: 2, borderBottomWidth: 3 }} />
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        justifyContent: "center",
                    }}
                >
                    {languages.map((language) => (
                        <ProgrammingCard
                            key={language.title}
                            title={language.title}
                            level={language.level}
                            description={language.description}
                        />
                    ))}
                </Box>
            </Box>
            <Box id="awards-certifications" mt={5} width="100%">
                <Typography variant="h4" textAlign="left" mb={1}>
                    Awards and Certifications
                </Typography>
                <Divider sx={{ mb: 2, borderBottomWidth: 3 }} />
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        justifyContent: "center",
                    }}
                >
                    <AwardCard
                        title="AWS Certified Cloud Practitioner"
                        img={require("./images/aws-logo.png")}
                        link="https://www.credly.com/badges/abd5711a-990c-4b6b-a43e-bf6cf300bb03/public_url"
                    />
                    <AwardCard
                        title="Certificate of Approval (Security Guard)"
                        img={require("./images/moj-logo.png")}
                        link="https://forms.justice.govt.nz/search/PSPLA/"
                        addition="ID: 21-082641"
                    />
                    <AwardCard
                        title="Queen Scout Award"
                        img={require("./images/scouts-logo.png")}
                    />
                </Box>
            </Box>
            <Box id="projects" mt={5} width="100%">
                <Typography variant="h4" textAlign="left" mb={1}>
                    Projects
                </Typography>
                <Divider sx={{ mb: 2, borderBottomWidth: 3 }} />
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        justifyContent: "center",
                    }}
                >
                    <ProjectCard
                        title="Teach Python"
                        link={"./projects/teach-python"}
                        tags={["Python", "HTML", "CSS", "JS"]}
                    />
                    <ProjectCard
                        title="Cotiss Feedback"
                        link={"./projects/cotiss"}
                        tags={["PHP", "HTML", "CSS"]}
                    />
                </Box>
            </Box>
        </Container>
    );
};

export default DevPage;
