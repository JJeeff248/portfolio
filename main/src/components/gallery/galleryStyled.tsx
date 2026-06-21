import { Card, Box, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";

export const ImageCard = styled(Card)(() => ({
    width: "100%",
    cursor: "pointer",
    overflow: "hidden",
    borderRadius: "1rem",
    transition: "transform 0.3s ease",
    position: "relative",
    "&:hover": {
        transform: "scale(1.03)",
    },
    "&:hover .image-caption": {
        opacity: 1,
    },
}));

export const ModalImage = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "1200px",
    maxHeight: "90vh",
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
        width: "95%",
    },
}));

export const NavButton = styled(IconButton)(({ theme }) => ({
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    color: "white",
    "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    zIndex: 10,
    [theme.breakpoints.down("sm")]: {
        top: "50%",
        width: 48,
        height: 48,
    },
}));

export const ImageCaption = styled(Box)(({ theme }) => ({
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "white",
    padding: theme.spacing(1),
    transition: "opacity 0.3s ease",
    opacity: 0,
}));
