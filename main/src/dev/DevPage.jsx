import React from "react";
import { Box, Container, Divider, Typography } from "@mui/material";
import languages from "./Languages.js";
import ProgrammingCard from "./ProgrammingCard";
import AwardCard from "./AwardCard.jsx";

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
                <Typography variant="h3" textAlign="left" mb={1}>
                    How did I get here?
                </Typography>
                <Divider sx={{ mb: 2, borderBottomWidth: 3 }} />
                <Typography variant="body1" mb={3}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Eget arcu dictum varius duis at consectetur lorem.
                    Purus faucibus ornare suspendisse sed nisi lacus sed. Dictum
                    non consectetur a erat. Mi tempus imperdiet nulla malesuada.
                    Fermentum posuere urna nec tincidunt. Fermentum odio eu
                    feugiat pretium nibh ipsum consequat nisl. Sit amet
                    consectetur adipiscing elit duis. Dignissim suspendisse in
                    est ante in nibh mauris cursus. Semper eget duis at tellus
                    at urna condimentum mattis. Lobortis mattis aliquam faucibus
                    purus in massa tempor nec feugiat. Iaculis urna id volutpat
                    lacus laoreet non. Turpis massa sed elementum tempus egestas
                    sed sed risus. Non curabitur gravida arcu ac tortor
                    dignissim. Aliquam ultrices sagittis orci a scelerisque
                    purus semper eget. Sit amet aliquam id diam maecenas. Purus
                    gravida quis blandit turpis cursus in hac habitasse. Ac
                    feugiat sed lectus vestibulum mattis ullamcorper velit sed
                    ullamcorper.
                </Typography>
                <Typography variant="body1">
                    Turpis tincidunt id aliquet risus feugiat in ante metus.
                    Vitae sapien pellentesque habitant morbi tristique senectus
                    et netus. Viverra orci sagittis eu volutpat odio facilisis
                    mauris sit amet. Amet nisl purus in mollis nunc sed id
                    semper risus. Urna nunc id cursus metus aliquam eleifend. Id
                    diam vel quam elementum pulvinar etiam. Quis ipsum
                    suspendisse ultrices gravida dictum fusce. Lorem donec massa
                    sapien faucibus et molestie. Et tortor consequat id porta
                    nibh venenatis cras sed felis. Egestas dui id ornare arcu
                    odio. Neque laoreet suspendisse interdum consectetur libero
                    id faucibus nisl tincidunt. Orci porta non pulvinar neque
                    laoreet suspendisse interdum consectetur.
                </Typography>
            </Box>
            <Box id="languages-tools" mt={5} width="100%">
                <Typography variant="h3" textAlign="left" mb={1}>
                    Languages and Tools
                </Typography>
                <Divider sx={{ mb: 2, borderBottomWidth: 3 }} />
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
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
                <Typography variant="h3" textAlign="left" mb={1}>
                    Awards and Certifications
                </Typography>
                <Divider sx={{ mb: 2, borderBottomWidth: 3 }} />
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
                    <AwardCard title="AWS Certified Cloud Practitioner" img={require("./images/aws-logo.png")} link="https://www.credly.com/badges/abd5711a-990c-4b6b-a43e-bf6cf300bb03/public_url" />
                    <AwardCard title="Certificate of Approval (Security Guard)" img={require("./images/moj-logo.png")} link="https://forms.justice.govt.nz/search/PSPLA/" addition="ID: 21-082641" />
                    <AwardCard title="Queen Scout Award" img={require("./images/scouts-logo.png")} />
                </Box>
            </Box>
            <Box id="projects" mt={5} width="100%">
                <Typography variant="h3" textAlign="left" mb={1}>
                    Projects
                </Typography>
                <Divider sx={{ mb: 2, borderBottomWidth: 3 }} />
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
                    
                </Box>
            </Box>
        </Container>
    );
};

export default DevPage;
