import React from "react";
import { Avatar, Typography } from "@mui/material";
import { Container, keyframes } from "@mui/system";
import logo from "./logo.svg";

const spin = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

const DevPage = () => {
    return (
        <Container
            maxWidth="md"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "90vh",
                flexDirection: "column",
            }}
        >
            <Avatar
                src={logo}
                alt="logo"
                variant="rounded"
                sx={{
                    width: 300,
                    height: 300,
                    mb: 5,
                    animation: `${spin} infinite 20s linear`,
                }}
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
