import { Alert, Button, IconButton, TextField } from "@mui/material";
import { Container } from "@mui/system";
import React from "react";
import { isMobile } from "react-device-detect";
import Axios from 'axios';

import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";

// RegEx for input validation
const nameRegex = /^[a-zA-Z -]{2,30}$/;
const emailRegex =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|".+")@((\[\d{1,3}\.\d]{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/;
const messageRegex = /^.{10,300}$/;

const Contact = () => {
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [alertOpen, setAlertOpen] = React.useState(false);
    const [messageSent, setMessageSent] = React.useState(false);

    const [nameError, setNameError] = React.useState("");
    const [emailError, setEmailError] = React.useState("");
    const [messageError, setMessageError] = React.useState("");

    const validateName = (value) => {
        setName(value);
        let valid = name.match(nameRegex);
        valid
            ? setNameError("")
            : setNameError(
                  "Name must be between 2-30 characters and only contain letters, spaces, and hyphens"
              );
        return valid;
    };

    const validateEmail = (value) => {
        setEmail(value);
        let valid = email.match(emailRegex);
        valid
            ? setEmailError("")
            : setEmailError(
                  "Invalid email. Should be in the format of yourname@yourdomain.com"
              );
        return valid;
    };

    const validateMessage = (value) => {
        setMessage(value);
        let valid = message.match(messageRegex);
        valid
            ? setMessageError("")
            : setMessageError("Message must be between 10 and 300 characters");
        return valid;
    };

    const handleSubmit = () => {
        if (
            !validateName(name) ||
            !validateEmail(email) ||
            !validateMessage(message)
        ) {
            return;
        }

        const data = {
            name: name,
            email: email,
            message: message,
        };

        Axios.post("https://api.chris-sa.com/contact", data).then((response) => {
            console.log(response);
            if (response.status === 200) {
                setMessageSent(true);
                setAlertOpen(true);
                setName("");
                setEmail("");
                setMessage("");
            } else {
                setMessageSent(false);
                setAlertOpen(true);
            }

            setTimeout(() => {
                setAlertOpen(false);
            }, 3000);
        }).catch((error) => {
            console.log(error);
            setMessageSent(false);
            setAlertOpen(true);

            setTimeout(() => {
                setAlertOpen(false);
            }, 3000);
        });
    };

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
                src={require("./images/contact.jpg")}
                alt="Close up of fly on a tree"
                loading="lazy"
                style={{ maxHeight: isMobile ? "100vh" : "50vh" }}
            />
            <Container
                sx={{ mt: 2 }}
                style={{ display: "flex", flexDirection: "column" }}
            >
                <TextField
                    label="Name"
                    variant="outlined"
                    sx={{ mt: 3 }}
                    value={name}
                    onChange={(e) => {
                        validateName(e.target.value);
                    }}
                    error={nameError !== ""}
                    helperText={nameError !== "" ? nameError : ""}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    sx={{ mt: 3 }}
                    value={email}
                    onChange={(e) => {
                        validateEmail(e.target.value);
                    }}
                    error={emailError !== ""}
                    helperText={emailError !== "" ? emailError : ""}
                />
                <TextField
                    label="Message"
                    variant="outlined"
                    sx={{ mt: 3 }}
                    value={message}
                    multiline
                    rows={5}
                    onChange={(e) => {
                        validateMessage(e.target.value);
                    }}
                    error={messageError !== ""}
                    helperText={messageError !== "" ? messageError : ""}
                />
                <Button
                    variant="contained"
                    sx={{ mt: 3, height: 50 }}
                    color="success"
                    onClick={handleSubmit}
                >
                    Send
                </Button>
                {alertOpen &&
                    (messageSent ? (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            Message sent!
                        </Alert>
                    ) : (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            Message failed to send.
                        </Alert>
                    ))}
                <Container
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                    }}
                    sx={{ mt: 2 }}
                >
                    <IconButton
                        href="https://www.instagram.com/CSPhotographyNZ"
                        target="_blank"
                        size="large"
                    >
                        <InstagramIcon />
                    </IconButton>
                    <IconButton
                        href="https://www.facebook.com/CSPhotographyNZ"
                        target="_blank"
                        size="large"
                    >
                        <FacebookIcon />
                    </IconButton>
                </Container>
            </Container>
        </Container>
    );
};

export default Contact;
