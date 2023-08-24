import { Typography } from "@mui/material";
import { Container, Box } from "@mui/system";
import React from "react";
import { isMobile } from "react-device-detect";

const About = () => {
    return (
        <Container
            maxWidth={"lg"}
            sx={{ mt: 2 }}
            style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
            }}
        >
            <img
                src={"https://static.chris-sa.com/about.webp"}
                alt="Donkey at a petting zoo"
                loading="lazy"
                style={{ maxWidth: 500 }}
            />
            <Box component="div" sx={{ padding: 2 }}>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Photography has been a passion of mine since I was about
                    nine years old, walking around behind the official
                    photographer at a family friend's wedding with mum's camera.
                    He took the time to mentor me and didn't mind that I was
                    getting under his feet. Shortly afterwards, my parents
                    bought me my first camera for my 10th birthday off Trade Me.
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    I am currently studying at university, completing a Bachelor
                    of Science, Majoring in Computer Science. I was privileged
                    enough to be mentored by a professional photographer, Angie
                    Curtis, of Treasuring Hearts Photography. I assisted Angie
                    with her photo shoots on the weekends and during school
                    holidays if she needed me, and I gained invaluable
                    experience and knowledge.
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                    I attended the National Scout Photography School, where I
                    was awarded the "Most Improved Photographer" for my
                    improvement over the week spent with tutors and other
                    photographers. The school taught me that there are photo
                    opportunities in everyday things and to take the time to see
                    them.
                </Typography>
            </Box>
        </Container>
    );
};

export default About;
