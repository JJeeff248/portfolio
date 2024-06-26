import React from "react";
import { Box, Divider, Link, Typography } from "@mui/material";
import languages from "./Languages.js";
import ProgrammingCard from "./ProgrammingCard";
import AwardCard from "./AwardCard.jsx";
import ProjectCard from "./ProjectCard.jsx";
import { isMobile } from "react-device-detect";

const DevPage = () => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                m: "0 auto",
                mt: 5,
                mb: 6,
                maxWidth: isMobile ? "90vw" : "70vw"
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
                    through university and personal <Link href="#projects" color="primary.dark">projects</Link>.
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
                    to sit and pass the AWS Cloud Practitioner exam.
                </Typography>
                <Typography variant="body1">
                    I am now pursuing a job as a back-end web developer, 
                    working with a team of amazing people for a company that is
                    willing to help the next generation of developers learn.
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
                        gap: 1.5,
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
                        justifyContent: isMobile ? "center" : "flex-start",
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
                        gap: 1,
                        justifyContent: isMobile ? "center" : "flex-start",
                    }}
                >
                    <ProjectCard
                        title="Twenty Three Fifty Nine"
                        img={require("./images/2359.png")}
                        link={"https://twentythreefiftynine.com"}
                        github="https://github.com/Twenty-Three-Fifty-Nine/grade-tracker"
                        tags={["ReactJS", "Lambdas", "DynamoDB", "SES"]}
                    />
                    <ProjectCard
                        title="Cotiss Feedback"
                        link={"/projects/cotiss/index.html"}
                        github="https://github.com/jjeeff248/cotiss-project"
                        tags={["ElasticBeanstalk", "DynamoDB", "PHP", "CSS"]}
                    />
                    <ProjectCard
                        title="Chap's Challenge"
                        img={require("./images/chaps-challenge.png")}
                        github="https://github.com/jjeeff248/chaps-challenge"
                        tags={["Java", "XML", "GIT"]}
                    />
                    <ProjectCard
                        title="Help a Mate"
                        img={require("./images/helpamate.png")}
                        link={"http://helpamate.chris-sa.com/"}
                        github="https://github.com/JJeeff248/HelpAMate"
                        tags={["PHP", "Docker", "GCP", "CSS", "JS", "MySQL"]}
                    />
                    <ProjectCard
                        title="Teach Python"
                        link={"/projects/teach-python/index.html"}
                        tags={["Python", "HTML", "CSS", "JS"]}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default DevPage;
