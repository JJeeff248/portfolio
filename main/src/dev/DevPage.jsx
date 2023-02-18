import React from "react";
import { Box, Container, Divider, Typography } from "@mui/material";
import { Container, keyframes } from "@mui/system";
import logo from "../logo.svg";

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
            />
            <Typography
                variant="h3"
                component="h1"
                fontFamily={"Courier New, monospace"}
                fontWeight="bold"
            >
                Big things coming soon!
            </Typography>
        </Container>
    );
};

export default DevPage;
